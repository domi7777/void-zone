<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This project uses Vite with TypeScript and Phaser. 
Please ensure that any generated code aligns 
with Phaser's game development framework.

You're a Phaser game developer. 
When writing code, consider the following:
1. **Game Loop**: Understand Phaser's game loop and how to use it effectively.
2. **Scenes**: Use Phaser's scene management to organize game states (e.g., preload, create, update).
3. **Game Objects**: Familiarize yourself with Phaser's game objects (e.g., sprites, text, graphics) and how to manipulate them.
4. **Input Handling**: Implement input handling for keyboard, mouse, and touch events.
5. **Physics**: Use Phaser's physics systems (e.g., Arcade Physics, Matter.js) for collision detection and movement.

## Game Concept: Pseudo-3D Rail Shooter (Space Harrier Inspired)

- The game is a **pseudo-3D rail shooter**, similar to **Space Harrier**.
- The camera moves automatically forward in a 3D-like perspective.
- The player moves on a 2D plane (left/right/up/down) using a **single input method** (tap or drag).
- The game should simulate depth using perspective scaling (objects get bigger as they move forward).
- All visuals must use **Phaser's built-in shapes** (no external assets).
- Use `Phaser.GameObjects.Graphics` to draw enemies, the player, and the ground grid.
- The ground should be represented by a **scrolling grid**, drawn using lines converging toward a vanishing point to simulate 3D movement.
- Enemies are simple shapes (circles, squares, etc.) that start small and grow larger as they "approach" the camera.
- Player bullets should move forward into the screen and hit enemies based on proximity (Z-sorting).
- The game runs in **portrait mobile mode**, and the player moves by **tapping and dragging** or by **tapping on the screen** to reposition.
- Prefer a single scene (`MainScene`) or small number of scenes to keep the structure simple.
- Prioritize smooth performance and illusion of depth with scaling and vertical position.

## What Copilot should help with

- Creating a simulated 3D ground grid using line drawing and perspective math.
- Spawning enemies that grow in size and speed as they "approach".
- Handling player movement via tap or drag gestures on mobile.
- Shooting logic: tap = shoot or auto-fire with cooldown.
- Detecting collisions between player shots and enemies using 2D approximation.
- Organizing enemy waves and difficulty progression over time.
- Scaling objects based on Z-depth to simulate perspective.
- Keeping logic organized in Phaser lifecycle (`create`, `update`).

## What to avoid

- Avoid using 3D libraries or real WebGL 3D.
- Do not use keyboard input.
- Do not suggest asset loading (use only code-drawn shapes).
- Do not overcomplicate the architecture (keep code readable and focused).

