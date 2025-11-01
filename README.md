# MGNREGA Dashboard - Andhra Pradesh

A full-stack Next.js dashboard for analyzing MGNREGA district-level data for Andhra Pradesh, built with TypeScript, Prisma ORM, and PostgreSQL.

## Features

- 📊 **Dashboard**: View summary statistics and district-wise performance
- 🌐 **Multilingual**: Supports English, Hindi (हिंदी), and Telugu (తెలుగు)
- 📱 **Mobile-Friendly**: Responsive design for all devices
- 🔊 **Voice Summary**: Text-to-speech feature for accessibility
- 📈 **Charts**: Visual representation of data using Recharts
- 🎯 **Accessible**: Designed for rural users with simple, clear language

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **UI**: Tailwind CSS
- **Charts**: Recharts
- **i18n**: next-intl

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

1. Create a PostgreSQL database (use Railway, Supabase, Neon, or any PostgreSQL provider)
2. Set your database URL in `.env`:

```env
PG_DATABASE_URL="postgresql://user:password@host:port/database"
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev
```

### 4. Import Data

Run the data fetcher script to import MGNREGA data:

```bash
node fetchData.js
```

This will fetch data from the external API and store it in your database.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mgnrega-webapp/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── page.tsx        # Home page
│   │   ├── district/
│   │   │   └── [district]/
│   │   │       └── page.tsx # District detail page
│   │   └── layout.tsx      # Locale layout
│   ├── api/                # API routes
│   │   ├── performance/
│   │   │   └── route.ts    # Performance data API
│   │   └── districts/
│   │       └── route.ts    # Districts list API
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── LanguageSwitcher.tsx
│   ├── SummaryCard.tsx
│   └── DistrictWageChart.tsx
├── lib/
│   └── prisma.ts          # Prisma client instance
├── messages/              # Translation files
│   ├── en.json
│   ├── hi.json
│   └── te.json
├── prisma/
│   └── schema.prisma     # Database schema
└── fetchData.js          # Data import script
```

## API Routes

### GET `/api/performance?year=2023-2024`

Returns performance data for all districts for a given financial year.

**Response:**
```json
{
  "data": [...],
  "summary": {
    "totalHouseholds": 1234567,
    "averageWageRate": 245.50,
    "womenParticipationPercent": 45.2,
    "totalExpenditure": 12345678900
  }
}
```

### GET `/api/performance/[district]?year=2023-2024`

Returns detailed data for a specific district.

### GET `/api/districts`

Returns list of all districts and available financial years.

## Usage

1. **Home Page** (`/en`, `/hi`, `/te`):
   - Select a financial year from the dropdown
   - View summary cards with key metrics
   - See district-wise wage comparison chart
   - Click on any district to view details

2. **District Page** (`/[locale]/district/[name]`):
   - View detailed statistics for the district
   - See monthly breakdown charts
   - Read plain language summary
   - Use voice summary feature (browser TTS)

## Internationalization

The app supports three languages:
- English (`/en`)
- Hindi (`/hi`)
- Telugu (`/te`)

Translations are stored in `/messages/[locale].json` files.

## Accessibility Features

- Large, readable fonts
- High contrast colors
- Icon + text labels for all buttons
- Voice summary using Web Speech API
- Plain language explanations
- Mobile-responsive design

## Building for Production

```bash
npm run build
npm start
```

## Database Schema

- **District**: Stores district information
- **MgnregaPerformance**: Stores monthly performance data per district

Unique constraint: `(districtId, fin_year, month)` prevents duplicate entries.

## Environment Variables

```env
PG_DATABASE_URL="postgresql://..."
```

## Notes

- Data is fetched once and stored in the database
- The app queries local database, not the external API
- Supports offline functionality when data is cached
- All monetary values are in Indian Rupees (₹)

## License

MIT
