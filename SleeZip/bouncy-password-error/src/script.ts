window.addEventListener("DOMContentLoaded",() => {
	const pass = new PasswordForm("form");
});

class PasswordForm {
	/** Form used for this component */
	el: HTMLFormElement | null;
	/** Minimum password length */
	minLength = 6;

	private _invalid = false;
	get invalid() {
		return this._invalid;
	}
	set invalid(value: boolean) {
		this._invalid = value;
	}

	private _message = "";
	get message() {
		return this._message;
	}
	set message(value: string) {
		this._message = value;
	}
	/**
	 * @param el CSS selector of the form
	 */
	constructor(el: string) {
		this.el = document.querySelector(el);
		this.el?.addEventListener("submit",this.validate.bind(this));
		this.minLengthDisplay();
	}
	/** Display the minimum characters required. */
	minLengthDisplay(): void {
		const reqEl = this.el?.querySelector("[data-req]");

		if (reqEl) {
			reqEl.textContent = `${this.minLength}`;
		}
	}
	/**
	 * Check the input.
	 * @param e Submit event
	 */
	validate(e: Event): void {
		e.preventDefault();
		this.invalid = this.el?.pass.value.length < this.minLength;
		this.el?.pass.setAttribute("aria-invalid",this.invalid);

		if (this.invalid) {
			this.message = Message.TooShort;
		} else {
			this.message = "";
			this.el?.pass.blur();
		}
		
		const errorEl = this.el?.querySelector("[data-error]");

		if (errorEl) {
			errorEl.textContent = this.message;
		}
	}
}
enum Message {
	TooShort = "Too short!"
}