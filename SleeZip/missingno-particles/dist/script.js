"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const missingno = new MissingNo("canvas");
    missingno.init();
});
class MissingNo {
    /**
     * Create a MissingNo. particle animation.
     * @param el Selector of the `<canvas>` element to use
     */
    constructor(el) {
        /** Check for initiation */
        this.didInit = false;
        /** Hidden canvas for the sprite itself, which will be used for getting the image data */
        this.shadowCanvas = document.createElement("canvas");
        /** Context for the shadow canvas */
        this.shadowCanvasCtx = this.shadowCanvas.getContext("2d");
        /** The main MissingNo. object */
        this.entity = {
            x: 52,
            y: 36,
            width: 24,
            height: 56,
            frame: 0,
            keyframe: 0,
            keyframes: [170, 70, 0],
            particles: []
        };
        this.canvas = document.querySelector(el);
    }
    /** Set up this MissingNo. */
    async init() {
        if (this.didInit)
            return;
        this.didInit = true;
        if (!this.canvas)
            return;
        // set up the visible canvas
        this.canvas.width = 128;
        this.canvas.height = 128;
        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx || !this.shadowCanvasCtx)
            return;
        // set up the shadow canvas
        const { x, y, width, height, particles } = this.entity;
        const center = { x: x + width / 2, y: y + height / 2 };
        const spread = { x: 52, y: 36 };
        this.shadowCanvas.width = width;
        this.shadowCanvas.height = height;
        try {
            // load the sprite and draw it on the shadow canvas
            const url = "https://assets.codepen.io/416221/missingno.png";
            const img = await this.spriteLoad(url);
            this.shadowCanvasCtx.drawImage(img, 0, 0, width, height);
            // get the shadow canvas’s image data
            const spriteData = this.shadowCanvasCtx.getImageData(0, 0, width, height);
            const { data } = spriteData;
            const rowSpace = 4;
            for (let i = 0; i < data.length; i += 4) {
                // add a particle for each opaque pixel
                if (data[i + 3] === 0)
                    continue;
                const _i = i / 4;
                const row = Math.floor(_i / width);
                const rowYDistance = (y + height) + (height - row) * rowSpace;
                const rowYDistanceAltered = rowYDistance + Utils.randomInt(-rowSpace, 0);
                const start = {
                    a: 1,
                    x: x + _i % width,
                    y: (y + row) - rowYDistanceAltered
                };
                const end = {
                    a: 1,
                    x: start.x,
                    y: y + row,
                    maxFrames: Math.round(rowYDistanceAltered / 2),
                    timingFunction: "ease-out"
                };
                const yDiff = center.y - end.y;
                const xDiff = center.x - end.x;
                const endAngle = Math.atan2(yDiff, xDiff) + Math.PI / 2;
                const explode = {
                    a: 0,
                    x: end.x - spread.x * Math.sin(endAngle),
                    y: end.y + spread.y * Math.cos(endAngle),
                    maxFrames: Utils.randomInt(15, 60)
                };
                const particle = Object.assign(Object.assign({ r: data[i], g: data[i + 1], b: data[i + 2] }, start), { positions: [Object.assign({}, start), Object.assign({}, end), Object.assign({}, explode)] });
                particles.push(particle);
            }
            this.loop();
        }
        catch (err) {
            console.error(err);
        }
    }
    /** Loop for updating the animation */
    loop() {
        this.spriteDraw();
        this.spriteUpdate();
        requestAnimationFrame(this.loop.bind(this));
    }
    /** Render the entity. */
    spriteDraw() {
        if (!this.canvas || !this.ctx)
            return;
        const { particles } = this.entity;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let p of particles) {
            const { r, g, b, a, x, y } = p;
            this.ctx.globalAlpha = a;
            this.ctx.fillStyle = `rgb(${r},${g},${b})`;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
    /**
     * Load the sprite from a given URL.
     * @param src Sprite URL
     */
    spriteLoad(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(`${src} not found or corrupted`);
        });
    }
    /** Check if all particles stopped moving before going to the next keyframe. */
    spritePositionCheck() {
        const { particles, frame, keyframe, keyframes } = this.entity;
        const keyframeFinished = frame >= keyframes[keyframe];
        if (keyframeFinished) {
            let nextPosition = keyframe + 1;
            if (nextPosition >= keyframes.length - 1) {
                nextPosition = 0;
                for (let p of particles) {
                    const start = p.positions[0];
                    p.a = start.a;
                    p.x = start.x;
                    p.y = start.y;
                }
            }
            this.entity.frame = 0;
            this.entity.keyframe = nextPosition;
            return;
        }
        ++this.entity.frame;
    }
    /** Move the sprite particles. */
    spriteUpdate() {
        const { particles, frame, keyframe, keyframes } = this.entity;
        for (let p of particles) {
            const { a, x, y, timingFunction } = p.positions[keyframe];
            const nextPosition = p.positions[keyframe + 1];
            const { maxFrames } = nextPosition;
            let percent = frame / keyframes[keyframe];
            if (maxFrames)
                percent = Math.min(frame / maxFrames, 1);
            // alpha and positions
            if (timingFunction === "ease-out")
                percent = Utils.easeOutCubic(percent);
            p.a = a + percent * (nextPosition.a - a);
            p.x = Math.round(x + percent * (nextPosition.x - x));
            p.y = Math.round(y + percent * (nextPosition.y - y));
        }
        this.spritePositionCheck();
    }
}
class Utils {
    /**
     * Timing function that starts abruptly and then slows to a stop
     * @param x x-axis value between 0 and 1
     */
    static easeOutCubic(x) {
        return 1 - (1 - x) ** 3;
    }
    /**
     * Get a random integer between two numbers.
     * @param min Minimum value
     * @param max Maximum value
     */
    static randomInt(min, max) {
        const random = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
        return min + Math.round(random * (max - min));
    }
}