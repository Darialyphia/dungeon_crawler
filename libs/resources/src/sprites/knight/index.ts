import json from './knight.json';

const getFramesFromState = (state: string) =>
  json.frames
    .filter(frame => frame.filename.startsWith(`knight:${state}`))
    .reduce((total, frame) => total + frame.duration, 0);

export const knight = {
  states: {
    idle: {
      animationDuration: getFramesFromState('idle')
    },
    walking: {
      animationDuration: getFramesFromState('walking')
    },
    attacking: {
      animationDuration: getFramesFromState('attacking')
    }
  }
};
