window.addEventListener("DOMContentLoaded",() => {
	const rockerSwitch = new RockerSwitch("#temperature-scale");
});

class RockerSwitch {
	/** Button used for this switch */
	button: HTMLButtonElement | null;

	/**
	 * @param buttonEl CSS selector of the button to use
	 */
	constructor(buttonEl: string) {
		this.button = document.querySelector(buttonEl);
		this.button?.addEventListener("click",this.temperatureScaleToggle.bind(this));
	}
	private _temperatureScale: TemperatureScale = "f";
	/** Selected temperature scale */
	get temperatureScale(): TemperatureScale {
		return this._temperatureScale;
	}
	set temperatureScale(value: TemperatureScale) {
		this._temperatureScale = value;
		this.button?.setAttribute("aria-labelledby",this._temperatureScale);
	}
	/** Set the temperature scale to °C or °F. */
	temperatureScaleToggle(): void {
		this.temperatureScale = this.temperatureScale === "c" ? "f" : "c";
	}
}
type TemperatureScale = "c" | "f";