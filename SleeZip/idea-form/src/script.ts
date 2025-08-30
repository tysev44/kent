window.addEventListener("DOMContentLoaded",() => {
	const ideaForm = new IdeaForm("#idea");
});

class IdeaForm {
	/** Form used for this component */
	form: HTMLFormElement | null;
	/** Timeout function for submission */
	timeout = 0;

	private _idea = "";
	get idea(): string {
		return this._idea;
	}
	set idea(value: string) {
		this._idea = value;

		const submitBtn = this.form?.querySelector("[type=submit]") as HTMLButtonElement;

		if (submitBtn) {
			submitBtn.disabled = value.length === 0;
		}
	}

	private _expanded = false;
	get expanded(): boolean {
		return this._expanded;
	}
	set expanded(value: boolean) {
		this._expanded = value;
		this.form?.setAttribute("data-expanded",`${value}`);
	}

	private _state = SubmitState.Default;
	get state() {
		return this._state;
	}
	set state(value: SubmitState) {
		this._state = value;

		const textarea = this.form?.querySelector("#my-idea") as HTMLTextAreaElement;
		const submitBtn = this.form?.querySelector("[type=submit]") as HTMLButtonElement;

		if (textarea) {
			textarea.disabled = value !== SubmitState.Default;
		}
		if (submitBtn) {
			if (value === SubmitState.Sending) {
				submitBtn.textContent = Label.Sending;
				submitBtn.disabled = true;
			} else if (value === SubmitState.Done) {
				submitBtn.textContent = Label.Sent;
			} else {
				submitBtn.textContent = Label.Submit;
			}
		}
	}
	/**
	 * @param el CSS selector of the form
	 */
	constructor(el: string) {
		this.form = document.querySelector(el);
		this.form?.addEventListener("click",this.toggle.bind(this));
		this.form?.addEventListener("input",this.ideaUpdate.bind(this));
		this.form?.addEventListener("submit",this.ideaSubmit.bind(this));
		document.addEventListener("click",this.outsideToCollapse.bind(this));
		document.addEventListener("keydown",this.escToCollapse.bind(this));
	}
	/**
	 * Click outside the form to collapse.
	 * @param e Click event
	 * */
	outsideToCollapse(e: Event): void {
		if (this.state !== SubmitState.Default) return;

		let parent: HTMLElement | null = e.target as HTMLElement;

		while (parent !== null) {
			if (parent === this.form) {
				return;
			}
			parent = parent.parentElement;
		}
		this.expanded = false;
	}
	/**
	 * Hide the form by pressing Esc.
	 * @param e Keyboard event
	 * */
	escToCollapse(e: KeyboardEvent): void {
		if (e.code === "Escape" && this.state === SubmitState.Default) {
			this.expanded = false;
		}
	}
	/**
	 * Show or hide the form.
	 * @param e Click event
	 * */
	toggle(e: Event): void {
		const button = e.target as HTMLButtonElement;

		if (button.hasAttribute("data-toggle")) {
			this.expanded = !this.expanded;

			if (this.expanded) {
				const textarea = this.form?.querySelector("#my-idea") as HTMLTextAreaElement;
				textarea?.focus();
			}
		}
	}
	/**
	 * Submit the idea content.
	 * @param e Submit event
	 * */
	async ideaSubmit(e: SubmitEvent): Promise<void> {
		e.preventDefault();

		if (this.state !== SubmitState.Default) return;

		const delaySending = 1000;
		const delayDone = 600;
		const delayReset = 300;

		this.state = SubmitState.Sending;

		return await new Promise<void>(resolve => {
			// send
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				resolve();
			},delaySending);
		}).then(async () => {
			// submitted
			this.state = SubmitState.Done;

			return await new Promise<void>(resolve => {
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					resolve();
				},delayDone);
			});
		}).then(() => {
			// collapse and reset
			this.expanded = false;

			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.form?.reset();
				this.idea = "";
				this.state = SubmitState.Default;
			},delayReset);
		});
	}
	/**
	 * Update the idea content internally.
	 * @param e Input event
	 * */
	ideaUpdate(e: Event): void {
		const textarea = e.target as HTMLTextAreaElement;
		this.idea = textarea.value;
	}
}
const enum Label {
	Sending = "Sending…",
	Sent = "Sent",
	Submit = "Submit"
}
const enum SubmitState {
	Default = 0,
	Sending,
	Done
}