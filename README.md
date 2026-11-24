# GPT-3 Calendar Manager

Type a future event in plain language, like "Go to the gym at 6pm on Monday",
and GPT-3 turns it into a structured calendar entry: task, time, date, location,
and three tips for getting it done.

Built in December 2022, one week after ChatGPT launched.

## How it works
- A Next.js API route makes two GPT-3 calls:
  1. One builds the structured event from the user's text.
  2. A second, low-temperature call works out the exact date (`dd-mm-yyyy`),
     using today's date to resolve phrases like "next Monday".
- The date is validated in code before it is merged into the event. If it is
  not valid, the field falls back to `N/A`.

## Stack
Next.js 13 · React 18 · OpenAI Node SDK · `text-davinci-003` · Vercel

## Status
No longer runs: OpenAI retired `text-davinci-003` on January 4, 2024.
