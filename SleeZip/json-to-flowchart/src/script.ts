import React, { ChangeEventHandler, StrictMode, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import mermaid from "https://esm.sh/mermaid";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<IconSprites />
		<JSONToMermaid />
	</StrictMode>
);

function CopyButton({ text }: CopyButtonProps) {
	const copyTimeout = 750;
	const copyFrameId = useRef(0);
	const [status, setStatus] = useState<CopyStatus>(CopyStatus.Default);
	const isCopying = status !== CopyStatus.Default;
	const buttonProps: CopyButtonAttrs = {
		[CopyStatus.Default]: {
			color: "text-gray-600 dark:text-gray-300",
			icon: "copy",
			title: "Copy"
		},
		[CopyStatus.Failed]: {
			color: "text-red-600 dark:text-red-400",
			icon: "error",
			title: "Failed"
		},
		[CopyStatus.Success]: {
			color: "text-green-600 dark:text-green-400",
			icon: "check",
			title: "Copied!"
		}
	};
	const { color, icon, title } = buttonProps[status];
	const bg = isCopying ? "" : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600";
	const buttonClass = `${bg} rounded ${color} flex gap-1 justify-center items-center relative w-9 h-9 transition focus:outline-none focus:ring focus:ring-blue-400`;

	/** Copy the outputted ASCII art to the clipboard (secure connection required). */
	async function outputCopy() {
		if (status !== CopyStatus.Default) return;

		try {
			await navigator.clipboard.writeText(text);
			setStatus(CopyStatus.Success);
		} catch {
			setStatus(CopyStatus.Failed);
			alert("Connection isn’t secure for copying to the clipboard!");
		}
	}

	useEffect(() => {
		const resetCopyStatus = () => {
			setStatus(CopyStatus.Default);
		};
		clearTimeout(copyFrameId.current);
		copyFrameId.current = setTimeout(resetCopyStatus,copyTimeout);

		return () => clearTimeout(copyFrameId.current);
	}, [status]);

	return (
		<button
			className={buttonClass}
			type="button"
			title={title}
			onClick={outputCopy}
		>
			<Icon icon={icon} />
			{isCopying && <span className="animate-[tip-fade_0.75s_linear] bg-gray-900 dark:bg-gray-100 rounded text-gray-100 dark:text-gray-900 text-xs mb-1.5 px-1.5 py-0.5 absolute bottom-full left-1/2 -translate-x-1/2 transition" aria-hidden="true">{title}</span>}
		</button>
	);
}
function Icon({ icon }: IconProps) {
	const href = `#${icon}`;

	return (
		<svg className="text-current" width="16px" height="16px" aria-hidden="true">
			<use href={href} />
		</svg>
	);
}
function IconSprites() {
	const viewBox = "0 0 16 16";

	return (
		<svg width="0" height="0" display="none">
			<symbol id="check" viewBox={viewBox}>
				<polyline fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="1 8,6 13,15 3" />
            </symbol>
            <symbol id="copy" viewBox={viewBox}>
				<g fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
					<polyline points="11 1,2 1,2 12" />
					<polygon points="5 4,14 4,14 15,5 15" />
				</g>
            </symbol>
			<symbol id="error" viewBox={viewBox}>
				<polyline stroke="currentcolor" strokeLinecap="round" strokeWidth="4" points="8 2,8 8" />
				<circle fill="currentcolor" r="2" cx="8" cy="14" />
            </symbol>
			<symbol id="select" viewBox={viewBox}>
				<polyline fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="4 6,8 10,12 6" />
			</symbol>
		</svg>
	);
}
function JSONToMermaid() {
	const theme = useColorScheme();
	const diagramRef = useRef<HTMLDivElement>(null);
	const [diagram, setDiagram] = useState("");
	const [diagramValid, setDiagramValid] = useState(false);
	const diagramFull = `\`\`\`mermaid\n${diagram}\n\`\`\``;
	const [direction, setDirection] = useState<Direction>("LR");
	const directions: SelectOption[] = [
		{ name: "LR", friendlyName: "Left to Right" },
		{ name: "RL", friendlyName: "Right to Left" },
		{ name: "TB", friendlyName: "Top to Bottom" },
		{ name: "TD", friendlyName: "Top-Down" },
		{ name: "BT", friendlyName: "Bottom to Top" }
	];
	const [outputTab, setOutputTab] = useState("preview");
	const outputTabs: SelectOption[] = [
		{ name: "preview", friendlyName: "Preview" },
		{ name: "code", friendlyName: "Code" }
	];
	const outputTabMap = {
		code: <JSONToMermaidCode code={diagramFull} />,
		preview: <JSONToMermaidPreview>{
			diagramValid ? 
				<div ref={diagramRef} className="mermaid" />
				: <JSONToMermaidError>{diagram}</JSONToMermaidError>
		}</JSONToMermaidPreview>
	};
	const [jsonInput, setJsonInput] = useState(
`{
  "id": "001",
  "position": {
    "x": 20,
    "y": 1,
    "z": 300
  },
  "sleeping": false,
  "items": [
    "Phone",
    "Apple"
  ]
}`
);

	useEffect(() => {
		try {
			const parsed = JSON.parse(jsonInput);
			const lines = Utils.flowchartFromJSON(parsed);
			const mermaidText = `graph ${direction}\n${lines.join("\n")}`;

			setDiagram(mermaidText);
			setDiagramValid(true);
		} catch (e) {
			setDiagram("Invalid JSON");
			setDiagramValid(false);
		}
	}, [jsonInput, direction]);

	useEffect(() => {
		if (!diagramRef.current || !diagramValid) return;

		mermaid.initialize({
			startOnLoad: false,
			theme
			// not working on CodePen for some reason
			// flowchart: {
			// 	diagramPadding: 12,
			// 	useMaxWidth: false
			// }
		});
		// set the raw text content first
		diagramRef.current.innerHTML = diagram;
		// reset mermaid’s internal flag to allow re-rendering
		diagramRef.current.removeAttribute("data-processed");

		try {
			// then try to render it
			mermaid.run({ nodes: [diagramRef.current] });
		} catch (err) {
			console.error("Couldn’t render the chart. Error:", err);
		}
	}, [diagram, theme, outputTab]);

	return (
		<div className="flex flex-col lg:flex-row gap-6 h-screen lg:h-max lg:min-h-screen p-6">
			<div className="flex flex-col flex-1">
				<Textarea
					id="json-input"
					name="json_input"
					label="JSON"
					value={jsonInput}
					onChange={(e) => setJsonInput(e.target.value)}
				/>
			</div>
			<div className="flex flex-col flex-1">
				<SelectMenu
					label="Direction"
					options={directions}
					onChange={(e) => setDirection(e.target.value as Direction)}
					defaultValue={direction}
				/>
				<SegmentedControl
					segments={outputTabs}
					onChange={(tab) => setOutputTab(tab)}
				/>
				{outputTabMap[outputTab as SegmentKey]}
			</div>
		</div>
	);
}
function JSONToMermaidCode({ code }: JSONToMermaidCodeProps) {
	return (
		<div className="flex flex-col relative h-full">
			<div className="absolute top-14 right-5">
				<CopyButton text={code} />
			</div>
			<Textarea
				id="json-output"
				name="json_output"
				label="Code"
				value={code}
				readOnly={true}
			/>
		</div>
	);
}
function JSONToMermaidError({ children }: JSONToMermaidErrorProps) {
	return (
		<div className="text-red-700 dark:text-red-400 font-bold grid place-items-center h-full">
			{children}
		</div>
	);
}
function JSONToMermaidPreview({ children }: JSONToMermaidPreviewProps) {
	return (
		<div className="bg-gray-200 dark:bg-gray-800 overflow-auto relative rounded h-full transition">
			<div className="absolute inset-0">{children}</div>
		</div>
	);
}
function SegmentedControl({ segments, onChange, defaultIndex = 0 }: SegmentedControlProps) {
	const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
	const dir = document.dir === "rtl" ? -1 : 1
	const gap = 0.25;
	const style = {
		transform: `translateX(calc(${100 * selectedIndex * dir}% + ${gap * 2 * selectedIndex * dir}rem))`,
		width: `calc(${100 / segments.length}% - ${gap * 2}rem)`
	};

	/**
	 * Set the selected segment, then run the callback with the segment name.
	 * @param name Name of segment 
	 * @param index Index of segment
	 */
	function onIndexChange(name: string, index: number)  {
		setSelectedIndex(index);
		onChange(name);
	}

	return (
		<div className="bg-gray-200 dark:bg-gray-800 rounded-full flex justify-center items-center mt-0 mx-auto mb-3 relative w-full transition" role="tablist">
			{segments.map((option,i) => (
				<button
					key={i}
					className="bg-transparent rounded-full text-gray-600 hover:text-gray-800 focus-visible:text-gray-800 aria-selected:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:text-gray-200 dark:aria-selected:text-gray-100 font-semibold text-sm p-2 w-full z-10 transition focus:outline-none focus:ring focus:ring-blue-400"
					type="button"
					role="tab"
					aria-selected={selectedIndex === i}
					onClick={() => onIndexChange(option.name, i)}
				>{option.friendlyName}</button>
			))}
			<div className="bg-white dark:bg-gray-700 rounded-full shadow-md absolute inset-1 w-full transition" style={style}></div>
		</div>
	);
}
function SelectMenu({ label, options, onChange, defaultValue }: SelectMenuProps) {
	return (
		<label className="flex items-center gap-2 mb-3 sm:w-max">
			<strong className="font-medium leading-9">{label}</strong>
			<span className="relative inline-block w-full">
				<select
					className="bg-white dark:bg-gray-800 border border-solid border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded text-gray-900 dark:text-gray-100 block px-1.5 py-1 pe-7 w-full transition focus:outline-none focus:ring focus:ring-blue-400 appearance-none"
					onChange={onChange}
					defaultValue={defaultValue}
				>
					{
						options.map((option, i) => {
							const { name, friendlyName } = option;

							return <option key={i} value={name}>{friendlyName}</option>
						})
					}
				</select>
				<span className="text-gray-700 dark:text-gray-300 pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 transition">
					<Icon icon="select" />
				</span>
			</span>
		</label>
	);
}
function Textarea({ id, label, value, onChange, readOnly }: TextareaProps) {
	return (
		<>
			<label
				htmlFor={id}
				className="font-medium leading-9 flex w-max"
			>{label}</label>
			<textarea
				id={id}
				name="textarea"
				className="bg-white dark:bg-gray-800 border border-solid border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded text-gray-900 dark:text-gray-100 block direction-ltr font-mono text-sm px-3 py-2 w-full h-full transition focus:outline-none focus:ring focus:ring-blue-400 resize-none"
				value={value}
				onChange={onChange}
				readOnly={readOnly}
			/>
		</>
	);
}
function useColorScheme() {
	const [theme, setTheme] = useState<Theme>(getTheme());

	function getTheme(): Theme {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "default";
	}

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (event: MediaQueryListEvent) => {
			setTheme(event.matches ? "dark" : "default");
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return theme;
}

class Utils {
	/**
	 * Generate flowchart code from a JSON object
	 * @param json JSON input
	 * @param parent parent ID
	 * @param lines line array
	 */
	static flowchartFromJSON(json: JSONValue, parent = "root", lines: String[] = [], label?: string) {
		const currentId = parent;

		if (typeof json !== "object" || json === null) {
			// prevent redundant quotes in the output 
			const jsonNoQuotes = JSON.stringify(json).replace(/['"]+/g, "");
			const nodeLabel = label ? `**${label}**: ${jsonNoQuotes}` : jsonNoQuotes;

			lines.push(this.nodeByType(json, currentId, nodeLabel));

			return lines;
		}

		const nodeLabel = label ?? "Object";

		if (Array.isArray(json)) {
			// array
			lines.push(`${currentId}{"${nodeLabel}"}`);

			json.forEach((item, index) => {
				const childId = `${currentId}_item${index}`;

				lines.push(`${currentId} --- ${childId}`);
				this.flowchartFromJSON(item, childId, lines);
			});
		} else {
			// object
			lines.push(`${currentId}@{shape: braces, label: "${nodeLabel}"}`);

			for (const key in json) {
				const childId = `${currentId}_${key}`;

				lines.push(`${currentId} --- ${childId}`);
				this.flowchartFromJSON(json[key], childId, lines, key);
			}
		}

		return lines;
	}
	/**
	 * 
	 * @param json JSON to check
	 * @param id node ID
	 * @param label node label
	 */
	private static nodeByType(json: JSONValue, id: string, label: string): string {
		if (typeof json === "boolean") {
			// hexagon
			return `${id}{{"${label}"}}`;
		}
		if (typeof json === "number") {
			// stadium
			return `${id}(["${label}"])`;
		}
		// rounded rectangle
		return `${id}("${label}")`;
	}
}

enum CopyStatus {
	Default = 0,
	Failed = 1,
	Success = 2
}
type Direction = "TB" | "TD" | "BT" | "RL" | "LR";
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
type Theme = "default" | "dark";
type SegmentKey = "code" | "preview";

type CopyButtonAttr = {
	icon: string;
	title: string;
	color?: string;
};
type CopyButtonAttrs = {
    [status in CopyStatus]: CopyButtonAttr;
};
type CopyButtonProps = {
    text: string;
};
type IconProps = {
    icon: string;
};
type JSONToMermaidCodeProps = {
	code: string;
};
type JSONToMermaidErrorProps = {
	children?: React.ReactNode;
};
type JSONToMermaidPreviewProps = {
	children?: React.ReactNode;
};
type SelectOption = {
	name: string;
	friendlyName: string;
};
type SelectMenuProps = {
	label: string;
	options: SelectOption[];
	onChange: ChangeEventHandler<HTMLSelectElement>;
	defaultValue?: string;
};
type SegmentedControlProps = {
	segments: SelectOption[];
	onChange: (name: string) => void;
	defaultIndex?: number;
};
type TextareaProps = {
	id: string;
	name: string;
    label: string;
	value: string;
	onChange?: ChangeEventHandler<HTMLTextAreaElement>;
	readOnly?: boolean;
};