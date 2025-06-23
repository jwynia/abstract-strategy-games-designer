# Abstract Strategy Game Brainstorming Framework

## Purpose
Generate a large quantity of diverse starting points for abstract strategy game design, avoiding the gravitational pull toward generic, statistically-probable concepts.

## Core Process

### Phase 1: Rapid Generation (Quantity First)
Use each technique below to generate 10-20 specific ideas. Don't evaluate quality yet - push for volume and weirdness.

### Phase 2: Expansion
Take the 5-10 most unusual ideas and push them to extremes.

### Phase 3: Combination
Merge disparate concepts from Phase 1 to create hybrid starting points.

### Phase 4: Filtering
Apply quick evaluation criteria to identify ideas worth prototyping.

---

## Generation Techniques

### 1. Mechanism Extraction from Non-Games

Extract core mechanics from other domains and translate to abstract strategy constraints.

**Source Domains:**
- **Physics**: Gravity wells, wave interference, magnetic fields, entropy
- **Biology**: Predator-prey cycles, viral spread, territorial marking, swarm behavior
- **Economics**: Supply/demand, market bubbles, resource depletion, trade routes
- **Chemistry**: Bonding rules, catalyst effects, phase transitions, reaction chains
- **Social Systems**: Voting coalitions, information cascades, trust networks
- **Architecture**: Load bearing, span limitations, foundation requirements

**Example Outputs:**
- Pieces that "decay" and must be refreshed by nearby pieces (entropy)
- Moves that create "waves" affecting pieces along specific patterns (wave mechanics)
- Pieces that form "bonds" limiting their individual movement (chemistry)
- "Market" squares where piece values fluctuate based on local density (economics)

**Template**: "[Domain phenomenon] where [game pieces/spaces] must [action/restriction]"

### 2. Extreme Property Isolation

Take one property of abstract games to an absolute extreme while maintaining playability.

**Properties to Isolate:**
- **Visibility**: What if seeing the board state was itself the main challenge?
- **Symmetry**: Perfect symmetry vs. extreme asymmetry
- **Permanence**: Nothing permanent vs. nothing changeable
- **Locality**: All effects global vs. effects only on adjacent spaces
- **Time**: Real-time elements within turn structure
- **Space**: 1D, 4D, non-Euclidean, or discontinuous boards
- **Information**: Delayed information propagation
- **Piece Identity**: Pieces with no fixed ownership

**Example Outputs:**
- Game where pieces are only visible when adjacent to your other pieces
- Every move must maintain perfect rotational symmetry
- Pieces exist only for one turn unless "refreshed"
- All pieces belong to whoever touched them last
- Board that wraps in non-intuitive ways (Klein bottle topology)

**Template**: "What if [property] was the ONLY thing that mattered?"

### 3. Impossible Constraint Challenges

Start with constraints that seem to make abstract strategy impossible, then find solutions.

**Constraint Categories:**
- **Spatial**: 1D board, disconnected boards, shrinking board
- **Temporal**: Simultaneous moves, moves affecting past states
- **Piece**: Single piece per player, pieces that split/merge, gaseous pieces
- **Information**: Board state changes between turns, quantum superposition
- **Victory**: No defined end state, victory conditions that change
- **Interaction**: Pieces can only affect themselves, no direct conflict

**Example Outputs:**
- Game on a line where depth comes from timing and tempo
- Pieces exist in probability clouds until observed
- Victory condition voted on by piece positions
- Pieces leave "trails" that become new pieces
- Board squares that exist in multiple states simultaneously

**Template**: "Design a game where [impossible constraint] but still strategic"

### 4. Anti-Pattern Starting Points

Design intentionally bad games, then systematically invert their properties.

**Bad Game Archetypes:**
- **Solvable**: First player always wins with perfect play
- **Chaotic**: No connection between decisions and outcomes  
- **Tedious**: Optimal play is boring and mechanical
- **Opaque**: Impossible to evaluate position quality
- **Degenerate**: One strategy dominates all others
- **Stalemate-prone**: Games always end in draws

**Inversion Process:**
1. Design the worst possible version
2. Identify why it fails
3. Invert the core failure mechanism
4. Keep any accidentally interesting elements

**Example Outputs:**
- Start with always-draw game → Add accumulating positional advantages
- Start with pure calculation game → Add pieces that change the rules
- Start with dominant strategy → Make that strategy vulnerable to specific counters

**Template**: "The worst game would be [X], so what if [opposite of X]?"

### 5. Mathematical Structure Mining

Extract patterns from mathematical structures and map to game mechanics.

