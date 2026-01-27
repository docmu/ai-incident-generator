# AI Incident Update Generator

A minimal single-page web app for generating customer-facing incident communications using AI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set your Anthropic API key by creating a `.env.local` file in the project root:
```
ANTHROPIC_API_KEY=your_api_key_here
```

**Important:** I used my own Anthropic API key for this project. The `.env.local` file is gitignored and will not be committed. You'll need to create this file with your own API key to run the app.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Fill in the incident details in the left column:
   - Select severity (SEV-1, SEV-2, SEV-3)
   - Select incident status
   - Enter affected component
   - Describe customer impact
   - Add internal notes (not included in output)

2. Click "Generate Update" to create a customer-facing update

3. Edit the generated update or click "Generate Update" again to regenerate an update if needed

4. Click "Publish" to see a mock success message

## Technical Details

- Built with Next.js 14 (App Router)
- Uses Anthropic Claude API for generation
- The full AI prompt is included inline in `app/api/generate/route.ts` for easy inspection
- No authentication, persistence, or backend beyond the API routes (`/api/generate` and `/api/publish`)
