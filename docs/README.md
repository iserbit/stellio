# Stellio Development Documentation

Tile-matching game based on Bejeweled with the movie Interstellar theme.

## Mechanics
- A player starts with 10 lives

- There are 5 different elements to match
  - Earth (Blue)
  - Mars (Red)
  - Saturn (Orange)
  - Venus (Yellow)
  - Mercury (White)
  - Black Hole (Black)

- A match of 3 planets award 100 points
- A match of 4 planets award 300 points
- A match of 5 planets award 1000 points

- A match of 3+ black holes subtract 1 life

## Functionality

- [ ] The user can start/restart the game
- [ ] The game keeps the scoreboard
- [ ] The tile tracks its element and position
- [ ] The board populates with a random seed of tiles
- [ ] A user can move a tile non-diagonally to match 3+ elements

## Implementation

Utilizes Easel.js as a wrapper for Canvas

#### `game.js`
Handles the logic for the gameplay and the user interaction

#### `board.js`
Handles the DOM rendering of the board and tiles

#### `tile.js`
Stoeres the necessary data for the tile object

## Timeline

#### Day 0
- Draft the development documentation
- Setup the repository structure
- Prepare Easel.js importation

#### Day 1
- Create graphics for the game
  - Board border
  - Tile elements
- Render the board and the tiles

#### Day 2
- Implement the game logic with manual position input

#### Day 3
- Implement mouse-based user interaction
