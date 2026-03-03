# DSA Visualizer

An interactive DSA learning app with:
- Learning Hub (problem grid, filters, favorites, learning modes)
- Workspace (Monaco C++ editor, AI assistant, visualizer trace playback)

## Setup

### Prerequisites
- Node.js 18+ (recommended)

### Install

```bash
npm install
```

### Environment variables

Copy the example file and fill in any variables you use:

```bash
copy .env.example .env
```

- **Gemini**:
  - The Workspace currently supports entering a Gemini key at runtime via the UI.
  - There is also a placeholder env var `VITE_GEMINI_API_KEY` used by `src/services/geminiService.js` (not required for basic Workspace usage unless you wire it in).

### Run dev server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Notes (Security)

- If you paste API keys into the browser UI, they may be stored in the browser (e.g. localStorage). Avoid using personal/production keys in shared environments.
- For production, prefer a backend proxy so secrets never reach the client.
