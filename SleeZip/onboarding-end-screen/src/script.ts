import React, { createContext, Dispatch, SetStateAction, StrictMode, useContext, useEffect, useState, useRef } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

const FinishStepProgressContext = createContext<FinishProgressContextType | undefined>(undefined);

const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
	const [finishStepProgress, setFinishStepProgress] = useState(1);

	return (
		<FinishStepProgressContext.Provider value={{ finishStepProgress, setFinishStepProgress }}>
			{children}
		</FinishStepProgressContext.Provider>
	);
};
const useFinishStepProgress = () => {
	const context = useContext(FinishStepProgressContext);
	if (!context) {
		throw new Error("useFinishStepProgress must be used inside OnboardingProvider");
	}
	return context;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<main>
			<OnboardingProvider>
				<OnboardingIconSprites />
				<Onboarding />
			</OnboardingProvider>
		</main>
	</StrictMode>
);
function Onboarding() {
	const [finishStep, setFinishStep] = useState(-1);
	const [isResetting, setIsResetting] = useState(false); // for temporarily disabling the fades
	const {finishStepProgress, setFinishStepProgress} = useFinishStepProgress();
	const finishSteps: FinishStep[] = [
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
					finishStepWait.current = setTimeout(resolve,750);
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
				if (next >= 1) return 1;
				return next;
			});
			finishStepProgressFrame.current = requestAnimationFrame(nextFrame);
		};

		if (finishStep > -1 && finishStep < finishStepCount.current) nextFrame();

		return () => cancelAnimationFrame(finishStepProgressFrame.current);
	}, [finishStep, setFinishStepProgress]);

	return (
		<div className={`onboarding${resettingClass}`}>
			<OnboardingFinishSteps currentStep={finishStep} steps={finishSteps} />
			{finishStep >= 3 && <OnboardingFinished startAction={reset} />}
		</div>
	);
}
function OnboardingFinished({ startAction }: OnboardingFinishedProps) {
	return (
		<div className="onboarding__finished">
			<OnboardingIcon icon="check-circle" color="success" />
			<h2>All set and ready to go!</h2>
			<p>It’s time to explore and take the first step towards enhanced productivity.</p>
			<button className="onboarding__button" type="button" onClick={startAction}>Get Started</button>
		</div>
	);
}
function OnboardingFinishStep({ before, after, phase }: OnboardingFinishStepProps) {
	const progressActive = phase !== "waiting";
	
	return (
		<div className={`onboarding__finish-step onboarding__finish-step--${phase}`}>
			<OnboardingFinishStepPhase title={before.title} subtitle={before.subtitle} forProgress={true} progressActive={progressActive} />
			<OnboardingFinishStepPhase title={after.title} subtitle={after.subtitle} />
		</div>
	);
}
function OnboardingFinishStepPhase({ title, subtitle, forProgress, progressActive }: OnboardingFinishStepPhaseProps) {
	const {finishStepProgress} = useFinishStepProgress();
	const value = progressActive ? finishStepProgress : 0;

	return (
		<div className="onboarding__finish-step-phase">
			{forProgress ?
				<OnboardingFinishStepProgress value={value} /> :
				<OnboardingIcon icon="checkmark" color="success" />
			}
			<div className="onboarding__finish-step-text">
				<h2>{title}</h2>
				<p>{subtitle}</p>
			</div>
		</div>
	);
}
function OnboardingFinishStepProgress({ value = 0 }: OnboardingFinishStepProgressProps) {
	const circumference = 62.83;
	const strokeDash = `${circumference} ${circumference}`;
	const offset = circumference * (1 - value);

	return (
		<svg className="onboarding__progress" viewBox="0 0 24 24" width="24px" height="24px" aria-hidden="true">
			<g fill="transparent" strokeLinecap="round" strokeWidth="3" transform="rotate(-90,12,12)">
				<circle className="onboarding__progress-track" cx="12" cy="12" r="10" />
				<circle stroke="currentcolor" cx="12" cy="12" r="10" strokeDasharray={strokeDash} strokeDashoffset={offset} />
			</g>
		</svg>
	);
}
function OnboardingFinishSteps({ currentStep, steps }: OnboardingFinishStepsProps) {
	const {finishStepProgress} = useFinishStepProgress();
	const doneClass = currentStep >= steps.length ? " onboarding__finish-steps--done" : "";

	return (
		<div className={`onboarding__finish-steps${doneClass}`}>
			{steps.map((step,i) => {
				let phase: FinishStepPhaseName = "waiting";

				if (i < currentStep || i === currentStep && finishStepProgress >= 1)  {
					phase = "done";
				} else if (i === currentStep) {
					phase = "current";
				}

				return <OnboardingFinishStep before={step.before} after={step.after} phase={phase} key={i} />
			})}
		</div>
	);
}
function OnboardingIcon({ icon, color }: OnboardingIconProps) {
	const colorClass = color ? ` onboarding__icon--${color}` : "";

	return (
		<svg className={`onboarding__icon${colorClass}`} width="16px" height="16px" aria-hidden="true">
			<use href={`#${icon}`} />
		</svg>
	);
}
function OnboardingIconSprites() {
	const viewBox = "0 0 16 16";

	return (
		<svg width="0" height="0" aria-hidden="true">
			<symbol id="check-circle" viewBox={viewBox}>
				<circle fill="currentcolor" cx="8" cy="8" r="8" />
				<polyline fill="none" stroke="var(--bg)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" points="4 8,7 11,12 5" />
			</symbol>
			<symbol id="checkmark" viewBox={viewBox}>
				<polyline fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="2 7,7 11,15 2" />
			</symbol>
		</svg>
	)
}

type FinishProgressContextType = {
	finishStepProgress: number;
	setFinishStepProgress: Dispatch<SetStateAction<number>>;
};
type FinishStep = {
    before: FinishStepPhase;
    after: FinishStepPhase;
};
type FinishStepPhase = {
    title: string;
    subtitle: string;
};
type FinishStepPhaseName = "waiting" | "current" | "done";
type OnboardingFinishedProps = {
    startAction?: () => void
};
type OnboardingFinishStepProps = {
    before: FinishStepPhase;
    after: FinishStepPhase;
    phase: FinishStepPhaseName;
};
type OnboardingFinishStepsProps = {
	currentStep: number;
    steps: FinishStep[];
};
type OnboardingFinishStepPhaseProps = {
	title: string;
    subtitle: string;
    forProgress?: boolean;
    progressActive?: boolean;
};
type OnboardingFinishStepProgressProps = {
    value?: number;
}
type OnboardingIconProps = {
    icon: string;
    color?: string;
};
type OnboardingProviderProps = {
    children: React.ReactNode
};