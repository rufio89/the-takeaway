# The Takeaway - Podcast Digest Platform

A React web application that transforms long-form podcast conversations into curated Digests of high-signal ideas, each compressed, interpreted, and scored for sense-making clarity.

## Features

- **Curated Digests**: Browse collections of podcast insights organized by publication date
- **High-Signal Ideas**: Each idea includes:
  - Clear title and summary
  - Actionable takeaways
  - Clarity score (1-10) for ease of understanding
  - Source podcast and category tags
  - Timestamp references
- **Admin Interface**: Easy-to-use forms for creating digests and adding ideas
- **Responsive Design**: Beautiful, modern UI built with TailwindCSS
- **Real-time Data**: Powered by Supabase for instant updates

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: React Router v7
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React hooks + Context API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up here](https://supabase.com))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `SUPABASE_SETUP.md` in your Supabase SQL Editor
   - Copy your project URL and anon key

3. Configure environment variables:
   - Update `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to [http://localhost:5176](http://localhost:5176)

## Usage

### Viewing Digests

- Visit the homepage to see all published digests
- Click on any digest to view its full collection of ideas
- Each idea shows its clarity score, category, and actionable takeaways

### Adding Content (Admin)

1. Click "Admin" in the top navigation
2. **Create a Digest**:
   - Enter title and description
   - Set publication date
   - Mark as featured (optional)
3. **Add Ideas**:
   - Select the digest
   - Choose podcast and category
   - Write title, summary, and actionable takeaway
   - Rate clarity (1-10)
   - Add timestamp reference (optional)

## Database Schema

The application uses four main tables:

- `digests` - Curated collections of ideas
- `ideas` - Individual podcast insights with clarity scores
- `podcasts` - Podcast metadata
- `categories` - Topic categorization

See `SUPABASE_SETUP.md` for the complete schema.

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── CreateDigestForm.tsx
│   │   └── CreateIdeaForm.tsx
│   ├── DigestCard.tsx
│   ├── IdeaCard.tsx
│   └── Layout.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── DigestDetailPage.tsx
│   └── AdminPage.tsx
├── lib/
│   └── supabase.ts
├── types/
│   └── database.ts
└── App.tsx
```

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Future Enhancements

- User authentication for admin access
- Search and filter functionality
- Email newsletter integration
- RSS feed support
- Social sharing features
- AI-powered summarization
- Podcast player integration

## License

MIT
