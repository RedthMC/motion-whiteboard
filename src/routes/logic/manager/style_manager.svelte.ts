export class StyleManager {
    readonly colors = [
        "#000000", "#9ca3af", "#e879f9", "#a855f7",
        "#3b82f6", "#0ea5e9", "#f59e0b", "#f97316",
        "#098d44", "#22c55e", "#f08193", "#ef4444",
    ];

    color = $state(this.colors[0]);
    size = $state(3);
}
