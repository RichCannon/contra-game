export type KeyListener = (
  e: KeyboardEvent,
  state: Map<string, boolean>
) => void;

export class Keyboard {
  public static readonly state: Map<string, boolean> = new Map();
  public static init() {
    document.addEventListener("keydown", Keyboard.keyDown);
    document.addEventListener("keyup", Keyboard.keyUp);
  }
  private static keyUpListeners: Map<string, KeyListener> = new Map();
  private static keyDownListeners: Map<string, KeyListener> = new Map();

  private static keyUp(e: KeyboardEvent): void {
    Keyboard.state.set(e.code, false);
    Keyboard.keyUpListeners.forEach((listener) => listener(e, Keyboard.state));
  }
  private static keyDown(e: KeyboardEvent): void {
    Keyboard.state.set(e.code, true);
    Keyboard.keyDownListeners.forEach((listener) =>
      listener(e, Keyboard.state)
    );
  }

  public static addKeyUpListener(name: string, listener: KeyListener) {
    Keyboard.keyUpListeners.set(name, listener);
  }
  public static addKeyDownListener(name: string, listener: KeyListener) {
    Keyboard.keyDownListeners.set(name, listener);
  }
  public static removeKeyUpListener(name: string) {
    Keyboard.keyUpListeners.delete(name);
  }
  public static removeKeyDownListener(name: string) {
    Keyboard.keyDownListeners.delete(name);
  }

  public static destroy() {
    document.removeEventListener("keydown", Keyboard.keyDown);
    document.removeEventListener("keyup", Keyboard.keyUp);
  }
}
