# Game concept

## Summary

The game is an instance-based dungeon crawling game.

- Player have the ability to create a character and create a lobby where they can invite other players. They can also make the lobby public, in which case anybody can join at any point in time.
- They start in friendly starting zone that serves as a HUB for all kind of preparations beforea run (selecting build, shopping, crafting, etc).
- Then they enter the dungeon and progress through the floors, with scaling difficulty according to character level / floor / number of players etc. The run ends when all player leave the run or die. They will gain rewards according to how many floors they cleared.
- Players can unlock special rewards when clearing specific acheivements, like defeat X monsters, killing spree, complete X quest, defeat boss X in les than Y seconds, etc.

## Character progression

- Players progress and gain levels and equipement as they perform dungeon runs.
- Levels give you talent points to unlock passive and active skills.
- Equipment gives you stats, with very rare equipement giving more exciting bonuses like auras, additional skills, etc
- Additional player classes could be unlocked with specific acheivements to incentivize player to create new characters.

## Dungeon runs

- floors are procedurally generated
- different generation algorithm for different kind of environments: for example perlin noise for outdoors, rooms connected by corridors for indoors etc.
- We could have some static map with some chunk that are procedurally generated. For example boss maps: the way to the boss room is procedural, but the room itself is predetermined. This could also help have more interesting / visually appealing maps with static "landmarks".
- Content scales with highest player level in a lobby (with an additional modifier for the number of players), so the first floors of a run will always be adequate difficulty wise.
- the player gets the opportunity to leave a run after each completed floor (or every n floor / after a boss ?). If so they will get the normal reward for the run
- if they leave in the middle of a floor, or they die, they get diminished rewards ? This would make death more impactful, add an element of "Am I greedy and keep going at the risk of losing some progress if I die"
