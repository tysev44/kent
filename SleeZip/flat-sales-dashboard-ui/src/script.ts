import React, { StrictMode } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

class Formatter {
	static LOCALE = "en-US";
	static CURRENCY = "USD";
	/**
	 * Format a number to include digit separators when needed.
	 * @param value Raw number value
	 */
	static count(value: number) {
		return new Intl.NumberFormat(this.LOCALE).format(value);
	}
	/**
	 * Format a number as a currency value.
	 * @param value Raw number value
	 */
	static currency(value: number) {
		return new Intl.NumberFormat(this.LOCALE, {
			currency: this.CURRENCY,
			style: "currency",
			notation: "compact",
			maximumFractionDigits: 1
		}).format(value);
	}
	/**
	 * Format a number as a percent.
	 * @param value Raw number value
	 */
	static percent(value: number) {
		return new Intl.NumberFormat(this.LOCALE, {
			maximumFractionDigits: 1,
			style: "percent"
		}).format(value);
	}
	/**
	 * Display a date in a friendly format.
	 * @param value Raw date value
	 */
	static date(date: Date) {
		return new Intl.DateTimeFormat(this.LOCALE, {
			dateStyle: "short"
		}).format(date);
	}
}
class Random {
	/** Get a random value. */
	private static random() {
		return crypto.getRandomValues(new Uint32Array(1))[0] / 2**32;
	}
	/**
	 * Get a random floating point value.
	 * @param min Minimum value
	 * @param max Maximum value
	 */
	static float(min: number, max: number) {
		return (this.random() * (max - min)) + min;
	}
	/** Generate a hex-based hash. */
	static hash() {
		return Math.round(this.float(0,1) * 0xffff).toString(16);
	}
	/**
	 * Get a random integer value.
	 * @param min Minimum value
	 * @param max Maximum value
	 */
	static int(min: number, max: number) {
		return Math.floor(this.random() * (max - min)) + min;
	}
}
function fakeData() {
	const data: Sales = {
		overview: {
			top: Random.int(1,15) / 100,
			sales_goals: 0.672,
			number_of_sales: 2608,
			change: 0.035,
			total_sales: 42200,
			total_change: -0.045
		},
		users: [
			{
				name: "Jack O. Lantern",
				avatar: "https://assets.codepen.io/416221/photo-avatar1.jpg"
			},
			{
				name: "Jane Doe",
				avatar: "https://assets.codepen.io/416221/photo-avatar2.jpg"
			},
			{
				name: "Joe Schmoe",
				avatar: "https://assets.codepen.io/416221/photo-avatar3.jpg"
			}
		],
		performance: {
			history: []
		},
		convert_rate: 0.375,
		customer_calls: [
			{
				name: "Ann Thrax",
				vip: true,
				source: "TikTok Leads"
			}
		],
		sales_target: {
			target: 42200,
			streams: [
				{
					change: -0.2,
					revenue: 6800,
					source: "Instagram"
				},
				{
					change: -0.45,
					revenue: 8200,
					source: "Facebook"
				},
				{
					change: 0.7,
					revenue: 15400,
					source: "TikTok"
				},
				{
					change: -0.5,
					revenue: 11800,
					source: "Other"
				}
			]
		}
	};
	// performance index
	const historyPercents = [0.8,0.2,0.5,0.2,0.9,0.3,0.55,0.3,0.15,0.8,0.35,0.3,0.4,0.2,0.85,0.25,0.852];

	historyPercents.forEach((percent,i) => {
		// decrement days from today
		const date = new Date();
		date.setDate(date.getDate() - (historyPercents.length - (i + 1)));
		data.performance.history.push({date,percent});
	});

	return data;
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<IconSprites />
		<Dashboard data={fakeData()} />
	</StrictMode>
);

