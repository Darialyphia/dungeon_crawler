import { GameZoneState } from '../../gameZone';
import { ECSSystem } from '../ecs/ECSSystem';
import { playerState } from '../player/player.components';
import { spritable } from '../render/render.components';
import { Attacker, attacker } from './combat.components';
import { sprites } from '@dungeon-crawler/resources/src/sprites';

export const attackSystem = (zone: GameZoneState): ECSSystem<[Attacker]> => {
  return {
    target: [attacker.brand],
    run(world, props, entities) {
      entities.forEach(entity => {
        if (!entity.attacker.attackStartedAt) return;
        if (!spritable.has(entity)) return;
        if (!playerState.has(entity)) return;

        const elapsed = props.totalTime - entity.attacker.attackStartedAt;
        const duration: number =
          sprites[entity.spritable.sprite as keyof typeof sprites].states.attacking
            .animationDuration;

        if (elapsed > duration) {
          entity.playerState.state = 'idle';
          entity.attacker.attackStartedAt = null;
        }
      });
    }
  };
};
