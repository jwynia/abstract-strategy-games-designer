# Failure Patterns

## Overview

Common design failures in abstract strategy games and their solutions. Understanding these patterns helps designers avoid predictable pitfalls and recognize problems early in development.

## Classification
- **Domain:** Design Anti-patterns
- **Stability:** Static
- **Abstraction:** Detailed
- **Confidence:** Established

## Major Failure Categories

### Decision Failures
Problems with player choice quality
- **Location:** [[decision-failures.md]]
- **Contains:** False choices, analysis paralysis, obvious moves

### Balance Failures  
Issues with game fairness
- **Location:** [[balance-failures.md]]
- **Contains:** First player wins, dominant strategies, kingmaking

### Progression Failures
Problems with game flow
- **Location:** [[progression-failures.md]]
- **Contains:** Stalemates, runaway leaders, anticlimactic endings

### Complexity Failures
Issues with rules and learning
- **Location:** [[complexity-failures.md]]
- **Contains:** Rule bloat, exception hell, cognitive overload

### Engagement Failures
Problems maintaining interest
- **Location:** [[engagement-failures.md]]
- **Contains:** Repetitive play, solved games, no tension

## Critical Failure Patterns

### 1. Analysis Paralysis
**Symptoms**:
- Turn time increases exponentially
- Players freeze with options
- Games drag interminably
- Fun evaporates

**Root Causes**:
- Too many equivalent options
- Unclear evaluation criteria
- Deep calculation required
- No intuitive plays

**Solutions**:
- Reduce branching factor
- Add time pressure
- Create clear heuristics
- Layer complexity gradually

**Example Fix**:
Original: 50+ possible moves, all requiring deep calculation
Fixed: 10-15 moves with clear categories (aggressive/defensive/building)

### 2. False Choices
**Symptoms**:
- One obviously best move
- Other options never taken
- Decisions feel meaningless
- Strategy is linear

**Root Causes**:
- Imbalanced option values
- Dominant strategies exist
- Insufficient testing
- Poor risk/reward ratios

**Solutions**:
- Balance option values
- Add situational modifiers
- Create rock-paper-scissors dynamics
- Test with competitive players

**Example Fix**:
Original: Always capture when possible
Fixed: Capturing opens vulnerabilities, creating tension

### 3. Runaway Leader
**Symptoms**:
- Early leader always wins
- Comebacks impossible
- Players quit mid-game
- Endgame pointless

**Root Causes**:
- Positive feedback loops
- No catch-up mechanics
- Advantages compound
- No late game volatility

**Solutions**:
- Add negative feedback
- Create comeback opportunities
- Balance early vs late power
- Increase endgame importance

**Example Fix**:
Original: More pieces = more actions = more pieces
Fixed: More pieces = bigger target = vulnerabilities

### 4. Eternal Stalemate
**Symptoms**:
- Games won't end
- Defensive play optimal
- Progress impossible
- Mutual blockades

**Root Causes**:
- Defensive advantage too strong
- No forcing mechanisms
- Infinite resources
- Risk exceeds reward

**Solutions**:
- Add game clocks
- Create must-act rules
- Reduce defensive power
- Add accumulating pressure

**Example Fix**:
Original: Players can maintain fortress indefinitely
Fixed: Board shrinks each round, forcing engagement

### 5. First Player Determinism
**Symptoms**:
- First player wins 70%+
- Opening moves scripted
- Game decided early
- Second player reactive only

**Root Causes**:
- Tempo advantage critical
- No compensation mechanism
- Initiative overwhelms
- Symmetry favors first

**Solutions**:
- Add compensation (komi)
- Use pie rule
- Simultaneous starts
- Asymmetric goals

**Example Fix**:
Original: First player takes center, dominates
Fixed: Second player chooses starting configuration

### 6. Complexity Creep
**Symptoms**:
- Rules require reference
- Exceptions multiply
- Teaching takes hours
- Errors frequent

**Root Causes**:
- Patching problems with rules
- Feature accumulation
- Edge case handling
- Lost design focus

**Solutions**:
- Refactor core mechanics
- Remove not add
- Embrace limitations
- Simplify ruthlessly

**Example Fix**:
Original: 15 special case rules for different situations
Fixed: One universal rule that handles all cases elegantly

### 7. Kingmaking
**Symptoms**:
- Losing player determines winner
- Spite plays common
- Politics override strategy
- Skill becomes secondary

**Root Causes**:
- Targeted interaction
- Player elimination
- Unbalanced partnerships
- Resource transfer allowed

**Solutions**:
- Reduce targeted attacks
- Keep all players engaged
- Balance interaction
- Limit gift-giving

**Example Fix**:
Original: Players can attack anyone, losers gang up
Fixed: Attacks affect all opponents equally

### 8. Solved Game Syndrome
**Symptoms**:
- Optimal play discovered
- Games become scripted
- No innovation possible
- Interest dies quickly

**Root Causes**:
- Too simple
- Insufficient depth
- Predictable outcomes
- No hidden information

**Solutions**:
- Add complexity carefully
- Create multiple viable paths
- Increase branching
- Add dynamic elements

**Example Fix**:
Original: 3×3 grid, quickly solved
Fixed: 5×5 grid with special positions, exponentially deeper

## Pattern Recognition Guide

### Early Warning Signs
- Testers making same moves
- Games ending same way
- Feedback repeating themes
- Enthusiasm declining

### Testing Questions
- Are decisions interesting?
- Can losers recover?
- Do games conclude naturally?
- Is replayability high?

### Metric Red Flags
- Win rates >65% for any position
- Average game time increasing
- Draw rate >30%
- Strategy convergence

## Prevention Strategies

### Design Principles
1. Start simple, test constantly
2. Add only what improves depth
3. Remove before adding
4. Trust tester feedback

### Testing Protocol
1. Test with various skill levels
2. Track all metrics
3. Watch for patterns
4. Fix root causes

### Iteration Guidelines
1. One change at a time
2. Retest thoroughly
3. Document reasoning
4. Keep old versions

## Recovery Methods

### When Patterns Detected
1. Stop adding features
2. Identify root cause
3. Consider major refactor
4. Test radical changes

### Refactoring Approach
1. Strip to core mechanic
2. Rebuild carefully
3. Test each addition
4. Maintain simplicity

### When to Abandon
- Multiple critical failures
- Fixes create new problems
- Core concept flawed
- No path to fun

## Relationships
- **Parent Nodes:** [[../index.md]]
- **Child Nodes:** Individual failure documents
- **Related Nodes:**
  - [[../core-principles/index.md]] - prevents - When followed
  - [[../../evaluation-testing/index.md]] - detects - Failure patterns
  - [[../design-process/index.md]] - addresses - During iteration

## Sources
- Derived from "Abstract Strategy Game Design Framework.md"
- Analysis of failed games
- Designer post-mortems
- Testing experiences

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Updated By:** Assistant