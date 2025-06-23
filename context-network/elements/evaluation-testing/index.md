# Evaluation & Testing

## Overview

Comprehensive methods for assessing game quality, balance, and strategic depth. This section covers both qualitative playtesting approaches and quantitative analysis techniques.

## Classification
- **Domain:** Quality Assurance
- **Stability:** Semi-stable
- **Abstraction:** Structural
- **Confidence:** Established

## Testing Categories

### Playtesting Protocols
Structured approaches to human testing
- **Location:** [[playtesting-protocols/index.md]]
- **Contains:** Phase system, session planning, data collection

### Balance Analysis
Methods for ensuring fairness
- **Location:** [[balance-analysis/index.md]]
- **Contains:** First-player advantage, symmetry testing, win statistics

### Depth Measurement
Evaluating strategic richness
- **Location:** [[depth-measurement/index.md]]
- **Contains:** Decision trees, strategy counting, skill curves

### Accessibility Testing
Ensuring games are learnable
- **Location:** [[accessibility-testing/index.md]]
- **Contains:** Teaching methods, rule clarity, onboarding

### Automated Analysis
Computer-aided evaluation methods
- **Location:** [[automated-analysis/index.md]]
- **Contains:** AI testing, statistical analysis, pattern detection

## The Four-Phase Testing Protocol

### Phase 1: Core Mechanics (Internal)
**Goal**: Verify basic functionality
**Duration**: 5-10 games
**Participants**: Designer + 1-2 others
**Focus**:
- Do rules work as intended?
- Are there obvious broken strategies?
- Is the core loop engaging?
- Can games end properly?

**Data to Collect**:
- Rule ambiguities
- Broken combinations
- Game length
- Basic enjoyment

### Phase 2: Balance Testing (Controlled)
**Goal**: Ensure fairness and viability
**Duration**: 20-30 games
**Participants**: 4-6 consistent testers
**Focus**:
- First player advantage measurement
- Strategy diversity
- Dominant strategy emergence
- Stalemate frequency

**Data to Collect**:
- Win rates by position
- Opening pattern frequency
- Average game length
- Decision time per move

### Phase 3: Depth Exploration (Extended)
**Goal**: Discover strategic richness
**Duration**: 50+ games
**Participants**: 8-12 including experienced players
**Focus**:
- Advanced strategy development
- Meta-game evolution
- Skill progression curves
- Replayability assessment

**Data to Collect**:
- Strategy evolution over time
- Skill rating distributions
- Pattern recognition
- Player retention rates

### Phase 4: Public Validation (Open)
**Goal**: Confirm broad appeal and robustness
**Duration**: 100+ games
**Participants**: Open testing, varied skill levels
**Focus**:
- Teaching and learning curve
- Cultural reception
- Edge case discovery
- Final polish needs

**Data to Collect**:
- Time to competence
- Common misconceptions
- Variant suggestions
- Overall satisfaction

## Key Metrics

### Strategic Richness
**Branching Factor**: Average legal moves per turn
- Poor: <5
- Adequate: 5-20  
- Good: 20-50
- Excellent: 50+

**Game Tree Complexity**: Estimated total positions
- Minimum viable: 10^20
- Good target: 10^40+
- Upper bound: 10^120

**Strategy Count**: Distinct viable approaches
- Minimum: 3-4
- Target: 8-12
- Ideal: Continuously emerging

### Game Balance
**First Player Advantage**: Win rate differential
- Excellent: 48-52%
- Good: 45-55%
- Acceptable: 40-60%
- Needs work: Outside 40-60%

**Draw Rate**: Frequency of tied games
- Ideal: 0-5%
- Acceptable: 5-15%
- Concerning: 15-30%
- Problematic: >30%

**Comeback Potential**: Late game volatility
- Should allow recovery
- Avoid runaway leaders
- Maintain tension

### Player Experience
**Learning Curve**: Time to basic competence
- Ideal: 1-3 games
- Acceptable: 4-6 games
- Difficult: 7+ games

**Analysis Paralysis**: Average move time progression
- Should plateau quickly
- Not exponentially increase
- Reasonable maximum

**Satisfaction Metrics**:
- Desire to play again
- Recommendation likelihood
- Memorable moments

## Testing Tools & Techniques

### Manual Testing Tools
- Move recording sheets
- Strategy documentation
- Balance tracking spreadsheets
- Feedback questionnaires

### Digital Tools
- Online implementation for remote testing
- Move databases for pattern analysis
- Statistical analysis software
- AI opponents for consistency

### Analysis Techniques
- Heat maps of board usage
- Opening book development
- Endgame databases
- Win correlation analysis

## Common Testing Failures

### Insufficient Diversity
- Testing only with similar players
- Not exploring edge strategies
- Missing cultural perspectives

### Premature Conclusions
- Judging too early
- Small sample sizes
- Not allowing meta development

### Poor Data Collection
- Anecdotal over systematic
- Missing key metrics
- No baseline comparisons

### Fixing Wrong Problems
- Addressing symptoms not causes
- Over-correcting imbalances
- Adding complexity as solution

## Iteration Guidelines

### When to Modify Rules
- Clear dominant strategy exists
- Games frequently stalemate
- First player advantage >60%
- Universal tester feedback

### How to Modify Safely
1. Identify root cause
2. Make minimal change
3. Re-test thoroughly
4. Document reasoning

### When to Stop Iterating
- Metrics within targets
- Consistent positive feedback
- Diminishing returns on changes
- Meta-game stabilizing

## Documentation Requirements

### Test Session Records
- Date and participants
- Rules version tested
- Games played
- Key observations
- Suggested changes

### Metric Tracking
- Cumulative statistics
- Trend analysis
- Version comparisons
- Outlier investigation

### Strategy Archive
- Discovered strategies
- Counter-strategies
- Evolution timeline
- Effectiveness ratings

## Relationships
- **Parent Nodes:** [[../index.md]]
- **Child Nodes:** Listed subcategories above
- **Related Nodes:**
  - [[../game-concepts/index.md]] - provides - Games to test
  - [[../design-methodologies/index.md]] - validates - Design principles
  - [[../implementation/index.md]] - enables - Testing platforms

## Sources
- Derived from "Abstract Strategy Game Design Framework.md"
- Playtesting best practices from industry
- Statistical analysis methods
- Community testing experiences

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Updated By:** Assistant