import React, { StrictMode, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function fakeData() {
	const KB = 1024;
	const MB = KB * 1024;
	const GB = MB * 1024;
	const maxMemory = 64 * GB;
	const randomIDAndMemory = () => ({
		id: crypto.randomUUID(),
		memory: Math.round(maxMemory * (Utils.randomFloat(0.1,0.33)))
	});

	return {
		maxMemory,
		data: [
			{
				...randomIDAndMemory(),
				name: "Regular",
				color: "cyan"
			},
			{
				...randomIDAndMemory(),
				name: "System",
				color: "red"
			},
			{
				...randomIDAndMemory(),
				name: "Shared",
				color: "yellow"
			}
		]
	};
}
function Icon({ icon }: IconProps) {
	return (
		<svg className="w-4 h-4" width="16px" height="16px" aria-hidden="true">
			<use href={`#${icon}`} />
		</svg>
	);
}
function IconSprites() {
	const viewBox = "0 0 16 16";

	return (
		<svg width="0" height="0" display="none">
            <symbol id="upgrade" viewBox={viewBox}>
				<g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
					<circle r="7" cx="8" cy="8" />
					<polyline points="5 8,8 5,11 8" />
					<polyline points="8 5,8 11" />
				</g>
            </symbol>
		</svg>
	);
}
function StorageWidget({ maxMemory = 0, data = [] }: StorageWidgetProps) {
	let memoryUsed = 0;

	for (let cat of data) {
		memoryUsed += cat.memory;
	}

	const cats = [
		...data,
		{
			id: "0",
			name: "Free",
			memory: maxMemory - memoryUsed
		}
	];
	const memoryOnly = cats.map(cat => cat.memory);
	const memoryCompounded: number[] = [];

	for (let i = 0; i < memoryOnly.length; ++i) {
		// create an array where each value is a total of the previous values; this is needed for the bar position animations
		memoryCompounded.push(memoryOnly.slice(0,i + 1).reduce((a,b) => a + b));
	}

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-5 py-5 transition">
			<StorageWidgetHeader />
			<StorageWidgetTotal used={memoryUsed} max={maxMemory} />
			<StorageWidgetBarGraph>
				{
					cats.map((cat,i) => {
						const percentCurrent = cat.memory / maxMemory;
						// use the combined previous percents as the offset
						const offset = memoryCompounded[i - 1] / maxMemory || 0;
						const ariaLabel = `${Utils.formatBytes(cat.memory)} ${cat.name}`;
						const forEmpty = i === cats.length - 1;

						return (
							<StorageWidgetBar key={cat.id} color={cat.color} percent={percentCurrent} offset={offset} ariaLabel={ariaLabel} forEmpty={forEmpty} />
						);
					})
				}
			</StorageWidgetBarGraph>
			<StorageWidgetCategoryList>
				{cats.map(cat => (
					<StorageWidgetCategory key={cat.id} color={cat.color} name={cat.name} memory={cat.memory} />
				))}
			</StorageWidgetCategoryList>
		</div>
	);
}
function StorageWidgetBar({ color, percent = 0, offset = 0, forEmpty, ariaLabel }: StorageWidgetBarProps) {
	const animationRef = useRef(0);
	const [animated, setAnimated] = useState(false);
	const barColor = Utils.fillColor(color);
	const barPercent = percent * 100;
	const barOffset = offset * 100;
	const containerStyle = {
		transform: `translateX(${animated ? 0 : -barOffset}%)`
	};
	const containerXPos = forEmpty === true ? "right-0" : "left-0";
	const barStyle = {
		opacity: animated || forEmpty === true ? 1 : 0,
		right: "auto",
		left: `${barOffset}%`,
		width: `${barPercent}%`
	};
	const borderClass = offset === 0 ? "" : "border-l border-l-2 border-l-white dark:border-l-gray-800";

	if (forEmpty === true) {
		// for the empty fill, start at 100%, then move outside to the end
		containerStyle.transform = `translateX(${animated ? `calc(2px + ${barOffset}%)` : 0})`;
		barStyle.right = "0";
		barStyle.left = "auto";
		barStyle.width = "calc(100% + 2px)";
	}

	useEffect(() => {
		// allow the animation to run after render
		animationRef.current = setTimeout(() => setAnimated(true),200);

		return () => {
			clearTimeout(animationRef.current);
		};
	}, []);

	return (
		<div className="rounded-full absolute inset-0 overflow-hidden rtl:-scale-x-100">
			<div className={`absolute top-0 ${containerXPos} w-full h-full transition-transform duration-700`} style={containerStyle}>
				<div className={`${barColor} ${borderClass} absolute top-0 h-full transition-colors`} style={barStyle} aria-label={ariaLabel}></div>
			</div>
		</div>
	);
}
function StorageWidgetBarGraph({ children }: StorageWidgetBarGraphProps) {
	return (
		<div className="mb-5 h-5 relative">
			{children}
		</div>
	);
}
function StorageWidgetCategory({ color, name, memory = 0 }: StorageWidgetCategoryProps) {
	const catColor = Utils.fillColor(color);

	return (
		<div className="flex items-center gap-2">
			<div className={`${catColor} rounded-sm w-4 h-3 transition-colors`}></div>
			<span className="flex gap-x-1.5">
				<strong className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">
					{name}
				</strong>
				<span className="text-gray-600 dark:text-gray-400 transition-colors">
					{Utils.formatBytes(memory)}
				</span>
			</span>
		</div>
	);
}
function StorageWidgetCategoryList({ children }: StorageWidgetCategoryListProps) {
	return (
		<div className="flex gap-x-5 gap-y-1 flex-wrap text-sm">
			{children}
		</div>
	);
}
function StorageWidgetHeader() {
	return (
		<div className="flex justify-between items-center mb-2">
			<div className="text-gray-600 dark:text-gray-400 font-semibold truncate transition-colors">Storage</div>
			<button className="flex items-center gap-1 rounded-full bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900 dark:hover:bg-cyan-800 border border-cyan-200 hover:border-cyan-300 dark:border-cyan-800 dark:hover:border-cyan-700 text-cyan-600 dark:text-cyan-400 font-medium text-sm ms-3 px-2 py-0.5 transition-colors" type="button">
				<Icon icon="upgrade" /> Upgrade
			</button>
		</div>
	);
}
function StorageWidgetTotal({ used, max }: StorageWidgetTotalProps) {
	return (
		<div className="mb-4">
			<span className="font-medium text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 transition-colors">
				{Utils.formatBytes(used)}
				<sup className="text-gray-600 dark:text-gray-400 ms-3 text-sm sm:text-base -top-4 transition-colors">
					of {Utils.formatBytes(max)}
				</sup>
			</span>
		</div>
	);
}

