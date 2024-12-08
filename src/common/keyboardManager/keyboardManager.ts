class KeyboardManager {
	keys: Record<string, boolean> = {};

	constructor() {
		window.addEventListener("keydown", (event) => {
			this.keys[event.code] = true;
		});

		window.addEventListener("keyup", (event) => {
			this.keys[event.code] = false;
		});
	}

	isKeyPressed(keyCode: string) {
		return !!this.keys[keyCode];
	}
}

export const keyboardManager = new KeyboardManager();
