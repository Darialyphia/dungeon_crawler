import 'express-async-errors';
import express, { Express } from 'express';
import history from 'connect-history-api-fallback';
import * as swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { createExpressEndpoints } from '@ts-rest/express';
import { ERROR_KINDS, contract } from '@dungeon-crawler/contract';
import { errorFactory } from '../../utils/errorFactory';
import { router } from '../../router';
import cookieParser from 'cookie-parser';
import { generateOpenApi } from '@ts-rest/open-api';
import { config } from '../../config';
import { corsMiddleware } from './middlewares/cors.middleware';
import { requestScopeMiddleware } from './middlewares/requestScope.middleware';
import { authMiddleware } from '../auth/auth.middleware';

export const createApp = () => {
  const app = express();

  const openApiDocument = generateOpenApi(
    contract,
    {
      info: {
        title: 'Idle game API',
        version: '1.0.0'
      }
    },
    {
      setOperationId: false
    }
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(corsMiddleware);
  app.use(cookieParser(config.COOKIE.SECRET));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  createExpressEndpoints(contract, router, app, {
    globalMiddleware: [requestScopeMiddleware, authMiddleware],
    requestValidationErrorHandler: (err, req, res) => {
      res
        .status(400)
        .json(
          req.container.cradle.errorMapper.toResponse(
            errorFactory.badRequest({ kind: ERROR_KINDS.VALIDATION_ERROR })
          )
        );
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const staticFileMiddleware = express.static('public');
    app.use(staticFileMiddleware);

    app.use(
      history({
        index: '/index.html'
      })
    );

    // 2nd call for redirected requests
    app.use(staticFileMiddleware);
  }

  app.use((req, res) => res.send(`Not Found: ${req.url}`));

  return app;
};
