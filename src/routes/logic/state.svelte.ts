
type State = { destroy(): void; }
export function stateManager<T extends State>(initialState: T): T {
    const state = $state(initialState);
    $effect(() => state.destroy());
    return state;
}


