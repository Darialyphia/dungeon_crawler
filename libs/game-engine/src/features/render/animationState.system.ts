import { GameZoneState } from '../../gameZone';
import { ECSSystem } from '../ecs/ECSSystem';
import {
  Animatable,
  Spritable,
  animatable,
  spritable
} from '../render/render.components';
import { sprites } from '@dungeon-crawler/resources/src/sprites';

export const animationStateSystem = (
  zone: GameZoneState
): ECSSystem<[Spritable, Animatable]> => {
  return {
    target: [spritable.brand, animatable.brand],
    run(world, props, entities) {
      entities.forEach(entity => {
        const state = sprites[entity.spritable.sprite].states[entity.animatable.state];
        const elapsed = props.totalTime - entity.animatable.lastChangedAt;

        if (elapsed > state.animationDuration && !state.loop) {
          entity.animatable.state = 'idle';
          entity.animatable.lastChangedAt = props.totalTime;
        }
      });
    }
  };
};
