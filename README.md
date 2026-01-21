# Motion Whiteboard
A whiteboard app that lets users draw, animate with keyframes, and export to video. Works on PC and tablets.

## Dependencies
 - bun
 - svelte
 - lucide icons

## Architecture

```mermaid
graph LR
    subgraph UI
        Page[+page.svelte] --> Editor[Editor.svelte]
        Editor --> Canvas[Canvas.svelte]
        Editor --> Overlay[Overlay.svelte]
        Overlay --> Toolbar[Toolbar.svelte]
        Overlay --> StylePanel[StylePanel.svelte]
        Canvas --> DynamicLayers[Layer Components]
    end

    subgraph Logic
      AppState(app.svelte.ts)
      AppState --> Camera(Camera)
      AppState --> ElementManager(ElementManager)
      AppState --> StyleManager(StyleManager)
      AppState --> TrailManager(TrailManager)
      AppState --> Toolbox(Toolbox)
      
      Toolbox -- "manages active" --> Mode[Mode]
      Toolbox -- "delegates to" --> Tool[Tool]
      
      Mode -- "provides" --> Tool
      Mode -- "defines" --> ModeLayer[ComponentWithData]
      Tool -- "defines" --> ToolLayer[ComponentWithData]
      
      SelectMode -.-> MoveTool
      SelectMode -.-> FrameTool
      DrawMode -.-> BrushTool
      EraseMode -.-> EraseTool
      HandMode -.-> PanTool
      
      ElementManager -- holds --> Elements[StrokeElement, TextElement]
    end
```

## Interaction State Machine

The `Toolbox` manages the current `Mode` and delegates pointer events to the active `Tool`.

```mermaid
stateDiagram-v2
    [*] --> Mode_Idle
    
    Mode_Idle --> Tool_Active : onPointerDown(button)
    note right of Tool_Active : Factory creates Tool (Primary/Secondary/Tertiary)
    
    state Tool_Active {
        [*] --> onMove
        onMove --> onMove : updates tool state
    }
    
    Tool_Active --> Mode_Idle : onPointerUp
    
    Mode_Idle --> NewMode_Idle : switchMode (re-instantiates Mode)
```

## File Structure

```
src/
├─ routes/
│  ├─ ui/                      → UI Components (Svelte)
│  │  ├─ layers/               → Overlay UI (Selection, Frames, etc)
│  │  ├─ Canvas.svelte         → Main drawing area
│  │  ├─ Editor.svelte         → Layout container
│  │  ├─ Overlay.svelte        → UI Layer container
│  │  ├─ StylePanel.svelte     → Style pickers
│  │  └─ Toolbar.svelte        → Tool switcher
│  ├─ logic/                   → Core Logic
│  │  ├─ element/              → Polymorphic Elements
│  │  │  ├─ stroke/            → Stroke Element
│  │  │  ├─ text/              → Text Element
│  │  │  └─ elements.svelte.ts → Manager implementation
│  │  ├─ interface/            → Shared contracts
│  │  ├─ manager/              → System managers
│  │  │  ├─ camera.svelte.ts   
│  │  │  ├─ cursors.svelte.ts  
│  │  │  ├─ style_manager.svelte.ts
│  │  │  ├─ trail_manager.svelte.ts
│  │  │  └─ toolbox.svelte.ts  
│  │  ├─ tool/                 → Mode & Tool System
│  │  │  ├─ mode.svelte.ts     → Base interfaces
│  │  │  ├─ drawing.svelte.ts
│  │  │  ├─ erasing.svelte.ts
│  │  │  ├─ pan.svelte.ts
│  │  │  └─ select.svelte.ts
│  │  ├─ math/                 → Utilities
│  │  ├─ context.ts            → AppState Context
│  │  └─ app.svelte.ts         → Main entry point (AppState)
│  └─ +page.svelte             → App Root
├─ app.css                     → Global styles & variables
```

## Structural Improvements / Future Considerations

1. **Service Locator / DI**: As `AppState` grows, consider a more formal dependency injection or service locator pattern for managers to avoid passing the whole `AppState` or long constructor lists.
2. **Element Serialization**: Now that elements are classes, adding `toJSON` and `fromJSON` methods to the `Element` interface will be crucial for persistence.
3. **Command Pattern**: Implement an undo/redo system by wrapping `ElementManager` operations in command objects.
4. **Render Layering**: While highlights are currently in a separate loop, as the number of elements grows, consider a single pass or spatial indexing (like a QuadTree) for hit-testing and occlusion culling.


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