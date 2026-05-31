# DevSnippets 📋

A developer-focused mobile app to save, organize, and manage code snippets entirely on-device — no internet required.

---

## Tech Stack

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)

---

## Features

### Snippet Management
- Create, edit, and delete snippets
- Search snippets by title, language, or tags
- Mark snippets as favorites
- Each snippet stores: title, code, programming language, and tags

### Offline-First
- All data lives in a local SQLite database
- Full CRUD and search work completely without an internet connection

### Export & Share
- Export snippets as `.txt`, `.js`, or `.json`
- Share snippets with other apps via the native share sheet
- Save exported files locally

---

## Screens

| Screen | Description |
|---|---|
| **Home** | Browse and search all snippets |
| **Create / Edit Snippet** | Add or update a snippet |
| **Snippet Detail** | View code, tags, and attached files |
| **Favorites** | Quickly access starred snippets |
| **File Manager** | Browse and manage local files |
| **Settings** | Basic app preferences |

---

## Storage

| Technology | Purpose |
|---|---|
| Expo SQLite | Snippet database (titles, code, language, tags, favorites) |
| Expo FileSystem | File management, attachments, and exports |

---

## Project Structure

```
devsnippets/
├── src/
│   ├── app/                        # Screens (Expo Router)
│   │   ├── (tabs)/                 # Tab navigator group
│   │   │   ├── _layout.tsx         # Tab layout config
│   │   │   ├── index.tsx           # Home
│   │   │   ├── favorites.tsx       # Favorites
│   │   │   └── settings.tsx        # Settings
│   │   ├── snippet/
│   │   │   └── [id].tsx            # Snippet Detail
│   │   ├── _layout.tsx             # Root layout
│   │   ├── createEdit.tsx          # Create / Edit Snippet
│   │   └── files.tsx               # File Manager
│   ├── components/
│   │   ├── CodeEditor.tsx
│   │   ├── Greetings.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SnippetBrowser.tsx
│   │   ├── SnippetCard.tsx
│   │   ├── SnippetForm.tsx
│   │   └── SnippetPreview.tsx
│   ├── db/
│   │   └── database.ts             # SQLite setup and queries
│   ├── hooks/
│   │   └── theme.tsx               # Theme hook
│   └── utils/
│       ├── export.ts               # Export helpers
│       ├── syntaxHighlighter.tsx   # Syntax highlighting
│       └── userStorage.ts          # Local storage helpers
├── assets/                         # Static assets
├── .claude/
├── .vscode/
├── AGENTS.md
├── CLAUDE.md
├── app.json
├── tsconfig.json
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

---

## License

MIT