function ActionBar({ users }: ActionBarProps) {
	const newestUsers = users.slice(0,3);

	return (
		<div className="flex flex-col sm:flex-row justify-between gap-x-1 gap-y-3 mb-6">
			<div className="flex gap-1 items-center">
				{
					newestUsers.map((user,i) => (
						<Avatar key={i} {...user} indentStart={i > 0} />
					))
				}
				<Button color="black" icon="plus">Invite</Button>
			</div>
			<div className="flex gap-1 items-center">
				<Button icon="calendar" shape="square" title="Calendar" />
				<div className="sm:hidden">
					<Button icon="arrow-down" shape="square" title="Download Report" />
				</div>
				<div className="hidden sm:block">
					<Button icon="arrow-down">Download Report</Button>
				</div>
				<div className="sm:hidden">
					<Button color="red" icon="microphone" shape="square" title="AI Assistant" />
				</div>
				<div className="hidden sm:block">
					<Button color="red" icon="microphone">AI Assistant</Button>
				</div>
			</div>
		</div>
	);
}
function Avatar({ name, avatar, indentStart }: AvatarProps) {
	return (
		<div className={`bg-gray-400 dark:bg-gray-700 border border-white dark:border-gray-800 rounded-full overflow-hidden w-12 h-12${indentStart ? ' -ms-8' : ''} transition-colors duration-300`}>
			<img className="block w-full h-auto" src={avatar} width="40" height="40" alt={name} title={name} />
		</div>
	);
}
function Button({ children, title, color, icon, shape = "regular", outline, clickEvent }: ButtonProps) {
	const buttonFills: ButtonColorClass = {
		default: "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 ",
		outline: "hover:bg-gray-100 dark:hover:bg-gray-700 ",
		black: "bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 ",
		red: "bg-red-600 hover:bg-red-700 "
	};
	const buttonTexts: ButtonColorClass = {
		default: "text-black dark:text-white ",
		black: "text-white dark:text-black ",
		white: "text-white ",
		red: "text-red-600 hover:text-red-700 dark:hover:text-red-500 "
	};
	const buttonOutlines: ButtonColorClass = {
		default: "border-2 border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 ",
		red: "border-2 border-red-600 hover:border-red-700 dark:hover:border-red-500 "
	}
	const buttonShapes: ButtonShapeClass = {
		regular: "px-5 py-3 min-w-12 ",
		square: "flex-shrink-0 w-12 ",
		wide: "py-3 w-full "
	};
	let buttonFill = buttonFills["default"];
	let buttonText = buttonTexts["default"];
	let buttonOutline = "";
	const buttonShape = buttonShapes[shape];

	if (color === "black") {
		buttonFill = buttonFills[color];
		buttonText = buttonTexts[color];

	} else if (color && outline) {
		buttonFill = buttonFills["outline"];
		buttonText = buttonTexts[color];
		buttonOutline = buttonOutlines[color];

	} else if (color) {
		buttonFill = buttonFills[color];
		buttonText = buttonTexts["white"];

	} else if (outline) {
		buttonOutline = buttonOutlines["default"];
	}

	return (
		<button className={`${buttonFill}${buttonText}${buttonOutline}focus:outline-none focus-visible:ring rounded-full font-light flex justify-center items-center gap-2 ${buttonShape}h-12 transition-colors duration-300`} type="button" title={title} onClick={() => clickEvent?.()}>
			{icon ? <Icon icon={icon} /> : ""}
			{children}
		</button>
	);
}
function ConvertRate({ percent }: ConvertRateProps) {
	const circumference = 34.56;
	const offset = 34.56 * (1 - percent);
	const dots = 16;
	const dotAngle = +(360 / dots).toFixed(2);
	const angles = [];

	for (let d = 0; d < dots; ++d) {
		angles.push(dotAngle * d);
	}

	return (
		<div className="col-span-6 sm:col-span-2 lg:col-span-2 lg:row-span-2">
			<div className="bg-black dark:bg-white aspect-square rounded-full text-white dark:text-black relative m-auto max-h-64 sm:max-h-none transition-colors duration-300">
				<svg className="m-auto w-full h-auto rtl:-scale-x-100" viewBox="0 0 16 16" width="160px" height="160px" role="img" aria-label={`Ring chart showing a ${Formatter.percent(percent)} fill over a circle made of 16 dots`}>
					<g fill="currentcolor" transform="translate(8,8)">
						{
							angles.map((angle,i) => (
								<circle key={i} r="0.5" transform={`rotate(${angle}) translate(0,-5.5)`} />
							))
						}
						<circle className="stroke-red-600" r="5.5" fill="none" strokeLinecap="round" strokeWidth="1" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={offset} transform="rotate(-90)" />
					</g>
				</svg>
				<div className="absolute inset-0 flex flex-col justify-center text-center">
					<div className="text-xl mb-2">{Formatter.percent(percent)}</div>
					<div className="font-thin text-xs">Convert Rate</div>
				</div>
			</div>
		</div>
	);
}
function CustomerCall({ name, vip, source }: CustomerCallProps) {
	const backgroundUrl = "bg-[url(https://assets.codepen.io/416221/customer-call.png)]";

	return (
		<div className={`bg-red-600 ${backgroundUrl} bg-right-bottom rtl:bg-left bg-contain bg-no-repeat rounded-2xl col-span-6 sm:col-span-3 lg:row-span-4 flex flex-col justify-between p-5 transition-colors duration-300`}>
			<div className="text-white mb-10">
				<h2 className="font-light mb-2">Customer Call</h2>
				<div className="font-thin text-xs">{source}</div>
			</div>
			<div className="bg-white dark:bg-gray-800 rounded-xl p-4 transition-colors duration-300">
				<div className="flex items-center gap-3 mb-3">
					<Button color="red" icon="checkmark" shape="wide">Accept</Button>
					<Button title="Decline" color="red" icon="close" shape="square" outline={true} />
				</div>
				<div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-xl p-4 transition-colors duration-300">
					<div className="mb-2">{name}</div>
					<div className="font-thin text-xs text-gray-600 dark:text-gray-200 transition-colors duration-300">{vip ? 'VIP Customer' : 'Regular Customer'}</div>
				</div>
			</div>
		</div>
	);
}
function Dashboard({ data }: DashboardProps) {	
	const { overview, users, performance, convert_rate, customer_calls, sales_target } = data;
	const { top, sales_goals, number_of_sales, change, total_sales, total_change } = overview;
	const { history } = performance;
	const { target, streams } = sales_target;

	return (
		<div className="m-auto p-6 w-full max-w-screen-2xl">
			<ActionBar users={users} />
			<div className="grid gap-4 grid-cols-6 lg:grid-cols-12 auto-rows-min">
				<SalesOverview top={top} salesGoals={sales_goals} numberOfSales={number_of_sales} change={change} totalSales={total_sales} totalChange={total_change} />
				<PerformanceIndex history={history} />
				<ConvertRate percent={convert_rate} />
				<CustomerCall {...customer_calls[0]} />
				<SalesTarget target={target} streams={streams} />
			</div>
		</div>
	);
}
function HalfCirclePie({ percent }: HalfCirclePieProps) {
	const segments = 14;
	const currentSegmentIndex = Math.floor(percent * segments);
	const segmentAngle = +(180 / segments).toFixed(2);
	const angles = [];

	for (let s = 0; s < segments; ++s) {
		angles.push(segmentAngle / 2 + segmentAngle * s);
	}

	return (
		<svg className="half-circle-pie m-auto rtl:-scale-x-100" viewBox="0 0 34 17" width="340px" height="170px" role="img" aria-label={`Half circle chart showing ${currentSegmentIndex} of ${ segments} segments filled`}>
			{
				angles.map((angle,i) => (
					<path key={i} className={`${i < currentSegmentIndex ? 'fill-red-600' : 'fill-gray-100 dark:fill-gray-700'} transition-colors duration-300`} d="M -2.7 -1.5 L 2.7 -0.98 C 3.1 -0.93 3.5 -0.582 3.5 -0.182 L 3.5 0.217 C 3.5 0.629 3.1 0.93 2.7 0.98 L -2.7 1.5 C -3.142 1.5 -3.5 1.142 -3.5 0.7 L -3.5 -0.7 C -3.5 -1.142 -3.142 -1.5 -2.7 -1.5 Z" transform={`translate(17,17) rotate(${angle}) translate(-13.5,0)`} />
				))
			}
		</svg>
	);
}
function Icon({ icon }: IconProps) {
	return (
		<svg className="icon" width="16px" height="16px" aria-hidden="true">
			<use href={`#${icon}`} />
		</svg>
	);
}
function IconSprites() {
	const viewBox = "0 0 24 24";

	return (
		<svg width="0" height="0" display="none" aria-hidden="true">
			<symbol id="arrow-down" viewBox={viewBox}>
				<g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
					<line x1="12" y1="4" x2="12" y2="20" />
					<polyline points="4 12,12 20,20 12" />
				</g>
			</symbol>
			<symbol id="arrow-up-right" viewBox={viewBox}>
				<g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
					<polyline points="6 6,18 6,18 18" />
					<polyline points="6 18,18 6" />
				</g>
			</symbol>
			<symbol id="arrow-down-right" viewBox={viewBox}>
				<g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
					<polyline points="6 18,18 18,18 6" />
					<polyline points="6 6,18 18" />
				</g>
			</symbol>
            <symbol id="calendar" viewBox={viewBox}>
				<path fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M11 13H13M11 17H13M16 13H18M16 17H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" />
            </symbol>
			<symbol id="checkmark" viewBox={viewBox}>
				<polyline fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" points="3 12,8 18,21 6" />
            </symbol>
            <symbol id="close" viewBox={viewBox}>
				<g stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
					<polyline points="7 7,17 17" />
					<polyline points="17 7,7 17" />
				</g>
            </symbol>
            <symbol id="crown" viewBox={viewBox}>
				<path fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 8L6 20H18L20 8M4 8L5.71624 9.37299C6.83218 10.2657 7.39014 10.7121 7.95256 10.7814C8.4453 10.8421 8.94299 10.7173 9.34885 10.4314C9.81211 10.1051 10.0936 9.4483 10.6565 8.13476L12 5M4 8C4.55228 8 5 7.55228 5 7C5 6.44772 4.55228 6 4 6C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8ZM20 8L18.2838 9.373C17.1678 10.2657 16.6099 10.7121 16.0474 10.7814C15.5547 10.8421 15.057 10.7173 14.6511 10.4314C14.1879 10.1051 13.9064 9.4483 13.3435 8.13476L12 5M20 8C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6C19.4477 6 19 6.44772 19 7C19 7.55228 19.4477 8 20 8ZM12 5C12.5523 5 13 4.55228 13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4C11 4.55228 11.4477 5 12 5ZM12 4H12.01M20 7H20.01M4 7H4.01" />
            </symbol>
            <symbol id="ellipsis" viewBox={viewBox}>
				<g fill="currentcolor">
					<circle cx="4" cy="12" r="3" />
					<circle cx="12" cy="12" r="3" />
					<circle cx="20" cy="12" r="3" />
				</g>
            </symbol>
            <symbol id="microphone" viewBox={viewBox}>
				<path fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12V13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13V12M12 17C9.79086 17 8 15.2091 8 13V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V13C16 15.2091 14.2091 17 12 17Z" />
            </symbol>
            <symbol id="plus" viewBox={viewBox}>
				<g stroke="currentcolor" strokeLinecap="round" strokeWidth="3">
					<line x1="12" y1="4" x2="12" y2="20" />
					<line x1="4" y1="12" x2="20" y2="12" />
				</g>
            </symbol>
		</svg>
	);
}
function PerformanceIndex({ history }: PerformanceIndexProps) {
	const mostRecent = history.slice(0,-1);
	const latest = history.slice(-1)[0];

	return (
		<div className="bg-white dark:bg-gray-800 col-span-6 sm:col-span-4 lg:col-span-5 lg:row-span-2 rounded-2xl flex flex-col gap-4 p-5 transition-colors duration-300">
			<div className="text-black dark:text-white flex gap-5 justify-between transition-colors duration-300">
				<h2>Your Performance Index</h2>
				<span className="text-3xl font-medium">{Formatter.percent(latest.percent)}</span>
			</div>
			<div className="bg-gray-100 dark:bg-gray-700 rounded-xl flex flex-1 justify-between px-3 pt-3 min-h-20 transition-colors duration-300">
				{
					mostRecent.map((item,i) => (
						<PerformanceIndexBar key={i} {...item} />
					))
				}
			</div>
		</div>
	);
}
function PerformanceIndexBar({ date, percent }: PerformanceIndexBarProps) {
	const barID = Random.hash();
	const barStyle = {
		transform: `translateY(${100 - (15 + (percent * 85))}%)`
	};
	const tipStyle = {
		bottom: `${15 + (percent * 85)}%`
	};

	return (
		<div className="w-2 sm:w-3 h-full relative" aria-labelledby={`bar-${barID}-percent bar-${barID}-date`}>
			<div className="group peer overflow-hidden w-full h-full">
				<div className="bg-gray-300 dark:bg-gray-500 group-hover:bg-red-600 rounded-t-full w-full h-full transition duration-300 translate-y-full" style={barStyle}></div>
			</div>
			<span className="bg-black dark:bg-white rounded-full text-white dark:text-black absolute bottom-0 left-1.5 text-xs opacity-0 invisible text-nowrap mb-2 px-2 py-1 pointer-events-none -translate-x-1/2 z-10 transition duration-300 peer-has-[:hover]:opacity-100 peer-has-[:hover]:visible" style={tipStyle}>
				<strong id={`bar-${barID}-percent`} className="font-semibold">{Formatter.percent(percent)}</strong> <span id={`bar-${barID}-date`}>({Formatter.date(date)})</span>
			</span>
		</div>
	);
}
function PerformanceRank({ percent }: PerformanceRankProps) {
	return (
		<div className="bg-gray-100 dark:bg-gray-700 rounded-xl flex gap-3 mb-9 px-4 py-5 transition-colors duration-300">
			<span className="text-red-600 dark:text-red-400 text-2xl transition-colors duration-300">
				<Icon icon="crown" />
			</span>
			<p className="text-black dark:text-white font-light transition-colors duration-300">
				You’re the top <strong className="font-medium text-red-700 dark:text-red-300 transition-colors duration-300">{Formatter.percent(percent)}</strong> of performers
			</p>
		</div>
	);
}
function SalesOverview({ top, salesGoals, numberOfSales, change, totalSales, totalChange }: SalesOverviewProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl col-span-6 lg:col-span-5 lg:row-span-6 p-5 transition-colors duration-300">
			<WidgetHeader>
				<h1 className="text-black dark:text-white text-3xl transition-colors duration-300">
					Sales Overview
				</h1>
			</WidgetHeader>
			<PerformanceRank percent={top} />
			<div className="relative mb-10">
				<HalfCirclePie percent={salesGoals} />
				<div className="text-black dark:text-white absolute bottom-0 left-0 w-full text-center transition-colors duration-300">
					<div className="text-2xl sm:text-4xl font-medium mb-2">
						{Formatter.percent(salesGoals)}
					</div>
					<div className="text-xs font-light">Sales Goals</div>
				</div>
			</div>
			<div className="grid sm:grid-cols-2 gap-4">
				<SalesOverviewStat sales={numberOfSales} change={change} />
				<SalesOverviewStat sales={totalSales} change={totalChange} isCurrency={true} />
			</div>
		</div>
	);
}
function SalesOverviewStat({ sales, isCurrency, change }: SalesOverviewStatProps) {
	const notLoss = change >= 0;
	
	return (
		<div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-xl flex flex-col justify-between p-4 transition-colors duration-300">
			<div className="flex justify-between items-start gap-6 mb-4">
				<span className="text-xs font-light">
					{isCurrency ? "Total Sales" : "Number of Sales"}
				</span>
				<span className={`${notLoss ? 'bg-red-600' : 'bg-black dark:bg-white'} rounded-full flex justify-center items-center gap-1 text-xs font-light text-white${notLoss ? '' : ' dark:text-black'} px-2 py-1 transition-colors duration-300`}>
					{Formatter.percent(Math.abs(change))}
					<span className="rtl:-scale-x-100">
						<Icon icon={notLoss ? "arrow-up-right" : "arrow-down-right"} />
					</span>
					<span className="sr-only">{notLoss ? "up" : "down"}</span>
				</span>
			</div>
			<div className="text-3xl font-medium">
				{isCurrency ? Formatter.currency(sales) : Formatter.count(sales)}
			</div>
		</div>
	);
}
function SalesTarget({ target, streams }: SalesTargetProps) {
	const topStreams = streams.slice(0,4);
	const mostRevenue = topStreams.map(stream => stream.revenue).sort((a,b) => b - a)[0];
	const maxRevenue = Math.ceil(mostRevenue / 5e3) * 5e3;

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl col-span-6 sm:col-span-3 lg:col-span-4 lg:row-span-4 flex flex-col p-5 transition-colors duration-300">
			<WidgetHeader>
				<h2 className="text-black dark:text-white w-1/2 transition-colors duration-300">
					Sales Target by Revenue Streams
				</h2>
			</WidgetHeader>
			<div className="text-black dark:text-white text-3xl font-medium mb-4 transition-colors duration-300">{Formatter.currency(target)}</div>
			<div className="grid grid-cols-4 gap-3 mt-auto">
				{
					topStreams.map((stream,i) => (
						<SalesTargetStream key={i} maxRevenue={maxRevenue} {...stream} />
					))
				}
			</div>
		</div>
	);
}
function SalesTargetStream({ change, revenue, maxRevenue, source }: SalesTargetStreamProps) {
	const notLoss = change >= 0;
	const percent = 1 - revenue / maxRevenue;
	const barStyle = {
		transform: `translateY(${percent * 100}%)`
	};
	const barWrapHeight = 8;
	const barWrapStyle = {
		height: `${barWrapHeight}rem`
	};
	const tagStyle = {
		transform: `translateY(${Math.min(barWrapHeight - 2.25,percent * barWrapHeight)}rem)`
	};

	return (
		<div className="group text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white w-full transition-colors duration-300">
			<div className="flex items-center gap-0.5 mb-2">
				{Formatter.percent(Math.abs(change))}
				<span className="rtl:-scale-x-100">
					<Icon icon={notLoss ? "arrow-up-right" : "arrow-down-right"} />
				</span>
				<span className="sr-only">{notLoss ? "up" : "down"}</span>
			</div>
			<div className="relative mb-2">
				<div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-20 overflow-hidden transition-colors duration-300" style={barWrapStyle}>
					<div className="bg-gray-300 dark:bg-gray-500 group-hover:bg-red-600 rounded-lg w-full h-full translate-y-full transition duration-300" style={barStyle}></div>	
				</div>
				<span className="bg-red-600 group-hover:bg-black dark:group-hover:bg-white rounded-full text-xs font-light text-white dark:group-hover:text-black px-2 py-1 absolute top-1.5 -left-2.5 rtl:-right-2.5 rtl:left-auto transition duration-300" style={tagStyle}>{Formatter.currency(revenue)}</span>
			</div>
			<div className="text-sm truncate">{source}</div>
		</div>
	);
}
function WidgetHeader({ children }: WidgetHeaderProps) {
	return (
		<div className="flex justify-between gap-5 mb-6">
			{children}
			<Button title="Options" icon="ellipsis" shape="square" outline={true} />
		</div>
	);
}

