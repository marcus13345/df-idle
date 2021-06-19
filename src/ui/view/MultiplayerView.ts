import { KeypressAcceptor, View } from "../Menu";
import { Renderable } from "../UI";

export default class MultiplayerView extends View {
	keypress: (key: { full: string; }) => void;
	render() { void 0 };
}