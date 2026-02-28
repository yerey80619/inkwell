# Inkwell — AI-Powered Document Editor

A clean, minimal document editor with AI writing assistance and knowledge context. Built with Next.js, Convex, Tiptap, and OpenAI.

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account (free)
- An [OpenAI](https://platform.openai.com) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex

Start the Convex development server. This will prompt you to log in with GitHub, create a project, and configure your deployment:

```bash
npx convex dev
```

This will:
- Create your Convex project and deployment
- Generate the `convex/_generated/` types
- Save your deployment URL to `.env.local`
- Start syncing your backend functions

### 3. Initialize Convex Auth

Run the auth setup command:

```bash
npx @convex-dev/auth
```

Then generate the JWT keys for authentication:

```bash
node -e "
const { exportJWK, exportPKCS8, generateKeyPair } = require('jose');
(async () => {
  const keys = await generateKeyPair('RS256', { extractable: true });
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  const jwks = JSON.stringify({ keys: [{ use: 'sig', ...publicKey }] });
  console.log('JWT_PRIVATE_KEY=\"' + privateKey.trimEnd().replace(/\n/g, ' ') + '\"');
  console.log('JWKS=' + jwks);
})();
"
```

Copy the output and add both `JWT_PRIVATE_KEY` and `JWKS` as environment variables in your [Convex Dashboard](https://dashboard.convex.dev) under Deployment Settings > Environment Variables.

### 4. Configure OpenAI

Add your OpenAI API key to the Convex environment:

```bash
npx convex env set OPENAI_API_KEY sk-your-key-here
```

### 5. Start the development server

In a separate terminal (keep `npx convex dev` running):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── auth/page.tsx        # Login / Signup
│   ├── dashboard/page.tsx   # Document list
│   └── document/[id]/       # Document editor
├── components/              # React components
│   ├── landing/             # Landing page components
│   ├── auth/                # Auth form
│   ├── dashboard/           # Document cards, new doc button
│   └── editor/              # Tiptap editor, knowledge panel, AI chat
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema
│   ├── auth.ts              # Auth configuration
│   ├── documents.ts         # Document CRUD
│   ├── knowledge.ts         # Knowledge CRUD
│   ├── chat.ts              # Chat messages
│   ├── ai.ts                # OpenAI integration
│   └── aiHelpers.ts         # Internal queries for AI
└── lib/                     # Shared utilities
```

## Features

- **Rich text editing** with Tiptap (bold, italic, underline, headings, lists, quotes, code)
- **Knowledge context** — add plain text reference materials per document
- **AI writing assistant** — chat with GPT-4o that understands your document and knowledge
- **Auto-save** — documents save automatically as you type
- **Real-time updates** — powered by Convex's reactive queries
- **Email/password authentication** via Convex Auth
