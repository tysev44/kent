import React, { StrictMode, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement(IconSprites, null),
    React.createElement("div", { className: "widget-grid" },
        React.createElement(StockWidget, { symbol: "IBM", name: "IBM" }),
        React.createElement(StockWidget, { symbol: "MSFT", name: "Microsoft Corporation" }))));
function Icon({ icon, color = "", size = "" }) {
    const _color = color ? ` icon--${color}` : '';
    const _size = size ? ` icon--${size}` : '';
    return (React.createElement("svg", { className: `icon${_color}${_size}`, width: "16px", height: "16px", "aria-hidden": "true" },
        React.createElement("use", { href: `#${icon}` })));
}
function IconSprites() {
    const viewBox = "0 0 16 16";
    return (React.createElement("svg", { width: "0", height: "0", display: "none" },
        React.createElement("symbol", { id: "up", viewBox: viewBox },
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1" },
                React.createElement("polyline", { points: "2 8,8 2,14 8" }),
                React.createElement("polyline", { points: "8 2,8 14" }))),
        React.createElement("symbol", { id: "down", viewBox: viewBox },
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1" },
                React.createElement("polyline", { points: "8 2,8 14" }),
                React.createElement("polyline", { points: "2 8,8 14,14 8" }))),
        React.createElement("symbol", { id: "warning", viewBox: viewBox },
            React.createElement("g", { fill: "none", stroke: "currentcolor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1" },
                React.createElement("polygon", { points: "8 1,15 14,1 14" }),
                React.createElement("polyline", { points: "8 6,8 10" }),
                React.createElement("polyline", { points: "8 12,8 12" })))));
}
function StockWidget({ symbol, name }) {
    const [fetching, setFetching] = useState(false);
    const [status, setStatus] = useState("loading");
    const [data, setData] = useState([]);
    const LOCALE = "en-US";
    const CURRENCY = "USD";
    const currencyFormat = new Intl.NumberFormat(LOCALE, {
        currency: CURRENCY,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: "compact"
    });
    const percentFormat = new Intl.NumberFormat(LOCALE, {
        maximumFractionDigits: 2,
        style: "percent"
    });
    const prices = data.map(price => price.value);
    while (prices.length < 2) {
        // force a minimum of two values
        prices.unshift(0);
    }
    const lastTwo = prices.slice(-2);
    const difference = lastTwo.reduce((a, b) => b - a);
    const ratio = lastTwo.reduce((a, b) => b / a);
    const change = ratio === Infinity ? 1 : (isNaN(ratio) ? 0 : ratio - 1);
    const isDown = difference < 0;
    // formatted values
    const changeAsSymbol = isDown ? "-" : "+";
    const changeAsWord = isDown ? "down" : "up";
    const priceAbs = currencyFormat.format(Math.abs(difference));
    const changeAbs = percentFormat.format(Math.abs(change));
    const visibleLabel = `${changeAsSymbol}${priceAbs} (${changeAsSymbol}${changeAbs})`;
    const ariaLabel = `${changeAsWord} ${priceAbs} points (${changeAbs})`;
    const mostRecentPrice = currencyFormat.format(lastTwo.slice(-1)[0]);
    useEffect(() => {
        // prevent multiple requests for the same data
        setFetching(true);
    }, []);
    useEffect(() => {
        async function fetchData() {
            try {
                // first allow the placeholder to be seen
                await new Promise((res) => setTimeout(res, 1e3));
                // then do the request
                const func = "TIME_SERIES_DAILY";
                const apiKey = "demo"; // EFPI1W0IT64YLBB4
                const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${apiKey}`;
                const response = await fetch(url);
                if (response.ok) {
                    // parameters to get from JSON
                    const seriesKey = "Time Series (Daily)";
                    const valueKey = "4. close";
                    const dayRange = 14;
                    const offset = 0;
                    // get the JSON
                    const result = await response.json();
                    const daily = result[seriesKey];
                    // use data from the last n days
                    const dates = Object.keys(daily).slice(offset, dayRange + offset);
                    const dataArray = [];
                    // build the data array
                    dates.forEach(date => {
                        dataArray.unshift({
                            date: new Date(date),
                            value: +daily[date][valueKey]
                        });
                    });
                    setData(dataArray);
                    setStatus("ok");
                }
                else {
                    setStatus("error");
                }
            }
            catch (_a) {
                setStatus("error");
            }
        }
        if (fetching)
            fetchData();
    }, [fetching]);
    const statusMap = {
        error: React.createElement(StockWidgetError, { symbol: symbol }),
        loading: React.createElement(StockWidgetPlaceholder, null),
        ok: React.createElement(React.Fragment, null,
            React.createElement(StockWidgetGraph, { data: prices }),
            React.createElement("div", { className: "widget__content" },
                React.createElement("h2", { className: "widget__symbol" }, symbol),
                React.createElement("h3", { className: "widget__name" }, name),
                React.createElement("div", { className: `widget__change ${isDown ? "widget__change--negative" : "widget__change--positive"}`, "aria-label": ariaLabel }, data.length ? React.createElement(React.Fragment, null,
                    React.createElement(Icon, { icon: changeAsWord }),
                    visibleLabel) : "-"),
                React.createElement("div", { className: "widget__price" }, data.length ? mostRecentPrice : "-")))
    };
    return (React.createElement("div", { className: "widget" }, statusMap[status]));
}
function StockWidgetError({ symbol }) {
    return (React.createElement("div", { className: "widget__content" },
        React.createElement("div", { className: "widget__error" },
            React.createElement(Icon, { icon: "warning", color: "warning", size: "large" }),
            React.createElement("p", null,
                "Couldn\u2019t get data for ",
                React.createElement("strong", null, symbol),
                ". Try again later."))));
}
function StockWidgetGraph({ data }) {
    const [animated, setAnimated] = useState(false);
    const animationRef = useRef(0);
    const lowestPrice = data.reduce((a, b) => b < a ? b : a);
    const highestPrice = data.reduce((a, b) => b > a ? b : a);
    const difference = highestPrice - lowestPrice;
    const graphWidth = 105;
    const graphHeight = 90;
    const graphPoints = data.map((n, i) => {
        const x = graphWidth * (i / (data.length - 1));
        let y = (1 - (n - lowestPrice) / difference) * graphHeight;
        if (isNaN(y)) {
            y = graphHeight;
        }
        return [+x.toFixed(2), +y.toFixed(2)];
    });
    const graphPointsDrawn = [
        [-1, graphHeight],
        ...graphPoints,
        [graphWidth + 1, graphHeight]
    ];
    const graphPointsToString = graphPointsDrawn.map(point => point.join(" ")).join(",");
    const graphClipStyle = {
        transform: `translate(${-graphWidth}px,0)`
    };
    const clipID = `line-clip-${randomHash()}`;
    useEffect(() => {
        // allow the animation to run on mount
        animationRef.current = setTimeout(() => setAnimated(true), 400);
    }, []);
    return (React.createElement("svg", { className: "widget__graph", viewBox: `0 0 ${graphWidth} ${graphHeight}`, width: `${graphWidth}px`, height: `${graphHeight}px`, "aria-hidden": "true" },
        React.createElement("defs", null,
            React.createElement("clipPath", { id: clipID },
                React.createElement("rect", { className: "widget__graph-clip", width: graphWidth, height: graphHeight, style: !animated ? graphClipStyle : {} }))),
        React.createElement("polyline", { className: "widget__graph-line", clipPath: `url(#${clipID})`, strokeWidth: "1", points: graphPointsToString })));
}
function StockWidgetPlaceholder() {
    return (React.createElement("div", { className: "widget__content" },
        React.createElement("div", { className: "widget__placeholder widget__placeholder--symbol" }),
        React.createElement("div", { className: "widget__placeholder widget__placeholder--name" }),
        React.createElement("div", { className: "widget__placeholder widget__placeholder--change" }),
        React.createElement("div", { className: "widget__placeholder widget__placeholder--price" })));
}
function randomHash() {
    const random = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
    return Math.round(0xffff * random).toString(16);
}
;