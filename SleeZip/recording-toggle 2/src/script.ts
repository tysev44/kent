import React, { StrictMode, useEffect, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RecordingToggle />
	</StrictMode>
);

function RecordingToggle() {
	const [recording, setRecording] = useState(false);
	const [time, setTime] = useState(0);
	const timeMax = 60;
	const [timeStopped, setTimeStopped] = useState(0);
	const circumference = recording ? 40.84 : 50.27;
	const circumferencePart = recording ? 1 - (time / timeMax) : 1;
	const strokeDashArray = `${circumference} ${circumference}`;
	const strokeDashOffset = +(circumference * circumferencePart).toFixed(2);

	function timeFormatted() {
		const timeToDisplay = recording ? time : timeStopped;
		const minutes = `0${Math.floor(timeToDisplay / 60)}`.slice(-2);
		const seconds = `0${timeToDisplay % 60}`.slice(-2);
		return `${minutes}:${seconds}`;
	}
	// timer loop
	useEffect(() => {
		let frameId = 0;

		if (recording) {
			setTimeStopped(0);
			const render = () => {
				setTime((time) => time + 1);
				// allow the time to be shown in the transition when stopping
				setTimeStopped((time) => time + 1);
				frameId = setTimeout(render,1e3);
			};
			frameId = setTimeout(render,1e3);
		} else {
			setTime(0);
			clearTimeout(frameId);
		}
		return () => {
			clearTimeout(frameId);
		};
	}, [recording]);
	// stop automatically if time hits limit
	useEffect(() => {
		if (time >= timeMax) {
			setRecording(false);
		}
	}, [time])

	return (
		<button
			className="recorder"
			type="button"
			aria-pressed={recording}
			onClick={() => setRecording(!recording)}
		>
			<span className="recorder__label-start" aria-hidden={recording}>Stop</span>
			<span className="recorder__switch">
				<span className="recorder__switch-handle">
					<svg className="recorder__timer" viewBox="0 0 16 16" width="16px" height="16px" aria-hidden="true">
						<g fill="none" strokeLinecap="round" strokeWidth="0" transform="rotate(-90,8,8)">
							<circle className="recorder__timer-ring" stroke="hsla(0,0%,100%,0.3)" cx="8" cy="8" r="8" />
							<circle className="recorder__timer-ring" stroke="hsla(0,0%,100%,0.5)" cx="8" cy="8" r="8" strokeDasharray={strokeDashArray} strokeDashoffset={strokeDashOffset} />
						</g>
					</svg>
				</span>
			</span>
			<span className="recorder__label-end" aria-hidden={!recording}>
				<span className="recorder__label-end-text">Record</span>
				<span className="recorder__label-end-text">{timeFormatted()}</span>
			</span>
		</button>
	)
}