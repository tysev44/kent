import React, { StrictMode, useEffect, useRef } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement("main", null,
        React.createElement(Preloader, null))));
function Preloader() {
    const ringGroupsRef = useRef([]);
    const ringsRef = useRef([]);
    const solidCirclesRef = useRef([]);
    const size = 100;
    const sizePx = `${size}px`;
    const halfway = size / 2;
    const viewBox = `0 0 ${size} ${size}`;
    const rotationFix = `rotate(-90,${halfway},${halfway})`;
    const rings = [
        {
            color: "hsl(223, 90%, 50%)",
            radius: 48,
            rotationStart: 0,
            rotationEnd: 270,
            strokeWidth: 4
        },
        {
            color: "hsl(283, 90%, 50%)",
            radius: 38,
            rotationStart: 0,
            rotationEnd: 540,
            strokeWidth: 3
        },
        {
            color: "hsl(343, 90%, 50%)",
            radius: 31,
            rotationStart: 0,
            rotationEnd: 135,
            strokeWidth: 2
        },
        {
            color: "hsl(43, 90%, 60%)",
            radius: 26,
            rotationStart: 0,
            rotationEnd: 63,
            strokeWidth: 2
        },
        {
            color: "hsl(223, 90%, 50%)",
            radius: 21,
            rotationStart: 0,
            rotationEnd: 63,
            strokeWidth: 2
        },
        {
            color: "hsla(223, 90%, 90%, 0.5)",
            radius: 5,
            rotationStart: 0,
            rotationEnd: 135,
            strokeWidth: 2
        }
    ];
    const solidCircles = [
        {
            color: "light-dark(hsla(223, 90%, 30%, 0.5), hsla(223, 90%, 80%, 0.5))",
            radius: 15
        },
        {
            color: "light-dark(hsla(223, 90%, 30%, 0.5), hsla(223, 90%, 80%, 0.5))",
            radius: 15
        }
    ];
    const duration = 4000;
    const iterations = Infinity;
    useEffect(() => {
        // ring rotation
        ringGroupsRef.current.forEach((el, i) => {
            const { rotationStart, rotationEnd } = rings[i];
            const rotationInc = (rotationEnd - rotationStart) / 2;
            const keyframeCount = 3;
            const transform = [];
            for (let k = 0; k < keyframeCount; ++k) {
                transform.push(`rotate(${rotationStart + rotationInc * k}deg)`);
            }
            el === null || el === void 0 ? void 0 : el.animate({ transform }, { duration, easing: Utils.easings.linear, iterations });
        });
        // ring stroke
        ringsRef.current.forEach((el, i) => {
            const { radius } = rings[i];
            const keyframeCount = 3;
            const keyframes = [];
            for (let k = 0; k < keyframeCount; ++k) {
                const strokeDashoffset = Utils.circumference(-radius * k);
                keyframes.push({ strokeDashoffset, easing: Utils.easings.easeInOut });
            }
            el === null || el === void 0 ? void 0 : el.animate(keyframes, { duration, iterations });
        });
        // solid circles
        solidCirclesRef.current.forEach((el, i) => {
            const indexIsEven = i % 2 === 0;
            const keyframeCount = 3;
            const keyframes = [];
            for (let k = 0; k < keyframeCount; ++k) {
                const scaleA = indexIsEven ? 1 : 0;
                const scaleB = indexIsEven ? 0 : 1;
                const scale = k === 1 ? scaleA : scaleB;
                const transform = `scale(${scale})`;
                keyframes.push({ transform, easing: Utils.easings.easeInOut });
            }
            el === null || el === void 0 ? void 0 : el.animate(keyframes, { duration, iterations });
        });
    }, []);
    return (React.createElement("svg", { className: "pl", viewBox: viewBox, width: sizePx, height: sizePx, role: "img", "aria-label": "Colored concentric rings rotate clockwise at different speeds, decreasing then increasing in stroke length. There are also two solid circles in the center scaling in and out." },
        React.createElement("g", { transform: rotationFix },
            solidCircles.map((circle, i) => (React.createElement(PreloaderSolidCircle, { key: i, circle: circle, circleRef: (el) => { solidCirclesRef.current[i] = el; }, x: halfway, y: halfway }))),
            rings.map((ring, i) => (React.createElement(PreloaderRing, { key: i, ring: ring, groupRef: (el) => { ringGroupsRef.current[i] = el; }, ringRef: (el) => { ringsRef.current[i] = el; }, x: halfway, y: halfway }))))));
}
function PreloaderRing({ ring, groupRef, ringRef, x, y }) {
    const { color, strokeWidth, radius, rotationStart } = ring;
    const transform = `rotate(${rotationStart},${x},${y})`;
    const circumference = Utils.circumference(radius);
    const strokeDasharray = `${circumference} ${circumference}`;
    const circleStyle = {
        transformOrigin: `${x}px ${y}px`
    };
    return (React.createElement("g", { ref: groupRef, style: circleStyle },
        React.createElement("circle", { ref: ringRef, r: radius, cx: x, cy: y, fill: "none", strokeDasharray: strokeDasharray, stroke: color, strokeWidth: strokeWidth, transform: transform })));
}
function PreloaderSolidCircle({ circle, circleRef, x, y }) {
    const { color, radius } = circle;
    const circleStyle = {
        transformOrigin: `${x}px ${y}px`
    };
    return (React.createElement("circle", { ref: circleRef, r: radius, cx: x, cy: y, fill: color, style: circleStyle }));
}
class Utils {
    static circumference(radius) {
        return 2 * Math.PI * radius;
    }
}
Utils.easings = {
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    linear: "linear"
};