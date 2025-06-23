# Game Mechanics

## Overview

Core building blocks and mechanisms that form the foundation of abstract strategy games. This section catalogs proven mechanics, their variations, and guidelines for combining them effectively.

## Classification
- **Domain:** Design Components
- **Stability:** Semi-stable
- **Abstraction:** Structural
- **Confidence:** Established

## Mechanic Categories

### Board & Space
Spatial structures and topologies for gameplay
- **Location:** [[board-topologies/index.md]]
- **Contains:** Grids, graphs, 3D spaces, dynamic boards

### Piece Systems
Types and behaviors of game pieces
- **Location:** [[piece-systems/index.md]]
- **Contains:** Identical pieces, ranked pieces, transforming pieces

### Movement Mechanics
How pieces navigate the game space
- **Location:** [[movement-mechanics/index.md]]
- **Contains:** Sliding, jumping, teleporting, momentum-based

### Capture & Removal
Methods for eliminating opponent pieces
- **Location:** [[capture-removal/index.md]]
- **Contains:** Replacement, jumping, surrounding, conversion

### Territory & Control
Area dominance and influence mechanics
- **Location:** [[territory-control/index.md]]
- **Contains:** Enclosure, majority, influence spread, borders

### Connection & Networks
Path building and linking mechanics
- **Location:** [[connection-networks/index.md]]
- **Contains:** Path creation, network building, circuit completion

### Victory Conditions
Ways to win the game
- **Location:** [[victory-conditions/index.md]]
- **Contains:** Elimination, connection, pattern, accumulation

### Timing & Tempo
Turn structure and time-based mechanics
- **Location:** [[timing-tempo/index.md]]
- **Contains:** Simultaneous play, action points, tempo control

## Core Mechanism Toolkit

### Essential Mechanics

#### 1. Placement
- **Basic**: Put piece on empty space
- **Variations**: Limited placements, conditional placement, chain placement
- **Games Using**: Go, Hex, Reversi

#### 2. Movement
- **Basic**: Move piece to new position
- **Variations**: Sliding, stepping, jumping, flying
- **Games Using**: Chess, Checkers, Chinese Checkers

#### 3. Capture
- **Basic**: Remove opponent piece
- **Variations**: Replacement, jumping, surrounding, conversion
- **Games Using**: Chess, Checkers, Go

#### 4. Connection
- **Basic**: Create paths between points
- **Variations**: Edge connection, vertex connection, group connection
- **Games Using**: Hex, Twixt, Havannah

#### 5. Territory
- **Basic**: Control areas of board
- **Variations**: Enclosure, majority, influence
- **Games Using**: Go, Reversi, Blokus

#### 6. Pattern Formation
- **Basic**: Arrange pieces in specific configurations
- **Variations**: Lines, shapes, sequences
- **Games Using**: Gomoku, Pente, Connect Four

### Interaction Patterns

#### Blocking
Preventing opponent actions through positioning
- Defensive placement
- Path interruption  
- Access denial

#### Forcing
Creating situations requiring specific responses
- Check-like threats
- Tempo plays
- Zugzwang positions

#### Trading
Exchanging advantages for different benefits
- Material for position
- Tempo for territory
- Flexibility for commitment

#### Building
Constructing advantageous structures
- Walls and barriers
- Networks and connections
- Power bases

## Mechanic Combinations

### Proven Combinations
1. **Movement + Capture**: Chess, Checkers
2. **Placement + Territory**: Go, Reversi  
3. **Connection + Blocking**: Hex, Twixt
4. **Pattern + Capture**: Pente, Ninuki-Renju
5. **Movement + Connection**: Amazons, Lines of Action

### Innovation Through Combination
- Take mechanics from different games
- Apply one mechanic's rules to another's goal
- Layer simple mechanics for emergence
- Invert traditional applications

### Compatibility Matrix
|  | Place | Move | Capture | Connect | Territory | Pattern |
|--|-------|------|---------|---------|-----------|---------|
| **Place** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Move** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Capture** | ✓ | ✓ | ⚠ | ✓ | ✓ | ✓ |
| **Connect** | ✓ | ✓ | ✓ | ⚠ | ✓ | ✓ |
| **Territory** | ✓ | ✓ | ✓ | ✓ | ⚠ | ✓ |
| **Pattern** | ✓ | ✓ | ✓ | ✓ | ✓ | ⚠ |

✓ = Combines well | ⚠ = Requires careful balance

## Design Considerations

### Choosing Core Mechanics
1. **Start with one** primary mechanic
2. **Add only if** it multiplies depth
3. **Remove if** players ignore it
4. **Test interaction** between all mechanics

### Balancing Mechanics
- Ensure each mechanic matters
- Avoid dominant strategies
- Create interesting tensions
- Enable multiple paths

### Common Pitfalls
- Too many mechanics dilute focus
- Redundant mechanics add complexity not depth
- Unbalanced mechanics create broken strategies
- Isolated mechanics feel tacked-on

## Relationships
- **Parent Nodes:** [[../index.md]]
- **Child Nodes:** Listed subcategories above
- **Related Nodes:**
  - [[../design-methodologies/index.md]] - guides - Mechanic selection
  - [[../creative-ideation/index.md]] - generates - Novel mechanics
  - [[../evaluation-testing/index.md]] - validates - Mechanic balance

## Sources
- Derived from "Abstract Strategy Game Design Framework.md"
- Analysis of classic abstract strategy games
- Modern game design innovations

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Updated By:** Assistant