import { GameZoneState } from '../../gameZone';
import { ECSSystem } from '../ecs/ECSSystem';
import { animatable, spritable } from '../render/render.components';
import { Attacker, attacker } from './combat.components';
import { sprites } from '@dungeon-crawler/resources/src/sprites';

export const attackSystem = (zone: GameZoneState): ECSSystem<[Attacker]> => {
  return {
    target: [attacker.brand],
    run(world, props, entities) {
      entities.forEach(entity => {
        if (!entity.attacker.attackStartedAt) return;
        if (!spritable.has(entity)) return;
        if (!animatable.has(entity)) return;

        const elapsed = props.totalTime - entity.attacker.attackStartedAt;
        const duration: number =
          sprites[entity.spritable.sprite as keyof typeof sprites].states.attacking
            .animationDuration;

        if (elapsed > duration) {
          entity.animatable.state = 'idle';
          entity.attacker.attackStartedAt = null;
        }
      });
    }
  };
};
