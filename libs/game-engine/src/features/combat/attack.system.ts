import { dist } from '@dungeon-crawler/shared';
import { GameZoneState } from '../../gameZone';
import { ECSEntity } from '../ecs/ECSEntity';
import { ECSSystem } from '../ecs/ECSSystem';
import { BBox, bbox, orientation, rectToBBox } from '../physics/physics.components';
import { Player, player } from '../player/player.components';
import {
  Animatable,
  Spritable,
  animatable,
  spritable
} from '../render/render.components';
import { Attacker, attacker } from './combat.components';
import { sprites } from '@dungeon-crawler/resources/src/sprites';
import { Monster, monster } from '../monster/monster.components';

export const attackSystem = (
  zone: GameZoneState
): ECSSystem<[Attacker, Spritable, Animatable]> => {
  const handlePlayerAttack = (player: ECSEntity & BBox & Attacker & Player) => {
    const { range, shape } = player.player.character.attack;

    const attackBbox = rectToBBox({
      x: player.bbox.x,
      y: player.bbox.y,
      width: range,
      height: range
    });

    const struckEntities = zone.tree
      .search(attackBbox)
      .filter<ECSEntity & BBox & Monster & Animatable & Spritable>(
        (entity): entity is ECSEntity & BBox & Monster & Animatable & Spritable => {
          if (shape === 'arc' && dist(entity.bbox, attackBbox) > range) {
            return false;
          }
          return monster.has(entity) && animatable.has(entity) && spritable.has(entity);
        }
      );

    struckEntities.forEach(entity => {
      entity.animatable.state = 'hit';
      if (orientation.has(entity)) {
        entity.orientation = player.bbox.x < entity.bbox.x ? 'left' : 'right';
      }
      setTimeout(() => {
        entity.animatable.state = 'idle';
      }, sprites[entity.spritable.sprite].states.hit.animationDuration);
    });
  };

  return {
    target: [attacker.brand, spritable.brand, animatable.brand],
    run(world, props, entities) {
      entities.forEach(entity => {
        if (entity.animatable.state !== 'attacking') {
          entity.attacker.target = null;
          return;
        }

        if (!entity.attacker.target) return;

        if (orientation.has(entity) && bbox.has(entity)) {
          entity.orientation =
            entity.attacker.target.x > entity.bbox.x ? 'right' : 'left';
        }

        if (player.has(entity) && bbox.has(entity)) {
          handlePlayerAttack(entity);
        }
      });
    }
  };
};
