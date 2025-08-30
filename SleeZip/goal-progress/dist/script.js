import React, { StrictMode, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
function fakeData() {
    return [
        {
            pace: 0.2,
            actual: 0.3
        },
        {
            pace: 0.6,
            actual: 0.6
        },
        {
            pace: 0.8,
            actual: 0.5
        }
    ];
}
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement("main", null, fakeData().map((item, i) => React.createElement(GoalProgress, Object.assign({ key: i }, item))))));
function GoalProgress({ pace, actual }) {
    const [animated, setAnimated] = useState(false);
    const animationRef = useRef(0);
    const LOCALE = "en-US";
    const percentFormat = new Intl.NumberFormat(LOCALE, {
        style: "percent",
        maximumFractionDigits: 1
    });
    const paceText = {
        "par": "at pace",
        "ahead": "ahead of pace",
        "behind": "behind pace"
    };
    const scheduleText = {
        "par": "on schedule",
        "ahead": `${percentFormat.format(actual - pace)} ahead of schedule`,
        "behind": `${percentFormat.format(pace - actual)} behind schedule`
    };
    const knobText = percentFormat.format(actual);
    const paceTranslateX = (1 - pace) * -100;
    const paceStyle = {
        transform: `translateX(${animated ? paceTranslateX : -100}%)`
    };
    const actualTranslateX = (1 - actual) * -100;
    const actualStyle = {
        transform: `translateX(${animated ? actualTranslateX : -100}%)`
    };
    const knobTranslateX = actual * 100;
    const knobStyle = {
        transform: `translateX(${animated ? knobTranslateX : 0}%)`
    };
    let status = "par";
    if (actual > pace) {
        status = "ahead";
    }
    else if (actual < pace) {
        status = "behind";
    }
    const statusClass = `goal-progress goal-progress--${status}`;
    useEffect(() => {
        // allow the animation to run on mount
        animationRef.current = setTimeout(() => setAnimated(true), 150);
    }, []);
    return (React.createElement("div", { className: statusClass },
        React.createElement("h2", null, "Goal Progress"),
        React.createElement("div", { className: "goal-progress__bar" },
            React.createElement("div", { className: "goal-progress__bar-track" },
                React.createElement("div", { className: "goal-progress__bar-fill-bottom", style: status === "ahead" ? actualStyle : paceStyle }),
                React.createElement("div", { className: "goal-progress__bar-fill-top", style: status === "ahead" ? paceStyle : actualStyle })),
            React.createElement("div", { className: "goal-progress__bar-knob-wrap" },
                React.createElement("div", { className: "goal-progress__bar-knob-track", style: knobStyle },
                    React.createElement("div", { className: "goal-progress__bar-knob", "aria-label": knobText, title: knobText })))),
        React.createElement("p", null,
            "You\u2019re ",
            React.createElement("strong", { className: "goal-progress__status" }, paceText[status]),
            " and should reach your goal ",
            React.createElement("strong", null, scheduleText[status]),
            ".")));
}
;