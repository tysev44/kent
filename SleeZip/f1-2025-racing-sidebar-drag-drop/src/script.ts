import React, { useState, useEffect, StrictMode } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import { Reorder } from "https://esm.sh/motion/react";
import clsx from "https://esm.sh/clsx";
import type { ClassValue } from "https://esm.sh/clsx";
import { twMerge } from "https://esm.sh/tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export type Driver = {
    name: string;
    team: string;
    tire: string;
    gap?: number; // Gap to leader in seconds
};

export type Team =
    | "mclaren"
    | "ferrari"
    | "mercedes"
    | "redbull"
    | "haas"
    | "williams"
    | "rb"
    | "alpine"
    | "kick"
    | "aston-martin";

export const drivers: Driver[] = [
    {
        name: "PIA",
        team: "mclaren",
        tire: "M"
    },
    {
        name: "NOR",
        team: "mclaren",
        tire: "S"
    },
    {
        name: "RUS",
        team: "mercedes",
        tire: "H"
    },
    {
        name: "LEC",
        team: "ferrari",
        tire: "S"
    },
    {
        name: "HAM",
        team: "ferrari",
        tire: "M"
    },
    {
        name: "VER",
        team: "redbull",
        tire: "S"
    },
    {
        name: "STR",
        team: "aston-martin",
        tire: "M"
    },
    {
        name: "TSU",
        team: "rb",
        tire: "M"
    },
    {
        name: "OCO",
        team: "haas",
        tire: "H"
    },
    {
        name: "ANT",
        team: "mercedes",
        tire: "M"
    },
    {
        name: "HAD",
        team: "rb",
        tire: "M"
    },
    {
        name: "ALB",
        team: "williams",
        tire: "M"
    },
    {
        name: "GAS",
        team: "alpine",
        tire: "H"
    },
    {
        name: "SAI",
        team: "williams",
        tire: "S"
    },
    {
        name: "DOO",
        team: "alpine",
        tire: "M"
    },
    {
        name: "LAW",
        team: "redbull",
        tire: "S"
    },
    {
        name: "BEA",
        team: "haas",
        tire: "M"
    },
    {
        name: "HUL",
        team: "kick",
        tire: "M"
    },
    {
        name: "BOR",
        team: "kick",
        tire: "M"
    },
    {
        name: "ALO",
        team: "aston-martin",
        tire: "S"
    }
];

const Stripes = () => {
    return (
        <div className="size-full absolute bg-[#25252E] overflow-hidden">
            <div className="absolute bg-[#2B2A37] h-[400%] w-10 rotate-45 -translate-y-1/2" />
            <div className="absolute bg-[#2B2A37] h-[400%] w-10 rotate-45 -translate-y-1/2 translate-x-20" />
            <div className="absolute bg-[#2B2A37] h-[400%] w-16 rotate-45 -translate-y-1/2 translate-x-52" />
            <div className="absolute bg-[#2B2A37] h-[400%] w-7 rotate-45 -translate-y-1/2 translate-x-80" />
        </div>
    );
};

const Header = ({ lap, totalLaps }: { lap: number; totalLaps: number }) => {
    return (
        <div className="relative flex items-center justify-start flex-col h-max w-full">
            <Stripes />

            <div className="relative flex items-center justify-center w-full h-16 z-10">
                <img
                    src="https://f1vipexperience.com/wp-content/uploads/2024/05/f1-logo.png"
                    className="h-full aspect-video absolute"
                />
            </div>

            <div className="bg-[#2B2A37]/70 w-full h-[3px] z-10"></div>
            <div className="h-10 w-full flex items-center gap-2 justify-center z-10 text-zinc-400 tracking-wide">
                <span className="text-white font-normal">LAP</span>
                <span className="text-xl font-bold text-white">{lap}</span>{" "}
                <span>/</span>
                <span>{totalLaps}</span>
            </div>
        </div>
    );
};

