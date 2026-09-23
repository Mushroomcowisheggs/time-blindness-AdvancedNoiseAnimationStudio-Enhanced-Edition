// assets/js/classes/NoiseStrategyColourful.js
import NoiseStrategyBase from './NoiseStrategyBase.js';

export default class NoiseStrategyColourful extends NoiseStrategyBase {
    generateNoiseMap() {
        const { width, height } = this.g;
        const map = new Uint8ClampedArray(width * height);
        for (let i = 0; i < map.length; i++) {
            if (Math.random() < this.g.colourfulDensity) {
                map[i] = Math.floor(Math.random() * 256);
            } else {
                map[i] = 0;
            }
        }
        return map;
    }

    async refresh(animationMode, movementDirection) {
        const size = this.g.width * this.g.height;
        this.g.noiseField = this.generateNoiseMap();
        this.g._makeSeamless(this.g.noiseField, movementDirection);
        this.g.backgroundNoise = new Array(size);
        this.g.foregroundNoise = new Array(size);
        if (this.g.usesSharedField) {
            // v6 SHARED (the original study's colourful behaviour): one spot field, both regions.
            for (let i = 0; i < size; i++) {
                const gray = this.g.noiseField[i];
                this.g.backgroundNoise[i] = gray;
                this.g.foregroundNoise[i] = gray;
            }
        } else {
            // v6 INDEPENDENT: a second, separately drawn spot field for the foreground.
            const second = this.generateNoiseMap();
            this.g._makeSeamless(second, movementDirection);
            for (let i = 0; i < size; i++) {
                this.g.backgroundNoise[i] = this.g.noiseField[i];
                this.g.foregroundNoise[i] = second[i];
            }
        }
        return { noiseField: this.g.noiseField, backgroundNoise: this.g.backgroundNoise, foregroundNoise: this.g.foregroundNoise };
    }
}