**Source Structures:**
- **Graph Theory**: Hamiltonian paths, graph coloring, spanning trees
- **Number Theory**: Prime factorization, modular arithmetic, sequences
- **Geometry**: Tessellations, fractals, projective geometry
- **Topology**: Knots, surfaces, continuous deformations
- **Combinatorics**: Permutations, partitions, counting problems
- **Group Theory**: Symmetry groups, transformations, invariants

**Example Outputs:**
- Pieces move along Hamiltonian paths only
- Board positions valued by their prime factorization
- Fractal board where same patterns repeat at different scales
- Pieces that "knot" around each other in 3D
- Moves must preserve specific mathematical invariants

**Template**: "[Mathematical concept] determines [movement/victory/interaction]"

### 6. Interaction Primitive Combinations

List all possible two-piece interactions, then build games around unusual ones.

**Basic Interaction Types:**
- **Spatial**: Block, push, pull, swap, rotate, reflect
- **State Change**: Convert, mark, link, split, merge, copy
- **Temporal**: Delay, accelerate, freeze, rewind, echo
- **Conditional**: Trigger, enable, disable, require, prevent
- **Composite**: Combine properties, share abilities, form gestalts

**Combination Method:**
1. Pick two interaction types
2. Define exact trigger conditions
3. Build minimal game around this interaction

**Example Outputs:**
- Pieces that "echo" previous moves when triggered
- Blocking creates permanent "shadows" on the board
- Pieces that copy the last move of what they capture
- Linked pieces that must maintain specific distances

**Template**: "When [piece A] meets [piece B], both [interaction effect]"

### 7. Victory Condition Permutations

Exhaustively explore unusual victory conditions beyond standard goals.

**Victory Types:**
- **Emergent**: Victory conditions created during play
- **Collaborative**: Both players can win simultaneously
- **Asymmetric**: Different victory conditions per player
- **Dynamic**: Victory conditions that evolve
- **Meta**: Winning affects the next game
- **Indirect**: Win by forcing opponent into specific states
- **Quantum**: Multiple simultaneous victory conditions

**Example Outputs:**
- First to create a pattern that the opponent names
- Victory points awarded by piece positions voting
- Win by having the most pieces in the minority color
- Victory condition determined by opening moves
- Win by forcing opponent to make you win

**Template**: "Win by [unusual condition] but only if [constraint]"

---

## Rapid Recording Template

For each technique, quickly fill:

**Technique**: [Name]
**Idea #**: [1-20]
**Core Concept**: [One sentence]
**Key Mechanic**: [How it works]
**Why Unusual**: [What makes it different]

---

## Phase 2: Expansion Prompts

Take selected ideas and push further:

1. **Extremify**: What if this property was 10x more important?
2. **Purify**: Remove everything except this one mechanism
3. **Complicate**: Add exactly one more interacting system
4. **Invert**: Reverse the core assumption
5. **Constrain**: Add one impossible-seeming restriction

---

## Phase 3: Combination Matrix

Create a grid with interesting ideas from different techniques. Look for:
- Unexpected synergies
- Conflicting mechanics that create tension
- Mechanisms that solve each other's problems
- Aesthetic coherence from disparate sources

---

## Phase 4: Quick Evaluation Filters

### The 30-Second Test
Can you explain the core concept in 30 seconds?
- ✓ Pass: Clear, distinct concept
- ✗ Fail: Too convoluted or generic

### The Originality Test
Does this feel like a variant of an existing game?
- ✓ Pass: Genuinely unfamiliar mechanism
- ✗ Fail: "It's like Chess but..."

### The Decision Test
Are there obviously interesting decisions?
- ✓ Pass: Multiple viable approaches visible
- ✗ Fail: Optimal play seems trivial

### The Depth Potential Test
Could this sustain interest for 50+ plays?
- ✓ Pass: Visible strategic layers
- ✗ Fail: Seems solvable quickly

---

## Usage Notes

1. **Set a timer** - 2-3 minutes per idea maximum during Phase 1
2. **Write everything** - Bad ideas often contain seeds of good ones
3. **Avoid self-censoring** - Evaluation comes later
4. **Push past obvious** - First 5 ideas are usually generic
5. **Embrace absurdity** - Weird ideas can be tamed later

---

## Session Structure

**Recommended 2-Hour Session:**
- 10 min: Pick 3-4 techniques for this session
- 60 min: Generate 15-20 ideas per technique
- 20 min: Expansion phase on 5-10 ideas
- 20 min: Combination exploration
- 10 min: Apply filters and select for prototyping

Remember: The goal is to escape the gravity of conventional design, not to create immediately playable games.