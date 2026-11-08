# Snuke

The snake game on a 24 × 24 board, with six modes: classic, no walls, maze, moult, 60-second time attack and orchards. Eat the fruit, grow, and don't bite your own tail.

*Version française : [README.md](README.md)*

## Controls

- **Arrow keys** or **WASD/ZQSD**, or **drag with the mouse**: turn.
- **P** or **Escape**: pause; an arrow key to resume.
- **Space** or **Enter**: play again after a game.

## Common rules

- Each fruit is worth **10 points** and makes the snake one cell longer.
- The snake speeds up every 6 fruits, up to a top speed.
- Every **7 fruits**, a **star** appears: it is worth **50 points** but vanishes after 5 seconds (it blinks before leaving).
- Biting your tail loses the game (except in time attack).

## Modes

- **Classic**: the edges of the board kill.
- **No walls**: leave on one side, come back on the other.
- **Maze**: four walled boards (corridors, cage, columns, zigzag); you move to the next one every 10 fruits.
- **Moult**: every 5 fruits, the tail turns to stone (obstacles that stay), the snake starts again with 3 cells and earns 25 points.
- **Time attack 60 s**: fixed speed, nothing kills. Biting yourself cuts the tail where you bit. Score as much as you can before time runs out.
- **Orchards**: three fruits on the board, out of ten kinds. The snake's speed becomes that of the **last fruit eaten**, and fast fruits are worth more:

| Fruit | Speed | Points | Grows by |
|---|---|---|---|
| Chilli | very fast | 50 | 1 |
| Strawberry | fast | 35 | 1 |
| Lemon | fast | 25 | 2 |
| Orange | fairly fast | 22 | 1 |
| Cherry | fairly fast | 18 | 2 |
| Apple | normal | 12 | 1 |
| Kiwi | slow | 12 | 2 |
| Grape | slow | 9 | 1 |
| Watermelon | very slow | 7 | 4 |
| Blueberry | very slow | 5 | 1 |

A gauge at the top of the board shows the current speed.

## Records and statistics

One record per mode, the number of games, the total fruit eaten and the longest length reached are shown at the top of the game.

## Data and sync

Records and statistics are stored by NeoDex, backed up and synced between your PCs when sync is on. On first launch, the plugin picks up what you already had in NeoDex.

## Install

In NeoDex: **NeoStore → Discover → Snuke → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
