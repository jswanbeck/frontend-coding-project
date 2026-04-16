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

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser

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
- Streaming is delivered via server endpoint SSE chunks to the client 
- Conversation history is persisted in `localStorage` and is safe to clear by the user
  - This was done for the purpose of being able to deploy to Vercel without the need to set up any sort of heavier persistence layer, but wouldn't be a realistic solution for a real production app

## Tools used

- Next.js + React + TypeScript
- Cursor / VSCode
- Vercel

## Next steps / waterline

- Experiment with real / non-mocked data, OpenAI API key?
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
