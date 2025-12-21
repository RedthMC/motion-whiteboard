# Motion Whiteboard
A whiteboard app that lets users draw, animate with keyframes, and export to video. Works on PC and tablets.

# Hierarchy

https://app.todoist.com/app/project/motion-whiteboard-6fXXg66X9QFrhm4J

```
+page
└─ Editor
   ├─ Canvas
   │  └─ Snippets # stroke()
   └─ Toolbars
```

Re=tooling
| Tool   | Up       | Press  | Down       | Release |
| ------ | -----    | ---    | ---------- | ------- |
| Select | Sel/Type | Select | Move/Frame | Framed  |
| Pen    |          | Draw   | Draw       | Drawn   |
| Eraser |          | Erase  | Erase      | Erased  |

| Tool Button | action |
| ----------- | -----  | 
| Textv2      | Open input like in canvas u click on the button and the text pop out in the midlle 
| Image       | Open folder like textv2



TOoling
| Icon | Tool   | Left  | Mid | Right |
| ---- | ------ | ----- | --- | ----- |
| ✏️  | Brush  | Draw  | Pan | Erase |
| 🗑️  | Eraser | Erase | Pan | Area  |
| T    | Text   | Type  | Pan | ...   |



```
src/
├─ components/
│  ├─ Canvas.svelte   → handles drawing + erasing
│  ├─ Timeline.svelte → keyframe editor
│  └─ Toolbar.svelte  → drawing tools (pen, eraser, text)
├─ lib/
│  ├─ store.ts        → Svelte stores for project + elements
│  └─ utils.ts        → geometry helpers (distance, intersection)
```


```
On Click -> Editor.ts # onPointerDown
On Drag -> Editor.ts # onPointerMove
on Release -> Editor.ts # onPointerUp

```

## TODO:
 - erasing
 - eraser trail 殘影 like in osu
 - saving
 - toolbar
 - text
 - img
 - undo/redo
 

## sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).




## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
