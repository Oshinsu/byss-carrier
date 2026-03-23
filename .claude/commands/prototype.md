---
description: Génère un prototype GDScript pour un mécanisme de jeu BYSS GAMES.
argument-hint: [game-name] [mechanic]
---
## Game Prototype Generator

Game: $ARGUMENTS

1. Charge le GDD depuis lore_entries (universe='jurassic-wars')
2. Identifie la mécanique cible
3. Génère du GDScript Godot 4 avec:
   - Scene setup (nodes, exports)
   - Input handling
   - Core loop (process/physics_process)
   - Basic UI feedback
   - Designer-tunable exports
4. Maximum 200 lignes
5. Inclus un README avec: comment tester, paramètres à régler, "feel" cible
