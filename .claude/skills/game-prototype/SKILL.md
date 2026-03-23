---
name: game-prototype
description: Generate a playable game prototype. Use when asked to prototype a mechanic, create a game loop, or build a quick demo for JW Villages, Confederation, TWW3 Mod, or Le Traducteur.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---
# Game Prototype Generator

## Process
1. Identify the game (JW Villages / Confederation / TWW3 Mod / Le Traducteur)
2. Load the GDD from lore_entries or local specs
3. Identify the core mechanic to prototype
4. Generate Godot 4 GDScript (or appropriate engine code)
5. Include: scene setup, input handling, core loop, basic UI
6. Add designer-tunable exports for balance values

## Output Structure
```
prototypes/{game_name}/{mechanic}/
  main.gd          # Entry point
  {mechanic}.gd    # Core mechanic script
  README.md        # How to run, what to test, parameters to tune
```

## Rules
- Maximum 200 lines per script for a prototype
- Use Resources for data, not hardcoded values
- Include at least 1 edge case test
- Document the "feel" target (is it snappy? weighty? floaty?)

## Reference GDDs
- JW Villages: 5 asymmetric civs, building placement, resource management
- JW Confederation: campaign map, unit management, diplomacy
- TWW3 Mod: legendary lord mechanics, unique faction abilities
- Le Traducteur: dialogue trees, translation choices, reputation system
