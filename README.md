# Motion Whiteboard
A whiteboard app that lets users draw, animate with keyframes, and export to video. Works on PC and tablets.

## Dependencies
 - bun
 - svelte
 - lucide icons

## Architecture

```mermaid
graph TD
    subgraph Routes
        Page[+page.svelte] --> Editor[Editor.svelte]
        Editor --> Canvas[Canvas.svelte]
        Editor --> Overlay[Overlay.svelte]
        Overlay --> Toolbar[Toolbar.svelte]
        Overlay --> StylePanel[StylePanel.svelte]
        Canvas --> Snippets[Snippets.svelte]
    end

    Editor -- creates --> AppState
    Canvas -- reads --> AppState
    Toolbar -- modifies --> AppState
    StylePanel -- modifies --> AppState
    
    subgraph Logic
      AppState(data.svelte.ts)
      AppState --> Camera(camera.svelte.ts)
      AppState --> Tools(tool.svelte.ts)
      AppState --> Elements(elements.ts)
      AppState --> StyleManager(StyleManager)
      AppState --> Cursor(cursors.svelte.ts)
      
      Tools --> StyleManager
    end
```

## File Structure

```
src/
├─ routes/
│  ├─ editor/
│  │  ├─ elements/
│  │  │  └─ Snippets.svelte  → Element renderers
│  │  ├─ Canvas.svelte       → Main drawing area
│  │  └─ Editor.svelte       → Main editor container
│  ├─ logic/
│  │  ├─ camera.svelte.ts    → Zoom & Pan logic
│  │  ├─ data.svelte.ts      → AppState & Entry point
│  │  ├─ elements.ts         → Element types (Point, Stroke)
│  │  ├─ tool.svelte.ts      → Tool logic (Brush, Eraser, Pan)
│  │  └─ vector.ts           → Math helpers
│  ├─ overlay/
│  │  └─ Toolbar.svelte      → Tool switching
│  └─ +page.svelte           → App Root
```


## Develop
```sh
# initialize package
bun install

# start the server
bun run dev

# To create a production version of your app:
bun run build

# to preview the production build:
bun run preview

# to deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
```