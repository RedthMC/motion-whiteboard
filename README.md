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
    Overlay -- reads/modifies --> AppState
    
    subgraph Logic
      AppState(app.svelte.ts)
      AppState --> Camera(Camera)
      AppState --> ElementManager(ElementManager)
      AppState --> StyleManager(StyleManager)
      
      AppState -- creates --> Tools(Pan, Brush, Eraser)
      AppState -- creates --> Toolbox(Toolbox)
      
      Tools --> Camera
      Tools --> ElementManager
      Tools --> StyleManager
      
      Toolbox -- manages --> Tools
      Toolbox -- uses --> Cursor(Cursor)
      Toolbox -- uses --> Camera
    end
```

## File Structure

```
src/
├─ routes/
│  ├─ editor/
│  │  ├─ elements/
│  │  │  └─ Snippets.svelte    → Element renderers
│  │  ├─ Canvas.svelte         → Main drawing area
│  │  └─ Editor.svelte         → Main editor container
│  ├─ logic/
│  │  ├─ component/            → State & Logic components
│  │  │  ├─ camera.svelte.ts      → Zoom & Pan logic
│  │  │  ├─ cursors.svelte.ts     → Cursor SVGs & Styles
│  │  │  ├─ elements.svelte.ts    → ElementManager & Types
│  │  │  ├─ style_manager.svelte.ts → Style management
│  │  │  └─ toolbox.svelte.ts     → Toolbox orchestration
│  │  ├─ math/
│  │  │  ├─ stroke.ts          → SVG path generation
│  │  │  └─ vector.ts          → Vector math helpers
│  │  ├─ tool/                 → Tool implementations
│  │  │  └─ tools.svelte.ts       → Pan, Brush, Eraser
│  │  └─ app.svelte.ts         → Main AppState entry point
│  ├─ overlay/
│  │  ├─ Overlay.svelte        → Overlay container (interaction layer)
│  │  ├─ StylePanel.svelte     → Color & Size picker
│  │  ├─ theme.css             → Shared CSS variables
│  │  └─ Toolbar.svelte        → Tool switching
│  └─ +page.svelte             → App Root
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