import { getContext, setContext } from "svelte";
import type { AppState } from "./app.svelte";

const APP_STATE_KEY = Symbol("APP_STATE");

export function setAppState(app: AppState) {
    setContext(APP_STATE_KEY, app);
}

export function getAppState(): AppState {
    return getContext(APP_STATE_KEY) as AppState;
}
