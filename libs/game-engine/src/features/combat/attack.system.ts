import { GameZoneState } from '../../gameZone';
import { ECSSystem } from '../ecs/ECSSystem';
import { bbox, orientation } from '../physics/physics.components';
import {
  Animatable,
  Spritable,
  animatable,
  spritable
} from '../render/render.components';
import { Attacker, attacker } from './combat.components';
import { sprites } from '@dungeon-crawler/resources/src/sprites';

export const attackSystem = (
  zone: GameZoneState
): ECSSystem<[Attacker, Spritable, Animatable]> => {
  return {
    target: [attacker.brand, spritable.brand, animatable.brand],
    run(world, props, entities) {
      entities.forEach(entity => {
        if (!entity.attacker.attackStartedAt || !entity.attacker.target) return;

        const elapsed = props.totalTime - entity.attacker.attackStartedAt;
        const duration: number =
          sprites[entity.spritable.sprite].states.attacking.animationDuration;

        if (elapsed > duration) {
          entity.animatable.state = 'idle';
          entity.attacker.attackStartedAt = null;
        }

        if (orientation.has(entity) && bbox.has(entity)) {
          entity.orientation =
            entity.attacker.target.x > entity.bbox.x ? 'right' : 'left';
        }
      });
    }
  };
};
