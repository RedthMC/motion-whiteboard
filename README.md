# Motion Whiteboard
A whiteboard app that lets users draw, animate with keyframes, and export to video. Works on PC and tablets.

## Dependencies
 - bun
 - svelte
 - lucide icons

## Architecture

```mermaid
graph TD
    subgraph UI
        Page[+page.svelte] --> Editor[Editor.svelte]
        Editor --> Canvas[Canvas.svelte]
        Editor --> Overlay[Overlay.svelte]
        Overlay --> Toolbar[Toolbar.svelte]
        Overlay --> StylePanel[StylePanel.svelte]
    end

    Canvas -- "renders (polymorphically)" --> ElementComponents[Element Components]
    
    subgraph Logic
      AppState(app.svelte.ts)
      AppState --> Camera(Camera)
      AppState --> ElementManager(ElementManager)
      AppState --> StyleManager(StyleManager)
      
      AppState -- creates --> Tools(Pan, Brush, Eraser, Select)
      AppState -- creates --> Toolbox(Toolbox)
      
      ElementManager -- holds --> Elements[StrokeElement, TextElement]
      Elements -- define --> ElementComponents
      
      Tools --> Camera
      Tools --> ElementManager
      Tools --> StyleManager
      
      Toolbox -- manages --> Tools
    end
```

## File Structure

```
src/
├─ routes/
│  ├─ ui/                      → UI Components (Svelte)
│  │  ├─ Canvas.svelte         → Main drawing area
│  │  ├─ Editor.svelte         → Layout container
│  │  ├─ Overlay.svelte        → UI Layer container
│  │  ├─ StylePanel.svelte     → Style pickers
│  │  └─ Toolbar.svelte        → Tool switcher
│  ├─ logic/                   → Core Logic
│  │  ├─ element/              → Polymorphic Elements
│  │  │  ├─ stroke/            → Stroke Element & View
│  │  │  ├─ text/              → Text Element & View
│  │  │  └─ elements.svelte.ts → Provider implementation
│  │  ├─ interface/            → Shared contracts
│  │  │  └─ interface.ts       → Element & Provider interfaces
│  │  ├─ manager/              → System managers
│  │  │  ├─ camera.svelte.ts   
│  │  │  ├─ cursors.svelte.ts  
│  │  │  ├─ style_manager.svelte.ts
│  │  │  └─ toolbox.svelte.ts  
│  │  ├─ tool/                → Canvas Tools
│  │  │  ├─ brush.svelte.ts
│  │  │  ├─ eraser.svelte.ts
│  │  │  ├─ pan.svelte.ts
│  │  │  ├─ select.svelte.ts
│  │  │  └─ tools.svelte.ts    → Base types & exports
│  │  ├─ math/                 → Utilities
│  │  │  ├─ stroke.ts          
│  │  │  └─ vector.ts          
│  │  └─ app.svelte.ts         → Main entry point (AppState)
│  └─ +page.svelte             → App Root
├─ app.css                     → Global styles & variables
```

## Structural Improvements / Future Considerations

1. **Tool Lifecycle**: Add `onActivate` and `onDeactivate` to `CanvasTool` interface. This would allow tools to handle cleanup (like the `Eraser`'s interval) more cleanly.
2. **Service Locator / DI**: As `AppState` grows, consider a more formal dependency injection or service locator pattern for managers to avoid passing the whole `AppState` or long constructor lists.
3. **Element Serialization**: Now that elements are classes, adding `toJSON` and `fromJSON` methods to the `Element` interface will be crucial for persistence.
4. **Command Pattern**: Implement an undo/redo system by wrapping `ElementManager` operations in command objects.
5. **Render Layering**: While highlights are currently in a separate loop, as the number of elements grows, consider a single pass or spatial indexing (like a QuadTree) for hit-testing and occlusion culling.


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