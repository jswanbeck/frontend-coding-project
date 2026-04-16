# Frontend Take-Home Project: AI Research Assistant

- [User Manual](#user-manual)
- [Setup](#setup)
- [Assumptions](#assumptions)
- [Tools used](#tools-used)
- [Next steps / waterline](#next-steps--waterline)


## User Manual

### Conversations (chat + history)

- Open the app: go to `/conversations` (or click Conversations in the top nav)
- Start a new chat: click `New Chat`
- Open an existing chat: click a conversation in the Conversation History list
- Delete a chat: click the `X` button next to a conversation
- Send a message: with a conversation open, type a prompt into the composer input box and click Send
- Retry: use the Retry action to re-run the last prompt and regenerate the assistant's answer
  - Navigate between previous responses using the arrow buttons underneath assistant's response

### Settings

- Open settings: go to `/settings` (or click Settings in the top nav)
- Chat mode:
  - Mock: uses hard-coded responses (no API key required)
  - OpenAI: streams responses from the `/api/chat` endpoint (requires `OPENAI_API_KEY` in `.env.local`)
- Locale: switch between `en`, `fr`, and a `debug` locale
  - The purpose of `debug` is to check for missed translation strings and to make sure that text overflows properly within UI elements, should be disabled in production

### Viewing persisted data in local storage (Chrome dev tools)

1. Open Chrome developer tools
2. Go to the Application tab
3. In the left sidebar, expand Storage and view Local Storage
4. Click the site origin (for dev environment this is `http://localhost:3000`)
5. Inspect keys/values:
   - `settings:chatMode` and `settings:locale`
   - `chat:index:v1` (conversation list + active chat id)
   - `chat:messages:v1:<chatId>` (messages for a specific conversation)
6. Edit / clear values as needed
   
## Setup

> A deployed version should be running at [https://jimmy-chatbot-app.vercel.app/](https://jimmy-chatbot-app.vercel.app/) if any issues occur with setup

### Install

```bash
npm install
```

### Environment variables (optional)

This project runs in mock mode by default (no API key required). To override settings, create a `.env.local` in the repo root:

```bash
# Chat backend mode: "mock" (default) or "openai"
NEXT_PUBLIC_CHAT_MODE=mock

# Required only when NEXT_PUBLIC_CHAT_MODE=openai
OPENAI_API_KEY=your_key_here

# Optional (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Other scripts

```bash
# Production build
npm run build

# Run production server (after build)
npm run start

# Lint
npm run lint
```

## Assumptions

- A mocked backend service is the default so the app runs without external dependencies 
  - Tested with OpenAI API key for proof-of-concept but not designed around being used with a real AI service
- Streaming is delivered via server endpoint SSE chunks to the client 
- Conversation history is persisted in `localStorage` and is safe to clear by the user
  - This was done for the purpose of being able to deploy to Vercel without the need to set up any sort of heavier persistence layer, but wouldn't be a realistic solution for a real production app

## Tools used

- Next.js + React + TypeScript
- Cursor / VSCode
- Vercel

## Next steps / waterline

- Debug tools for viewing / manipulating data in local storage
- Edit previously send messages / forking conversations
- Exporting conversation history
- Better formatting of user input
- Experiment with different ways of presenting Assistant chat
  - e.g. As a popup over different windows, like "what's on my screen"
  - Command line / REST service? Might require a different persistence solution though
- "Real" persistence layer, rather than local storage
- Unit / integration / e2e tests
- Improve UX / accessibility (keyboard shortcuts, aria-labels, check contrast ratios, etc.)
