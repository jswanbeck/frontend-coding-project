## Frontend Take-Home Project: AI Research Assistant

Build a small React + TypeScript app that lets a user ask a question and receive a streamed assistant response.

### Requirements

Your app should include:

* a text input for the user’s question
* a conversation view
* a way to display streamed assistant output progressively
* basic loading and error states

### Constraints

* use React and TypeScript - styling and frameworks
* timebox your work to about 1–2 hours
* you may use real APIs, mocked responses, or a local simulation
* some requirements are intentionally ambiguous; make reasonable product decisions

### Deliverables

* runnable source code
* a short README explaining:

  * how to run the app
  * assumptions you made
  * tools you used
  * what you’d improve with more time

### Optional bonuses

* support cancel/retry during streaming
* visualize tool calls, agent steps
* use an MCP-style tool interface
* render citations or structured outputs
* persist conversation state
* responsive/mobile-friendly design

### What we’re evaluating

* React and TypeScript fundamentals
* async and streaming UI patterns
* code quality and organization
* product judgment under ambiguity
* ability to work with newer AI-oriented interaction patterns

### Here's a sample event type to get you started

```ts
type StreamEvent =
  | { type: "status"; message: string }
  | { type: "text"; content: string }
  | { type: "tool_start"; tool: string }
  | { type: "tool_result"; tool: string; result: string }
  | { type: "citation"; title: string; url: string }
  | { type: "done" }
  | { type: "error"; message: string };
```

## Repo info

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It's intentionally bare bones to give you the flexibility to choose your own tools. Please fork the repo and send us a link to the fork when you're done.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
