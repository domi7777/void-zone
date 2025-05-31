export const GameConfig = {
    HORIZON_Y: 150,
    PLAYER: {
        START_Y_OFFSET: 100,
        MOVEMENT_SPEED: 0.03,
        BASE_COLOR: 0x00ff00,
        INVULNERABILITY_TIME: 1500,
    },
    OBSTACLES: {
        COLORS: [0xff0000, 0x00ff00, 0xff00ff, 0xffff00] as const,
        BASE_SIZE: 40,
        MAX_Z: 1000,
        SPEED: 8,
        SPAWN_INTERVAL: 1000,
        SPAWN_MARGIN: 100,
        ROTATION_SPEED: 0.001,
    },
    SCORING: {
        POINTS_PER_TICK: 1,
        POINTS_PER_OBSTACLE: 10,
        COLLISION_PENALTY: 50,
        STARTING_LIVES: 5,
        TICK_INTERVAL: 100,
    }
} as const;
