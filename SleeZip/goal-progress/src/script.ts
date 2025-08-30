import React, { StrictMode, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function fakeData(): GoalProgressProps[] {
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

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<main>
			{fakeData().map((item,i) => <GoalProgress key={i} {...item} />)}
		</main>
	</StrictMode>
);

function GoalProgress({ pace, actual }: GoalProgressProps) {
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
	let status: GoalProgressStatus = "par";

	if (actual > pace) {
		status = "ahead";
	} else if (actual < pace) {
		status = "behind";
	}

	const statusClass = `goal-progress goal-progress--${status}`;

	useEffect(() => {
		// allow the animation to run on mount
		animationRef.current = setTimeout(() => setAnimated(true),150);
	}, [])

	return (
		<div className={statusClass}>
			<h2>Goal Progress</h2>
			<div className="goal-progress__bar">
				<div className="goal-progress__bar-track">
					<div className="goal-progress__bar-fill-bottom" style={status === "ahead" ? actualStyle : paceStyle}></div>
					<div className="goal-progress__bar-fill-top" style={status === "ahead" ? paceStyle : actualStyle}></div>
				</div>
				<div className="goal-progress__bar-knob-wrap">
					<div className="goal-progress__bar-knob-track" style={knobStyle}>
						<div className="goal-progress__bar-knob" aria-label={knobText} title={knobText}></div>
					</div>
				</div>
			</div>
			<p>You’re <strong className="goal-progress__status">{paceText[status]}</strong> and should reach your goal <strong>{scheduleText[status]}</strong>.</p>
		</div>
	)
}

interface GoalProgressProps {
	pace: number;
	actual: number;
};
type GoalProgressStatus = "par" | "ahead" | "behind";