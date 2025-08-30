import React, { StrictMode } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
const title = "Jon’s AirPods Pro";
const subtitle = "Noise Cancellation";
const data = [
    {
        name: "Left AirPod",
        icon: "airpod-left",
        percent: 0.6
    },
    {
        name: "AirPod Case",
        icon: "airpod-case",
        percent: 0.09
    },
    {
        name: "Right AirPod",
        icon: "airpod-right",
        percent: 0.28
    }
];
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement("main", null,
        React.createElement(IconSprites, null),
        React.createElement(BatteryWidget, { title: title, subtitle: subtitle, data: data }),
        React.createElement(BatteryWidget, { title: title, subtitle: subtitle, data: data, forceDark: true }))));
function BatteryWidget({ title, subtitle, data, forceDark = false }) {
    return (React.createElement("div", { className: `widget${forceDark === true ? " widget--dark" : ""}` },
        React.createElement("div", { className: "widget__header" },
            React.createElement("div", { className: "widget__title" }, title),
            React.createElement("button", { className: "widget__button", type: "button", title: "AirPlay" },
                React.createElement(Icon, { icon: "airplay" }))),
        React.createElement("div", { className: "widget__subtitle" }, subtitle),
        React.createElement("div", { className: "widget__bars" }, data.map((item, i) => React.createElement(BatteryWidgetBar, Object.assign({}, item, { key: i }))))));
}
function BatteryWidgetBar({ name, icon, percent }) {
    var _a;
    const locale = "en-US";
    const percentFormat = new Intl.NumberFormat(locale, { style: "percent" });
    const percentFormatted = percentFormat.format(percent);
    const colors = [
        { name: "red", percent: 0.1 },
        { name: "yellow", percent: 0.3 },
        { name: "green", percent: 1 }
    ];
    const color = (_a = colors.find(color => percent <= color.percent)) === null || _a === void 0 ? void 0 : _a.name;
    const fillStyle = {
        height: `${percent * 100}%`
    };
    return (React.createElement("div", { className: "widget__bar" },
        React.createElement("div", { className: `widget__bar-fill widget__bar-fill--${color}`, style: fillStyle }),
        React.createElement("div", { className: "widget__bar-percent" }, percentFormatted),
        React.createElement("div", { className: "widget__bar-icon", title: name, "aria-label": name },
            React.createElement(Icon, { icon: icon }))));
}
function Icon({ icon }) {
    return (React.createElement("svg", { className: "icon", width: "16px", height: "16px", "aria-hidden": "true" },
        React.createElement("use", { href: `#${icon}` })));
}
function IconSprites() {
    const viewBox = "0 0 16 16";
    return (React.createElement("svg", { width: "0", height: "0", display: "none" },
        React.createElement("symbol", { id: "airplay", viewBox: viewBox },
            React.createElement("g", { stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1" },
                React.createElement("g", { fill: "none", transform: "rotate(135,8,8)" },
                    React.createElement("circle", { cx: "8", cy: "8", r: "7", strokeDasharray: "32.987 10.996" }),
                    React.createElement("circle", { cx: "8", cy: "8", r: "5", strokeDasharray: "23.562 7.854" }),
                    React.createElement("circle", { cx: "8", cy: "8", r: "3", strokeDasharray: "14.137 4.712" })),
                React.createElement("polygon", { fill: "currentcolor", points: "8 11,12 15,4 15" }))),
        React.createElement("symbol", { id: "airpod-left", viewBox: viewBox },
            React.createElement("g", { fill: "currentcolor" },
                React.createElement("path", { d: "M 4.815 4.433 C 4.937 4.039 4.739 3.613 4.372 3.482 C 4.005 3.351 3.609 3.564 3.486 3.957 C 3.211 4.842 3.211 5.8 3.486 6.685 C 3.609 7.078 4.005 7.291 4.372 7.16 C 4.739 7.028 4.937 6.603 4.815 6.21 C 4.635 5.634 4.635 5.01 4.815 4.433 Z" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M 6.251 0 C 3.177 0 1.35 2.452 1.35 5.041 L 1.35 5.556 C 1.35 6.175 1.51 7.013 1.685 7.774 C 1.85 8.493 2.047 9.215 2.19 9.74 L 2.227 9.873 C 2.53 10.987 3.483 13.695 3.851 14.664 C 4.245 15.703 5.329 16.189 6.304 15.933 C 7.477 15.623 8.204 14.324 7.741 13.086 C 7.485 12.402 6.957 10.895 6.591 9.769 C 6.685 9.773 6.779 9.776 6.874 9.776 C 8.253 9.776 9.531 9.343 10.514 8.608 C 11.091 9.074 11.903 9.194 12.622 8.761 L 13.493 8.235 C 14.21 7.802 14.653 6.99 14.653 6.109 L 14.653 3.735 C 14.653 2.854 14.21 2.041 13.493 1.609 L 12.622 1.082 C 11.819 0.597 10.898 0.805 10.32 1.415 C 9.188 0.558 7.712 0 6.251 0 Z M 11.152 5.663 C 11.152 5.66 11.152 5.66 11.152 5.658 L 11.152 2.88 C 11.154 2.45 11.586 2.18 11.935 2.391 L 12.807 2.917 C 13.082 3.083 13.253 3.397 13.253 3.735 L 13.253 6.109 C 13.253 6.448 13.082 6.76 12.807 6.926 L 11.935 7.453 C 11.585 7.664 11.152 7.393 11.152 6.962 L 11.152 5.663 Z M 9.752 2.877 L 9.752 2.833 C 8.819 2.038 7.509 1.501 6.251 1.501 C 3.997 1.501 2.75 3.229 2.75 5.041 L 2.75 5.556 C 2.75 5.972 2.869 6.649 3.044 7.414 C 3.202 8.1 3.391 8.793 3.535 9.322 L 3.571 9.453 C 3.852 10.489 4.784 13.137 5.148 14.099 C 5.248 14.36 5.582 14.576 5.97 14.474 C 6.405 14.359 6.554 13.946 6.442 13.645 C 6.089 12.703 5.205 10.164 4.931 9.159 C 4.773 8.578 5.252 8.042 5.788 8.158 C 6.133 8.232 6.497 8.273 6.874 8.273 C 7.948 8.273 8.91 7.947 9.632 7.434 L 9.636 7.412 C 9.661 7.239 9.683 7.003 9.701 6.749 C 9.736 6.244 9.751 5.74 9.752 5.66 L 9.752 2.881 C 9.752 2.881 9.752 2.879 9.752 2.877 Z" }))),
        React.createElement("symbol", { id: "airpod-case", viewBox: viewBox },
            React.createElement("g", { fill: "none", stroke: "currentcolor" },
                React.createElement("rect", { rx: "3", ry: "3", x: "1", y: "3", width: "14", height: "10", strokeWidth: "2" }),
                React.createElement("line", { x1: "1", y1: "7", x2: "15", y2: "7" }),
                React.createElement("circle", { cx: "8", cy: "9", r: "0.5" }))),
        React.createElement("symbol", { id: "airpod-right", viewBox: viewBox },
            React.createElement("g", { fill: "currentcolor" },
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M 9.757 0 C 12.831 0 14.658 2.452 14.658 5.041 L 14.658 5.556 C 14.658 6.175 14.498 7.013 14.323 7.774 C 14.158 8.493 13.961 9.215 13.818 9.74 L 13.781 9.873 C 13.478 10.987 12.525 13.695 12.157 14.664 C 11.763 15.703 10.679 16.189 9.704 15.933 C 8.531 15.623 7.804 14.324 8.267 13.086 C 8.523 12.402 9.051 10.895 9.417 9.769 C 9.323 9.773 9.229 9.776 9.134 9.776 C 7.755 9.776 6.477 9.343 5.494 8.608 C 4.917 9.074 4.105 9.194 3.386 8.761 L 2.515 8.235 C 1.798 7.802 1.355 6.99 1.355 6.109 L 1.355 3.735 C 1.355 2.854 1.798 2.041 2.515 1.609 L 3.386 1.082 C 4.189 0.597 5.11 0.805 5.688 1.415 C 6.82 0.558 8.296 0 9.757 0 Z M 4.856 5.663 C 4.856 5.66 4.856 5.66 4.856 5.658 L 4.856 2.88 C 4.854 2.45 4.422 2.18 4.073 2.391 L 3.201 2.917 C 2.926 3.083 2.755 3.397 2.755 3.735 L 2.755 6.109 C 2.755 6.448 2.926 6.76 3.201 6.926 L 4.073 7.453 C 4.423 7.664 4.856 7.393 4.856 6.962 L 4.856 5.663 Z M 6.256 2.877 L 6.256 2.833 C 7.189 2.038 8.499 1.501 9.757 1.501 C 12.011 1.501 13.258 3.229 13.258 5.041 L 13.258 5.556 C 13.258 5.972 13.139 6.649 12.964 7.414 C 12.806 8.1 12.617 8.793 12.473 9.322 L 12.437 9.453 C 12.156 10.489 11.224 13.137 10.86 14.099 C 10.76 14.36 10.426 14.576 10.038 14.474 C 9.603 14.359 9.454 13.946 9.566 13.645 C 9.919 12.703 10.803 10.164 11.077 9.159 C 11.235 8.578 10.756 8.042 10.22 8.158 C 9.875 8.232 9.511 8.273 9.134 8.273 C 8.06 8.273 7.098 7.947 6.376 7.434 L 6.372 7.412 C 6.347 7.239 6.325 7.003 6.307 6.749 C 6.272 6.244 6.257 5.74 6.256 5.66 L 6.256 2.881 C 6.256 2.881 6.256 2.879 6.256 2.877 Z" }),
                React.createElement("path", { d: "M 11.198 4.433 C 11.076 4.039 11.274 3.613 11.641 3.482 C 12.008 3.351 12.404 3.564 12.527 3.957 C 12.802 4.842 12.802 5.8 12.527 6.685 C 12.404 7.078 12.008 7.291 11.641 7.16 C 11.274 7.028 11.076 6.603 11.198 6.21 C 11.378 5.634 11.378 5.01 11.198 4.433 Z" })))));
}
;