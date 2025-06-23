# Board Topologies

## Overview

The spatial structure of the game board fundamentally shapes gameplay possibilities. This section catalogs different board topologies, their properties, and their impact on game dynamics.

## Classification
- **Domain:** Spatial Design
- **Stability:** Static
- **Abstraction:** Detailed
- **Confidence:** Established

## Major Topology Categories

### Grid-Based Boards
Regular tessellations and lattices
- **Square Grid**: 4-connected or 8-connected
- **Hexagonal Grid**: 6-connected, no diagonal ambiguity
- **Triangular Grid**: 3 or 6-connected, unique properties
- **Location:** [[grid-based.md]]

### Graph-Based Boards
Nodes and edges without regular geometry
- **Complete Graphs**: All nodes connected
- **Tree Structures**: No cycles, hierarchical
- **Custom Networks**: Designed connections
- **Location:** [[graph-based.md]]

### Continuous Spaces
Non-discrete positioning
- **Euclidean Plane**: Free placement
- **Bounded Regions**: Areas with rules
- **Measured Movement**: Distance-based
- **Location:** [[continuous-spaces.md]]

### Three-Dimensional Boards
Adding vertical dimension
- **Layered 2D**: Multiple connected levels
- **True 3D Grid**: Cubic lattice
- **3D Graphs**: Spatial networks
- **Location:** [[three-dimensional.md]]

### Dynamic Topologies
Boards that change during play
- **Modular Tiles**: Reconfigurable sections
- **Growing Boards**: Expansion during play
- **Morphing Geometry**: Changing connections
- **Location:** [[dynamic-topologies.md]]

### Unusual Geometries
Non-standard spatial structures
- **Torus/Cylinder**: Wrapped edges
- **Möbius Strip**: One-sided surface
- **Fractal Boards**: Self-similar patterns
- **Hyperbolic Plane**: Negative curvature
- **Location:** [[unusual-geometries.md]]

## Topology Properties

### Connectivity
How spaces relate to each other
- **Degree**: Number of adjacent spaces
- **Distance Metric**: How to measure separation
- **Symmetry**: Rotational/reflectional properties
- **Boundaries**: Edge behavior

### Strategic Properties
How topology affects gameplay
- **Chokepoints**: Natural bottlenecks
- **Center Advantage**: Value of position
- **Edge Effects**: Boundary strategies
- **Mobility Patterns**: Movement possibilities

### Complexity Factors
- **Node Count**: Total positions
- **Edge Density**: Connection richness
- **Diameter**: Maximum distance
- **Regularity**: Uniformity of structure

## Common Board Patterns

### Square Grids
**Standard Sizes**: 8×8 (Chess), 19×19 (Go), 10×10 (Checkers)
**Properties**:
- Simple cardinal movement
- Diagonal controversy
- Edge/corner dynamics
- Natural territory division

**Variations**:
- Offset rows (brick pattern)
- Different sizes (rectangular)
- Holes or obstacles
- Wrapped edges

### Hexagonal Grids
**Standard Patterns**: 11×11 (Hex), varied sizes
**Properties**:
- Equal distance neighbors
- No diagonal ambiguity
- Three natural axes
- Better circle approximation

**Variations**:
- Rhombus shape
- Hexagonal boundary
- Irregular edges
- Multiple connected regions

### Node Networks
**Common Types**: Star, ring, tree, mesh
**Properties**:
- Flexible connectivity
- Natural hierarchies
- Variable density
- Asymmetric options

**Design Process**:
1. Define key positions
2. Add strategic connections
3. Balance accessibility
4. Test path dynamics

## Choosing Topologies

### Match to Mechanics
- **Territory**: Grids work well
- **Connection**: Graphs or hex
- **Movement**: Consider mobility needs
- **Pattern**: Regular structures help

### Consider Complexity
- Simple mechanics → Complex topology OK
- Complex mechanics → Simple topology better
- Novel topology → Very simple rules

### Player Experience
- Familiar shapes reduce learning
- Unusual boards create interest
- Symmetry aids fairness perception
- Size affects game length

## Notation Considerations

### Grid Notation
- **Square**: Algebraic (a1, b2) or numeric (1,1)
- **Hex**: Various systems, consistency key
- **Triangular**: Often row/column based

### Graph Notation
- Node names or numbers
- Edge descriptions if needed
- Consistent orientation

### 3D Notation
- Layer/row/column
- Elevation markers
- Clear z-axis convention

## Examples in Games

### Classic Applications
- **Go**: 19×19 grid emphasizing territory
- **Hex**: Hexagonal grid for connection
- **Nine Men's Morris**: Graph-based movement
- **3D Tic-Tac-Toe**: Layered cubic grid

### Innovative Uses
- **Tash-Kalar**: Arena with special power points
- **GIPF Project**: Hexagonal with sliding edges
- **Santorini**: 5×5 with vertical building
- **Tak**: Square grid with 3D stacking

## Design Exercises

### Topology Exploration
1. Take familiar game mechanic
2. Apply to different topology
3. Note how strategy changes
4. Identify new possibilities

### Custom Board Creation
1. Define game's core tension
2. Design topology to enhance it
3. Add strategic features
4. Playtest and iterate

## Relationships
- **Parent Nodes:** [[../index.md]]
- **Sibling Nodes:** 
  - [[../movement-mechanics/index.md]] - constrains - How pieces can move
  - [[../territory-control/index.md]] - defines - What constitutes regions
- **Related Nodes:**
  - [[../../notation-systems/index.md]] - represents - Board positions
  - [[../../implementation/index.md]] - realizes - Physical/digital boards

## Sources
- Derived from "Abstract Strategy Game Design Framework.md"
- Mathematical topology principles
- Survey of existing game boards

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Updated By:** Assistant