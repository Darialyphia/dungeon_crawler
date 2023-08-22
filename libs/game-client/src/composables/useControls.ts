import { Nullable, dist } from '@dungeon-crawler/shared';
import { PortalEntity } from '@dungeon-crawler/game-engine/src/features/map/factories/portal.factory';
import { useGameState } from './useGameState';
import { useCurrentPlayer, useCurrentPlayerId } from './useCurrentPlayer';
import { useApplication } from 'vue3-pixi';
import { useDispatch } from './useDispatch';
import { useCamera } from './useCamera';

export const useControls = () => {
  const state = useGameState();
  const dispatch = useDispatch();
  const playerId = useCurrentPlayerId();
  const player = useCurrentPlayer();
  const app = useApplication();
  const camera = useCamera();

  const pressedKeys = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  const keyMap = {
    KeyD: 'right',
    KeyA: 'left',
    KeyW: 'up',
    KeyS: 'down'
  } satisfies Record<string, keyof typeof pressedKeys>;

  const onInteract = () => {
    const interactables = state.state.value.snapshot.portals;

    const closest = Object.values(interactables)
      .filter(
        entity =>
          dist(entity.bbox, player.value!.bbox) <= entity.interactive.activationRange
      )
      .reduce((acc, current) => {
        if (!acc) return current;
        return dist(current.bbox, player.value!.bbox) < dist(acc.bbox, player.value!.bbox)
          ? current
          : acc;
      }, null as Nullable<PortalEntity>);

    if (!closest) return;
    if (!closest.interactive.isEnabled) return;

    return dispatch({
      type: 'interact',
      payload: {
        entityId: closest.entity_id,
        playerId
      }
    });
  };

  const keyboardHandler = (isOn: boolean) => (e: KeyboardEvent) => {
    e.preventDefault();
    const { code } = e;

    const control = keyMap[code as keyof typeof keyMap];
    if (control) {
      pressedKeys[control] = isOn;
    }

    switch (code) {
      case 'KeyD':
      case 'KeyA':
      case 'KeyW':
      case 'KeyS':
        return dispatch({
          type: 'move',
          payload: { ...pressedKeys, playerId }
        });
      case 'KeyF':
        return isOn && onInteract();

      default:
        return;
    }
  };

  const onKeydown = keyboardHandler(true);
  const onKeyup = keyboardHandler(false);

  useEventListener(window, 'keydown', onKeydown);
  useEventListener(window, 'keyup', onKeyup);

  app.value.view.addEventListener?.('click', e => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const { clientX, clientY } = e as MouseEvent;
    const mousePosition = { x: clientX - rect.left, y: clientY - rect.top };
    const cameraBbox = camera.gViewport.value;

    dispatch({
      type: 'attack',
      payload: {
        playerId,
        target: {
          x:
            (mousePosition.x * camera.gViewport.value.width) / rect.width +
            cameraBbox.minX,
          y:
            (mousePosition.y * camera.gViewport.value.height) / rect.height +
            cameraBbox.minY
        }
      }
    });
  });
};
