import { AnyFunction, Nullable, isString } from '@dungeon-crawler/shared';
import { IoEvents } from '@dungeon-crawler/contract';
import { Server } from 'http';
import { Server as IoServer, Socket } from 'socket.io';
import { isLeft } from 'fp-ts/lib/Either';
import * as O from 'fp-ts/Option';
import { UserId } from '../user/user.entity';
import { AuthenticateUseCase } from '../auth/usecases/authenticate.usecase';
import { config } from '../../config';
import { errorFactory } from '../../utils/errorFactory';

export type Io = IoServer<
  IoEvents['CLIENT'],
  IoEvents['SERVER'],
  {},
  { userId: UserId }
> & {
  getSocketFromUserId: (
    userId: UserId
  ) => O.Option<Socket<IoEvents['CLIENT'], IoEvents['SERVER'], {}, { userId: UserId }>>;
};

export const createIo = ({
  server,
  authenticateUseCase
}: {
  server: Server;
  authenticateUseCase: AuthenticateUseCase;
}) => {
  const socketsByUserId = new Map<
    string,
    Socket<Socket<{}, IoEvents, {}, { userId: UserId }>>
  >();

  const handleCORS = (origin: Nullable<string>, callback: AnyFunction) => {
    if (!origin || config.CORS.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS'));
    }
  };

  const io: Io = new IoServer(server, {
    cors: {
      origin: handleCORS,
      methods: ['GET', 'POST']
    },
    pingInterval: 10_000
  }) as Io;

  io.getSocketFromUserId = (userId: UserId) =>
    O.fromNullable(socketsByUserId.get(userId));

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token as unknown;
      if (!token || !isString(token)) {
        throw errorFactory.unauthorized();
      }

      const user = await authenticateUseCase(token);
      if (isLeft(user)) {
        throw user.left;
      }
      socket.data.userId = user.right.id;
      socketsByUserId.set(user.right.id, socket);

      next();
    } catch (err) {
      next(err as Error);
    }
  });

  io.on('connection', socket => {
    socket.on('JOIN_ROOM', roomId => {
      socket.join(roomId);
    });
    socket.on('LEAVE_ROOM', roomId => {
      socket.leave(roomId);
    });
    socket.on('disconnect', () => {
      socketsByUserId.delete(socket.data.userId);
    });
  });

  return io;
};
