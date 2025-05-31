import type { ObstacleShape } from '../../types/GameTypes';
import { SpikedStar } from './SpikedStar';
import { ReactorCore } from './ReactorCore';
import { EvilEye } from './EvilEye';
import { EnergyCrystal } from './EnergyCrystal';

export const ObstacleType = {
    SpikedStar: 0,
    ReactorCore: 1,
    EvilEye: 2,
    EnergyCrystal: 3
} as const;

export type ObstacleType = typeof ObstacleType[keyof typeof ObstacleType];

export class ShapeFactory {
    private static shapeInstances: Map<ObstacleType, ObstacleShape> = new Map();

    static getShape(type: ObstacleType): ObstacleShape {
        if (!this.shapeInstances.has(type)) {
            switch (type) {
                case ObstacleType.SpikedStar:
                    this.shapeInstances.set(type, new SpikedStar());
                    break;
                case ObstacleType.ReactorCore:
                    this.shapeInstances.set(type, new ReactorCore());
                    break;
                case ObstacleType.EvilEye:
                    this.shapeInstances.set(type, new EvilEye());
                    break;
                case ObstacleType.EnergyCrystal:
                    this.shapeInstances.set(type, new EnergyCrystal());
                    break;
            }
        }
        return this.shapeInstances.get(type)!;
    }
}
