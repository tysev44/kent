import React, { createContext, StrictMode, useContext, useEffect, useState, useRef } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
const FinishStepProgressContext = createContext(undefined);
const OnboardingProvider = ({ children }) => {
    const [finishStepProgress, setFinishStepProgress] = useState(1);
    return (React.createElement(FinishStepProgressContext.Provider, { value: { finishStepProgress, setFinishStepProgress } }, children));
};
const useFinishStepProgress = () => {
    const context = useContext(FinishStepProgressContext);
    if (!context) {
        throw new Error("useFinishStepProgress must be used inside OnboardingProvider");
    }
    return context;
};
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement("main", null,
        React.createElement(OnboardingProvider, null,
            React.createElement(OnboardingIconSprites, null),
            React.createElement(Onboarding, null)))));
function Onboarding() {
    const [finishStep, setFinishStep] = useState(-1);
    const [isResetting, setIsResetting] = useState(false); // for temporarily disabling the fades
    const { finishStepProgress, setFinishStepProgress } = useFinishStepProgress();
    const finishSteps = [
        {
            before: {
                title: "Setting up your workspace…",
                subtitle: "Bringing your workspace to life"
            },
            after: {
                title: "Workspace is ready!",
                subtitle: "Dive in and discover what’s possible"
            }
        },
        {
            before: {
                title: "Adding departments…",
                subtitle: "Personalizing your workspace"
            },
            after: {
                title: "Departments added!",
                subtitle: "All prepped and ready for action"
            }
        },
        {
            before: {
                title: "Inviting people…",
                subtitle: "Reaching out to your peers"
            },
            after: {
                title: "Invites sent!",
                subtitle: "Build something great together"
            }
        }
    ];
    const finishStepCount = useRef(finishSteps.length);
    const finishStepProgressFrame = useRef(0);
    const finishStepWait = useRef(0);
    const resettingClass = isResetting ? " onboarding--resetting" : "";
    function reset() {
        setIsResetting(true);
        setFinishStep(-1);
        setFinishStepProgress(1);
    }
    useEffect(() => {
        if (finishStepProgress === 1) {
            setIsResetting(false);
            // stop animating when progress is complete
            cancelAnimationFrame(finishStepProgressFrame.current);
            clearTimeout(finishStepWait.current);
            const nextStep = async () => {
                return await new Promise((resolve) => {
                    finishStepWait.current = setTimeout(resolve, 750);
                }).then(() => {
                    setFinishStepProgress(0);
                    setFinishStep((step) => step + 1);
                });
            };
            nextStep();
        }
        return () => clearTimeout(finishStepWait.current);
    }, [finishStepProgress, setFinishStepProgress]);
    useEffect(() => {
        const nextFrame = () => {
            setFinishStepProgress((percent) => {
                const nextAmount = 0.0125;
                const next = percent + nextAmount;
                if (next >= 1)
                    return 1;
                return next;
            });
            finishStepProgressFrame.current = requestAnimationFrame(nextFrame);
        };
        if (finishStep > -1 && finishStep < finishStepCount.current)
            nextFrame();
        return () => cancelAnimationFrame(finishStepProgressFrame.current);
    }, [finishStep, setFinishStepProgress]);
    return (React.createElement("div", { className: `onboarding${resettingClass}` },
        React.createElement(OnboardingFinishSteps, { currentStep: finishStep, steps: finishSteps }),
        finishStep >= 3 && React.createElement(OnboardingFinished, { startAction: reset })));
}
function OnboardingFinished({ startAction }) {
    return (React.createElement("div", { className: "onboarding__finished" },
        React.createElement(OnboardingIcon, { icon: "check-circle", color: "success" }),
        React.createElement("h2", null, "All set and ready to go!"),
        React.createElement("p", null, "It\u2019s time to explore and take the first step towards enhanced productivity."),
        React.createElement("button", { className: "onboarding__button", type: "button", onClick: startAction }, "Get Started")));
}
function OnboardingFinishStep({ before, after, phase }) {
    const progressActive = phase !== "waiting";
    return (React.createElement("div", { className: `onboarding__finish-step onboarding__finish-step--${phase}` },
        React.createElement(OnboardingFinishStepPhase, { title: before.title, subtitle: before.subtitle, forProgress: true, progressActive: progressActive }),
        React.createElement(OnboardingFinishStepPhase, { title: after.title, subtitle: after.subtitle })));
}
function OnboardingFinishStepPhase({ title, subtitle, forProgress, progressActive }) {
    const { finishStepProgress } = useFinishStepProgress();
    const value = progressActive ? finishStepProgress : 0;
    return (React.createElement("div", { className: "onboarding__finish-step-phase" },
        forProgress ?
            React.createElement(OnboardingFinishStepProgress, { value: value }) :
            React.createElement(OnboardingIcon, { icon: "checkmark", color: "success" }),
        React.createElement("div", { className: "onboarding__finish-step-text" },
            React.createElement("h2", null, title),
            React.createElement("p", null, subtitle))));
}
function OnboardingFinishStepProgress({ value = 0 }) {
    const circumference = 62.83;
    const strokeDash = `${circumference} ${circumference}`;
    const offset = circumference * (1 - value);
    return (React.createElement("svg", { className: "onboarding__progress", viewBox: "0 0 24 24", width: "24px", height: "24px", "aria-hidden": "true" },
        React.createElement("g", { fill: "transparent", strokeLinecap: "round", strokeWidth: "3", transform: "rotate(-90,12,12)" },
            React.createElement("circle", { className: "onboarding__progress-track", cx: "12", cy: "12", r: "10" }),
            React.createElement("circle", { stroke: "currentcolor", cx: "12", cy: "12", r: "10", strokeDasharray: strokeDash, strokeDashoffset: offset }))));
}
function OnboardingFinishSteps({ currentStep, steps }) {
    const { finishStepProgress } = useFinishStepProgress();
    const doneClass = currentStep >= steps.length ? " onboarding__finish-steps--done" : "";
    return (React.createElement("div", { className: `onboarding__finish-steps${doneClass}` }, steps.map((step, i) => {
        let phase = "waiting";
        if (i < currentStep || i === currentStep && finishStepProgress >= 1) {
            phase = "done";
        }
        else if (i === currentStep) {
            phase = "current";
        }
        return React.createElement(OnboardingFinishStep, { before: step.before, after: step.after, phase: phase, key: i });
    })));
}
function OnboardingIcon({ icon, color }) {
    const colorClass = color ? ` onboarding__icon--${color}` : "";
    return (React.createElement("svg", { className: `onboarding__icon${colorClass}`, width: "16px", height: "16px", "aria-hidden": "true" },
        React.createElement("use", { href: `#${icon}` })));
}
function OnboardingIconSprites() {
    const viewBox = "0 0 16 16";
    return (React.createElement("svg", { width: "0", height: "0", "aria-hidden": "true" },
        React.createElement("symbol", { id: "check-circle", viewBox: viewBox },
            React.createElement("circle", { fill: "currentcolor", cx: "8", cy: "8", r: "8" }),
            React.createElement("polyline", { fill: "none", stroke: "var(--bg)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", points: "4 8,7 11,12 5" })),
        React.createElement("symbol", { id: "checkmark", viewBox: viewBox },
            React.createElement("polyline", { fill: "none", stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", points: "2 7,7 11,15 2" }))));
}