interface Sales {
	overview: SalesOverview;
	users: SalesUser[];
	performance: SalesPerformance;
	convert_rate: number;
	customer_calls: SalesCustomer[];
	sales_target: SalesTarget;
}
interface SalesOverview {
	top: number;
	sales_goals: number;
	number_of_sales: number;
	change: number;
	total_sales: number;
	total_change: number;
}
interface SalesUser {
	name: string;
	avatar: string;
}
interface SalesPerformance {
	history: SalesPerformanceHistoryItem[];
}
interface SalesPerformanceHistoryItem {
	date: Date;
	percent: number;
}
interface SalesCustomer {
	name: string;
	vip: boolean;
	source: string;
}
interface SalesTarget {
	target: number;
	streams: SalesRevenueStream[];
}
interface SalesRevenueStream {
	change: number;
	revenue: number;
	source: string;
}

type ActionBarProps = {
	users: SalesUser[];
};
type DashboardProps = {
	data: Sales;
};
type AvatarProps = {
	name: string;
	avatar: string;
	indentStart?: boolean;
};
type ButtonProps = {
    children?: React.ReactNode;
	title?: string;
	color?: string;
	icon?: string;
	shape?: ButtonShape;
	outline?: boolean;
	clickEvent?: () => void;
};
type ButtonColorClass = {
	[index: string]: string;
};
type ButtonShape = "regular" | "square" | "wide";
type ButtonShapeClass = {
	[index in ButtonShape]: string;
};
type ConvertRateProps = {
	percent: number;
};
type CustomerCallProps = {
	name: string;
	vip: boolean;
	source: string;
};
type HalfCirclePieProps = {
	percent: number;
};
type IconProps = {
    icon: string;
};
type PerformanceIndexProps = {
	history: SalesPerformanceHistoryItem[];
};
type PerformanceIndexBarProps = {
	date: Date;
	percent: number;
};
type PerformanceRankProps = {
	percent: number;
};
type SalesOverviewProps = {
	top: number;
	salesGoals: number;
	numberOfSales: number;
	change: number;
	totalSales: number;
	totalChange: number;
};
type SalesOverviewStatProps = {
	sales: number;
	change: number;
	isCurrency?: boolean;
};
type SalesTargetProps = {
	target: number;
	streams: SalesRevenueStream[];
};
type SalesTargetStreamProps = {
	change: number;
	revenue: number;
	maxRevenue: number;
	source: string;
};
type WidgetHeaderProps = {
	children?: React.ReactNode;
};