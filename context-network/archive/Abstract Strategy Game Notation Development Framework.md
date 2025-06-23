# Abstract Strategy Game Notation Development Framework

## Purpose

This framework guides the development of notation systems for abstract strategy games, with consideration for both human usability and computational processing. Not every game needs notation, but when developed, notation should enhance rather than hinder the game experience.

## When to Develop Notation

### Notation is Valuable When:
- The game has sufficient depth to reward post-game analysis
- Players want to share and discuss specific positions
- Competitive play would benefit from recorded games
- The game structure allows reasonably concise encoding
- Asynchronous or correspondence play is desired

### Notation May Be Unnecessary When:
- Games are purely casual with no analytical community
- The encoding would be more complex than beneficial
- Game state is too fluid or continuous to capture discretely
- Visual recognition is more efficient than notation

## Core Components of Game Notation

### 1. Coordinate Systems

Choose based on board topology:

**Square Grids**
- Algebraic: Letters for columns, numbers for rows (a1, h8)
- Numeric: Number pairs (1-1, 8-8)
- Relative: From piece perspective (forward-2, right-1)

**Hexagonal Grids**
- Axial: Two of three cube coordinates (q,r)
- Offset: Modified row/column for hex layout
- Spiral: Single number from center outward

**Irregular/Graph Boards**
- Node labels: Unique identifier per position
- Edge notation: For games focused on connections
- Region codes: For area-control games

**3D/Multi-layer**
- Layer prefix + 2D notation (L1-a3)
- Full 3D coordinates (x,y,z)
- Separated notation per layer

### 2. Move Encoding

**Placement Games**
- Simple: Just destination (d4)
- With piece type: Type + destination (Rd4)
- With orientation: Destination + modifier (d4^, d4>)

**Movement Games**
- From-to: Source-destination (e2-e4)
- Relative: Direction + distance (N2, SE3)
- Path notation: For multi-step moves (e2-e3-f4)

**Capture Notation**
- Explicit: x for captures (e4xd5)
- Implicit: Destination only implies capture
- Special: Different symbols for capture types

**Complex Actions**
- Compound moves: Parentheses or brackets
- Conditional: IF-THEN notation
- Multi-piece: Grouping notation

### 3. State Modifiers

**Piece States**
- Ownership: Lowercase/uppercase, prefixes, or suffixes
- Type changes: Transformation indicators (p=Q)
- Temporary states: Status markers (+stunned, *active)

**Board States**
- Territory control: Region ownership markers
- Environmental: Board modification notation
- Temporal: Turn or phase indicators

**Game Metadata**
- Check/threat indicators: +, !, ?
- Evaluation: Traditional chess symbols or numeric
- Commentary: {} for human-readable notes

## Design Principles

### 1. Clarity Over Brevity
- Unambiguous move identification is paramount
- Slightly longer but clearer notation beats terse but confusing
- Consider readability in both digital and handwritten forms

### 2. Consistency
- Similar actions should have similar notation
- Maintain patterns across different game situations
- Avoid special cases unless absolutely necessary

### 3. Computational Friendliness
- Regular grammar that can be parsed with simple rules
- Reversible: Can reconstruct game state from notation
- Validatable: Can verify legal moves from notation

### 4. Human Usability
- Memorable patterns for common moves
- Speaks naturally when read aloud
- Minimal cognitive load to write during play

## Development Process

### Phase 1: Analysis
1. Catalog all possible move types
2. Identify game state information that must be captured
3. Determine minimum information for move disambiguation
4. Consider special cases and edge conditions

### Phase 2: Design
1. Choose coordinate system matching board topology
2. Develop move encoding for each move type
3. Add state modifiers only where necessary
4. Create initial notation specification

### Phase 3: Testing
1. Encode sample games to test coverage
2. Verify every legal move can be notated
3. Check for ambiguous positions
4. Test with actual players for usability

### Phase 4: Refinement
1. Simplify based on common patterns
2. Add shortcuts for frequent move sequences
3. Standardize exception handling
4. Document thoroughly with examples

## Notation Specification Template

```
Game: [Name]
Version: [Notation version number]

## Board Coordinates
[Describe coordinate system with visual example]

## Basic Move Notation
- Placement: [format with example]
- Movement: [format with example]
- Capture: [format with example]

## Special Actions
[List each special action type with notation]

## Modifiers
[List all modifiers and their meanings]

## Examples
[Provide 5-10 annotated example moves]

## Grammar (EBNF or similar)
[Formal grammar specification for parsers]
```

## Integration with Game Systems

### Parser Requirements
- Stateless parsing: Move meaning from context
- Stateful parsing: Requires game state for interpretation
- Error handling: Clear messages for invalid notation

### Generator Requirements
- Canonical form: One correct way to write each move
- Alternative forms: Common abbreviations allowed
- Disambiguation: Automatic when multiple pieces can make same move

### Storage Considerations
- Text format: Human readable, version control friendly
- Binary format: Compact for large databases
- Metadata: Player information, timestamps, variations

## Examples from Existing Games

### Chess (Highly Successful)
- Algebraic notation universally adopted
- Piece + destination + modifiers
- Handles all moves concisely
- Enables entire ecosystem of books/databases

### Go (Elegantly Simple)
- Coordinate pairs (D4, Q16)
- Minimal notation for placement-only game
- Standard across all board sizes
- Pass and resign as special moves

### Hex (Adaptation Challenge)
- Multiple competing coordinate systems
- Community fragmentation on standards
- Demonstrates importance of early standardization

## Common Pitfalls

### Over-Engineering
- Adding notation for rarely-used features
- Complex encoding that requires lookup tables
- Trying to capture too much game state

### Under-Specifying
- Ambiguous moves in certain positions
- Missing notation for legal but rare moves
- Inconsistent handling of edge cases

### Poor Adoption
- Notation that's hard to write by hand
- Conflicts with player's mental model
- Requiring notation when game doesn't benefit

## Validation Checklist

- [ ] Every legal move has exactly one canonical notation
- [ ] Notation can be written quickly during play
- [ ] Common moves have concise notation
- [ ] Parser can validate move legality
- [ ] Notation reads naturally aloud
- [ ] Special cases are documented
- [ ] Examples cover all move types
- [ ] Formal grammar is provided
- [ ] Version control for notation changes

## Conclusion

Good notation emerges from understanding both the game's structure and its players' needs. Start simple, test thoroughly, and refine based on actual use. Remember that notation serves the game and its community—not the other way around.