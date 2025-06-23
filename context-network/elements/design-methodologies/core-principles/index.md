# Core Design Principles

## Overview

Fundamental principles that guide the creation of excellent abstract strategy games. These principles serve as both constraints and inspirations for designers.

## Classification
- **Domain:** Design Theory
- **Stability:** Static
- **Abstraction:** Conceptual
- **Confidence:** Established

## Individual Principles

### 1. Depth-to-Complexity Ratio
Maximizing strategic depth while minimizing rule complexity
- **Location:** [[depth-complexity-ratio.md]]
- **Key Insight:** The best games have simple rules but deep strategy

### 2. Meaningful Decision Architecture
Ensuring every turn presents interesting choices
- **Location:** [[meaningful-decisions.md]]
- **Key Insight:** Avoid false choices and obvious optimal moves

### 3. Emergent Complexity
Simple rules combining to create rich gameplay
- **Location:** [[emergent-complexity.md]]
- **Key Insight:** The whole becomes greater than its parts

### 4. Perfect Information Principle
All game state must be visible to all players
- **Location:** [[perfect-information.md]]
- **Key Insight:** Strategy over hidden information tactics

### 5. Deterministic Outcomes
No random elements affecting gameplay
- **Location:** [[deterministic-design.md]]
- **Key Insight:** Player skill determines all outcomes

### 6. Balance Through Asymmetry
Creating fairness without identical positions
- **Location:** [[asymmetric-balance.md]]
- **Key Insight:** Different but equal strategic options

### 7. Natural Game Arc
Games should progress toward conclusion
- **Location:** [[game-arc.md]]
- **Key Insight:** Avoid stalemates and endless games

### 8. Clarity of Purpose
Every game element should have clear function
- **Location:** [[clarity-purpose.md]]
- **Key Insight:** Remove redundant or confusing elements

## Principle Interactions

### Synergies
- Depth-to-Complexity + Emergent Complexity = Elegant games
- Perfect Information + Meaningful Decisions = Pure strategy
- Natural Game Arc + Deterministic Outcomes = Satisfying conclusions

### Tensions
- Asymmetric Balance vs Clarity (complexity management)
- Depth vs Accessibility (learning curve)
- Rich Decisions vs Game Length (analysis paralysis)

## Application Guidelines

### Priority Order
1. **Perfect Information & Determinism** (non-negotiable)
2. **Meaningful Decisions** (core to engagement)
3. **Depth-to-Complexity** (quality metric)
4. **Natural Game Arc** (playability)
5. **Other principles** (refinement)

### Balance Considerations
- Start with symmetric designs, add asymmetry carefully
- Test depth through play, not analysis
- Simplify ruthlessly while preserving strategy

## Examples in Practice

### Go
- **Depth-to-Complexity**: 2 rules, infinite strategy
- **Emergent Complexity**: Life/death from placement
- **Natural Arc**: Territory naturally fills

### Chess
- **Meaningful Decisions**: Every move matters
- **Asymmetric Balance**: Different pieces, equal armies
- **Clarity**: Each piece has defined movement

## Relationships
- **Parent Nodes:** [[../index.md]]
- **Child Nodes:** Individual principle documents listed above
- **Related Nodes:**
  - [[../../game-mechanics/index.md]] - embodies - Principles in concrete form
  - [[../failure-patterns/index.md]] - violates - What happens when principles are ignored
  - [[../balance-tuning/index.md]] - applies - Principles to achieve fairness

## Metadata
- **Created:** 2025-06-23
- **Last Updated:** 2025-06-23
- **Updated By:** Assistant