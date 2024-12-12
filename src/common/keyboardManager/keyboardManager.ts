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

  bindKey(keyCode: string, callback: () => void) {
    window.addEventListener("keydown", (event) => {
      if (event.key === keyCode) {
        callback();
      }
    });
  }
}

export const keyboardManager = new KeyboardManager();
