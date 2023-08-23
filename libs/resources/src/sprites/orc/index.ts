import { getFramesFromState } from '../../utils';
import json from './orc.json';

export const orc = {
  states: {
    idle: {
      animationDuration: getFramesFromState(json, 'idle'),
      loop: true
    },
    walking: {
      animationDuration: getFramesFromState(json, 'walking'),
      loop: true
    },
    attacking: {
      animationDuration: getFramesFromState(json, 'attacking'),
      loop: false
    },
    hit: { animationDuration: getFramesFromState(json, 'hit'), loop: false }
  }
};
