import { Dispatcher } from './useDispatch';
import { useKeydownOnce } from './useKeydownOnce';

export const useControls = (dispatch: Dispatcher, playerId: string) => {
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

  const keyboardHandler = (isOn: boolean) => (e: KeyboardEvent) => {
    e.preventDefault();
    const { code } = e;

    const control = keyMap[code as keyof typeof keyMap];

    if (!control) return;
    pressedKeys[control] = isOn;

    switch (code) {
      case 'KeyD':
      case 'KeyA':
      case 'KeyW':
      case 'KeyS':
        return dispatch({
          type: 'move',
          payload: { ...pressedKeys, playerId }
        });
      default:
        return;
    }
  };

  const onKeydown = keyboardHandler(true);
  const onKeyup = keyboardHandler(false);

  useKeydownOnce(onKeydown);
  useEventListener(window, 'keyup', onKeyup);
};
