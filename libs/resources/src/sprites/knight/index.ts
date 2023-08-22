import { getFramesFromState } from '../../utils';
import json from './knight.json';

export const knight = {
  states: {
    idle: {
      animationDuration: getFramesFromState(json, 'idle')
    },
    walking: {
      animationDuration: getFramesFromState(json, 'walking')
    },
    attacking: {
      animationDuration: getFramesFromState(json, 'attacking')
    }
  }
};
