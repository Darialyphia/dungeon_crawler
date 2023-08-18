import { Nullable, dist } from '@dungeon-crawler/shared';
import { Dispatcher } from './useDispatch';
import { GameState } from './useGameState';
import { useKeydownOnce } from './useKeydownOnce';
import { PortalEntity } from '@dungeon-crawler/game-engine/src/features/map/portal.factory';

export const useControls = (dispatch: Dispatcher, playerId: string, state: GameState) => {
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

  const players = computed(() => Object.values(state.state.value.snapshot.players));

  const onInteract = () => {
    const player = players.value.find(p => p.player.id === playerId)!;
    const interactables = state.state.value.snapshot.portals;

    const closest = Object.values(interactables)
      .filter(
        entity => dist(entity.bbox, player.bbox) <= entity.interactive.activationRange
      )
      .reduce((acc, current) => {
        if (!acc) return current;
        return dist(current.bbox, player.bbox) < dist(acc.bbox, player.bbox)
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

  useKeydownOnce(onKeydown);
  useEventListener(window, 'keyup', onKeyup);
};
