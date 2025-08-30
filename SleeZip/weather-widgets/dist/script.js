"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const widget1 = new WeatherWidget("#widget1", {
        city: "Harrisburg",
        kind: "sunny",
        time: new Date(2024, 5, 21, 11, 15),
        temperature: 88,
        temperature_scale: "F",
        wind: 5,
        wind_unit: "mph",
        visibility: 22,
        visibility_unit: "mi",
        air_quality: 54,
        humidity: 59
    });
    const widget2 = new WeatherWidget("#widget2", {
        city: "Seattle",
        kind: "cloudy",
        time: new Date(2024, 5, 21, 8, 15),
        temperature: 70,
        temperature_scale: "F",
        wind: 6,
        wind_unit: "mph",
        visibility: 23,
        visibility_unit: "mi",
        air_quality: 41,
        humidity: 47
    });
});
class WeatherWidget {
    /**
     * @param el CSS selector the widget
     * @param data Weather data
     */
    constructor(el, data) {
        var _a, _b, _c;
        /** Element is collapsing */
        this.isCollapsing = false;
        /** Element is expanding */
        this.isExpanding = false;
        /** Animation duration and easing */
        this.animParams = {
            duration: 400,
            easing: "cubic-bezier(0.33,1,0.67,1)"
        };
        /** Actions to run after expanding the item. */
        this.animActionsExpand = {
            onfinish: this.onAnimationFinish.bind(this, true),
            oncancel: () => { this.isExpanding = false; }
        };
        /** Actions to run after collapsing the item. */
        this.animActionsCollapse = {
            onfinish: this.onAnimationFinish.bind(this, false),
            oncancel: () => { this.isCollapsing = false; }
        };
        /** This widget is expanded to show weather details. */
        this.detailsOpen = true;
        /** Language used for time formatting */
        this.lang = "en-US";
        this.el = document.querySelector(el);
        this.weather = data;
        this.displayWeather();
        this.summary = (_a = this.el) === null || _a === void 0 ? void 0 : _a.querySelector("summary");
        (_b = this.summary) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.toggle.bind(this));
        this.content = (_c = this.summary) === null || _c === void 0 ? void 0 : _c.nextElementSibling;
    }
    /** Display the weather data in the UI. */
    displayWeather() {
        if (!this.weather)
            return;
        const weatherProps = Object.keys(this.weather).filter(key => key.indexOf("_unit") < 0);
        weatherProps.forEach(prop => {
            var _a, _b, _c;
            const propEl = (_a = this.el) === null || _a === void 0 ? void 0 : _a.querySelector(`[data-stat=${prop}]`);
            if (!propEl)
                return;
            let value = (_b = this.weather) === null || _b === void 0 ? void 0 : _b[prop];
            let unit = "";
            if (prop == "kind") {
                // SVG symbol for the kind of weather
                const kindSymbol = (_c = this.el) === null || _c === void 0 ? void 0 : _c.querySelector("[data-symbol]");
                kindSymbol === null || kindSymbol === void 0 ? void 0 : kindSymbol.setAttribute("href", `#${value}`);
            }
            else if (prop === "time") {
                // `datetime` attribute
                const valueAsDate = value;
                const hourRaw = valueAsDate.getHours();
                let hour = hourRaw < 10 ? `0${hourRaw}` : `${hourRaw}`;
                const minute = `${valueAsDate.getMinutes()}`;
                propEl.setAttribute("datetime", `${hour}:${minute}`);
                // display the hour and minute
                const format = new Intl.DateTimeFormat(this.lang, {
                    hour: "numeric",
                    minute: "2-digit",
                });
                value = format.format(value);
            }
            else if (prop === "wind") {
                unit = "mph";
            }
            else if (prop === "visibility") {
                unit = "mi";
            }
            if (unit !== "") {
                // attach the unit if applicable
                value += ` ${unit}`;
            }
            propEl.innerText = `${value}`;
        });
    }
    /**
     * Open or close the widget.
     * @param e Click event whose default behavior should be prevented
     */
    toggle(e) {
        var _a, _b, _c;
        e === null || e === void 0 ? void 0 : e.preventDefault();
        (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.remove("collapsing", "expanding");
        if (this.isCollapsing || !((_b = this.el) === null || _b === void 0 ? void 0 : _b.open)) {
            this.open();
        }
        else if (this.isExpanding || ((_c = this.el) === null || _c === void 0 ? void 0 : _c.open)) {
            this.collapse();
        }
    }
    /** Open the item and run the animation for expanding. */
    open() {
        if (this.el) {
            this.el.style.height = `${this.el.offsetHeight}px`;
            this.el.open = true;
            this.expand();
        }
    }
    /** Expansion animation */
    expand() {
        var _a, _b, _c, _d, _e, _f;
        (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.add("expanding");
        this.isExpanding = true;
        const startHeight = ((_b = this.el) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0;
        const summaryHeight = ((_c = this.summary) === null || _c === void 0 ? void 0 : _c.offsetHeight) || 0;
        const contentHeight = ((_d = this.content) === null || _d === void 0 ? void 0 : _d.offsetHeight) || 0;
        const endHeight = summaryHeight + contentHeight;
        (_e = this.animation) === null || _e === void 0 ? void 0 : _e.cancel();
        this.animation = (_f = this.el) === null || _f === void 0 ? void 0 : _f.animate({ height: [`${startHeight}px`, `${endHeight}px`] }, this.animParams);
        if (this.animation) {
            this.animation.onfinish = this.animActionsExpand.onfinish;
            this.animation.oncancel = this.animActionsExpand.oncancel;
        }
    }
    /** Close the item and run the animation for collapsing. */
    collapse() {
        var _a, _b, _c, _d, _e;
        (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.add("collapsing");
        this.isCollapsing = true;
        const startHeight = ((_b = this.el) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0;
        const endHeight = ((_c = this.summary) === null || _c === void 0 ? void 0 : _c.offsetHeight) || 0;
        (_d = this.animation) === null || _d === void 0 ? void 0 : _d.cancel();
        this.animation = (_e = this.el) === null || _e === void 0 ? void 0 : _e.animate({ height: [`${startHeight}px`, `${endHeight}px`] }, this.animParams);
        if (this.animation) {
            this.animation.onfinish = this.animActionsCollapse.onfinish;
            this.animation.oncancel = this.animActionsCollapse.oncancel;
        }
    }
    /** Actions to run when the animation is finished */
    onAnimationFinish(open) {
        if (this.el) {
            this.el.open = open;
            if (this.animation) {
                this.animation = null;
            }
            this.isCollapsing = false;
            this.isExpanding = false;
            this.el.style.height = "";
            this.el.classList.remove("collapsing", "expanding");
        }
    }
}