class Utils {
	/**
	 * Format a value as bytes.
	 * @param bytes Number of bytes
	 * @param decimals Number of decimal places
	 */
	static formatBytes(bytes: number, decimals: number = 2) {
		const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "RB", "QB"];

		if (bytes === 0) return `${bytes} ${sizes[0]}`;
		
		const KB = 1024;
		const sizeIndex = Math.floor(Math.log(Math.abs(bytes)) / Math.log(KB));
		const value = parseFloat((bytes / (KB ** sizeIndex)).toFixed(decimals));
		const label = sizes[sizeIndex];

		return `${value} ${label}`;
	}
	/** Return a random value between 0 and 1. */
	static random() {
		return crypto.getRandomValues(new Uint32Array(1))[0] / 2**32;
	}
	/**
	 * Return a random value between a given minimum and maximum value.
	 * @param min Minimum value
	 * @param max Maximum value
	 */
	static randomFloat(min: number, max: number) {
		return min + ((max - min) * this.random());
	}
	/**
	 * Get the fill color for a given color name, or get the theme default.
	 * @param color Name of color
	 */
	static fillColor(color?: string) {
		const colorKeys: StorageWidgetBarColorClass = {
			red: "bg-red-500",
			yellow: "bg-yellow-500",
			green: "bg-green-500",
			cyan: "bg-cyan-500",
			blue: "bg-blue-500",
			gray: "bg-gray-500",
			default: "bg-gray-200 dark:bg-gray-600"
		};

		return color ? colorKeys[color] : colorKeys["default"];
	}
}

interface StorageCategory {
	id: string;
	name: string;
	memory: number;
	color?: string;
};
type IconProps = {
    icon: string;
};
type StorageWidgetProps = {
	maxMemory?: number;
	data?: StorageCategory[];
};
type StorageWidgetBarColorClass = {
	[index: string]: string;
};
type StorageWidgetBarProps = {
	color?: string;
	percent?: number;
	offset?: number;
	forEmpty?: boolean;
	ariaLabel?: string;
};
type StorageWidgetBarGraphProps = {
	children?: React.ReactNode;
};
type StorageWidgetCategoryProps = {
	color?: string;
	name: string;
	memory?: number;
};
type StorageWidgetCategoryListProps = {
	children?: React.ReactNode;
};
type StorageWidgetTotalProps = {
	used: number;
	max: number;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<IconSprites />
		<div className="flex h-screen">
			<div className="m-auto p-6 w-full max-w-screen-md">
				<StorageWidget {...fakeData()} />
			</div>
		</div>
	</StrictMode>
);