const Drivers = () => {
    const [order, setOrder] = useState(() =>
        drivers.map((driver, index) => ({
            ...driver,
            gap: index === 0 ? 0 : +(Math.random() * 0.8 + 0.2).toFixed(3) // Initial gaps
        }))
    );

    useEffect(() => {
        let timeoutId: any;

        const scheduleNextSwap = () => {
            // Random delay between 1 and 4 seconds
            const randomDelay = Math.random() * 3000 + 1000;

            timeoutId = setTimeout(() => {
                setOrder((currentOrder) => {
                    // Pick a random driver to move
                    const randomIndex = Math.floor(
                        Math.random() * currentOrder.length
                    );

                    const movement = Math.random() < 0.5 ? -1 : 1;
                    const newPosition = randomIndex + movement;

                    if (newPosition < 0 || newPosition >= currentOrder.length) {
                        return currentOrder;
                    }

                    // Create new array with swapped positions
                    const newOrder = [...currentOrder];
                    const temp = newOrder[randomIndex];
                    newOrder[randomIndex] = newOrder[newPosition];
                    newOrder[newPosition] = temp;

                    // Recalculate gaps after swap
                    return newOrder.map((driver, idx) => {
                        if (idx === 0) return { ...driver, gap: 0 };

                        // Get previous gap
                        const prevGap = newOrder[idx - 1].gap || 0;

                        // Calculate new gap (previous gap plus random variation)
                        const variation = Math.random() * 0.3 - 0.15; // ±0.15s variation
                        const newGap =
                            prevGap + (Math.random() * 0.8 + 0.2) + variation;

                        return {
                            ...driver,
                            gap: +newGap.toFixed(3)
                        };
                    });
                });
                scheduleNextSwap(); // Schedule the next swap
            }, randomDelay);
        };

        scheduleNextSwap(); // Start the first swap

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <Reorder.Group
            className="flex flex-col gap-[2px]"
            axis="y"
            values={order}
            onReorder={setOrder}
        >
            {order.map((driver, index) => (
                <Reorder.Item
                    key={driver.name}
                    value={driver}
                    className="w-full h-9 flex items-center justify-between cursor-grab active:cursor-grabbing *:select-none"
                >
                    <div
                        className={cn(
                            "bg-black text-white flex items-center justify-center h-full aspect-square",
                            index === 0 && "bg-[#E61B13]"
                        )}
                    >
                        {index + 1}
                    </div>
                    <div className="flex items-center justify-start gap-2 h-full relative grow">
                        <img
                            src={getLogo(driver.team)}
                            className={cn(
                                "h-full aspect-square object-contain p-1 ml-1",
                                driver.team === "mclaren" && "scale-[1.2]",
                                driver.team === "ferrari" && "scale-[1.4]",
                                driver.team === "mercedes" && "scale-[0.8]",
                                driver.team === "redbull" && "scale-[1.4]",
                                driver.team === "haas" && "scale-[0.8]",
                                driver.team === "williams" && "scale-[0.8]",
                                driver.team === "rb" &&
                                    "brightness-0 invert scale-[0.8]",
                                driver.team === "kick" && "scale-[0.8]"
                            )}
                        />
                        <span className="text-white font-bold text-sm">
                            {driver.name}
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 h-full pr-2">
                        <span className="text-zinc-200 text-sm">
                            {index === 0
                                ? "Interval"
                                : `+${driver.gap.toFixed(3)}`}
                        </span>
                        <span
                            className={cn(
                                "text-sm",
                                driver.tire === "S" && "text-red-500",
                                driver.tire === "M" && "text-yellow-400",
                                driver.tire === "H" && "text-zinc-100"
                            )}
                        >
                            {driver.tire}
                        </span>
                    </div>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
};

const getLogo = (team: string) => {
    switch (team) {
        case "mclaren":
            return "https://cdn3.emoji.gg/emojis/9807_McLaren_Logo.png";
        case "ferrari":
            return "https://logos-world.net/wp-content/uploads/2020/07/Ferrari-Scuderia-Logo.png";
        case "mercedes":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/1024px-Mercedes-Logo.svg.png";
        case "redbull":
            return "https://pngimg.com/d/red_bull_PNG1.png";
        case "haas":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Logo_Haas_F1.png/800px-Logo_Haas_F1.png";
        case "williams":
            return "https://cdn.racingnews365.com/Teams/Williams/_375xAUTO_crop_center-center_none/f1_2021_williams_logo.png?v=1643809047";
        case "rb":
            return "https://brandlogos.net/wp-content/uploads/2025/02/racing_bulls-logo_brandlogos.net_bjuef.png";
        case "alpine":
            return "https://cdn.racingnews365.com/Teams/Alpine/_375xAUTO_crop_center-center_none/f1_2021_alpine_logo.png?v=1643808294";
        case "kick":
            return "https://i.namu.wiki/i/M2DRCcTYlEVr82u-N5ggwF2VtxLxzEwqiouKWpQfWgUr2qTV_9BSNBwDZEInzcM6Y945X3YCpHoQZ8f0pC5TXQ.svg";
        case "aston-martin":
            return "https://logos-world.net/wp-content/uploads/2021/03/Aston-Martin-Logo-2021-present.png";
        default:
            return "";
    }
};

const App = () => {
    const [lap, setLap] = useState(1);
    const totalLaps = 56;

    useEffect(() => {
        const interval = setInterval(() => {
            setLap((currentLap) => {
                if (currentLap >= totalLaps) return currentLap;
                return currentLap + 1;
            });
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen w-screen flex items-start justify-start overflow-hidden">
            <img
                src="https://media1.giphy.com/media/kyW1jYqbcNhVj8NZ25/giphy.gif?cid=6c09b9522kz915qetwlfnfdofckg2juesk5gf1ls31xb8qa3&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"
                className="fixed size-full object-cover pointer-events-none"
            />

            <div className="absolute inset-0 w-64 min-h-96 h-max bg-zinc-800/80 flex flex-col overflow-hidden m-2">
                <Header lap={lap} totalLaps={totalLaps} />
                <Drivers />
            </div>
        </main>
    );
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
