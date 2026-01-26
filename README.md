# The Real Project

<div align="center">

![The Real Project](https://img.shields.io/badge/The%20Real%20Project-DC2626?style=for-the-badge&logo=home&logoColor=white)

**Rental Property Investment Analyzer with BRRR Strategy Modeling**

*"Every number, explained."*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

[Live Demo](https://the-real-project.vercel.app) · [Report Bug](https://github.com/omairqazi29/the-real-project/issues) · [Request Feature](https://github.com/omairqazi29/the-real-project/issues)

</div>

---

## Overview

The Real Project is a comprehensive web application for analyzing rental property investments using the BRRR (Buy, Rehab, Rent, Refinance) strategy. Unlike other calculators, we prioritize **full transparency** - every calculated number shows exactly how it was derived, what inputs were used, and the confidence level of each data point.

### Key Features

- **Complete BRRR Analysis** - Model every phase of your investment: Buy, Rehab, Rent, and Refinance
- **Full Transparency** - Click any metric to see the formula, inputs, and data sources
- **10-Year Projections** - Visualize equity buildup, cash flow growth, and total returns over time
- **Visual Analytics** - Beautiful charts for equity growth, cash flow trends, and capital flow
- **Cloud Persistence** - Securely save and access your analyses from anywhere
- **Real-time Calculations** - All metrics update instantly as you adjust inputs

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Testing** | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Vercel account (optional, for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omairqazi29/the-real-project.git
   cd the-real-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   # Install Supabase CLI if you haven't
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup, forgot-password)
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── properties/    # Property management
│   │   ├── markets/       # Market analysis (coming soon)
│   │   ├── compare/       # Property comparison (coming soon)
│   │   └── settings/      # User settings (coming soon)
│   └── api/               # API routes
│
├── components/
│   ├── ui/                # Base UI components (Button, Input, Card, etc.)
│   ├── transparency/      # Data transparency system components
│   ├── charts/            # Visualization components (Recharts)
│   ├── analysis/          # BRRR analysis phase components
│   ├── properties/        # Property list and management
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── auth/              # Authentication components
│   └── shared/            # Shared utility components
│
├── lib/
│   ├── calculations/      # Financial calculation engine
│   │   ├── mortgage.ts    # Mortgage & amortization
│   │   ├── cashflow.ts    # Cash flow analysis
│   │   ├── returns.ts     # ROI, CoC, Cap Rate, IRR
│   │   ├── brrr.ts        # Complete BRRR analysis
│   │   └── projections.ts # 10-year projections
│   ├── supabase/          # Supabase client configurations
│   ├── formulas.ts        # Formula documentation
│   ├── constants.ts       # App constants and defaults
│   └── utils.ts           # Utility functions
│
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state stores
├── types/                 # TypeScript type definitions
└── test/                  # Test setup and utilities
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:ci` | Run tests with coverage (CI) |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |

## Key Metrics Calculated

The application calculates comprehensive investment metrics including:

- **Cash Flow**: Monthly and annual cash flow after all expenses
- **Cash-on-Cash Return**: Annual cash flow relative to cash invested
- **Cap Rate**: NOI as a percentage of property value
- **Total ROI**: Complete return including cash flow, appreciation, and equity
- **DSCR**: Debt Service Coverage Ratio
- **Forced Equity**: Value created through rehab
- **Cash Left in Deal**: Capital remaining after refinance
- **IRR**: Internal Rate of Return
- **Equity Buildup**: Forced, appreciation, and principal paydown

## Design System

The app uses a **red/dark** theme with full dark mode support:

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Primary | `#DC2626` | Primary actions, accents |
| Background | `#0A0A0A` | Page background |
| Surface | `#171717` | Card backgrounds |
| Surface Elevated | `#262626` | Elevated components |

### Confidence Indicators

Data transparency uses color-coded confidence levels:

- 🟢 **High** (`#22C55E`): All inputs are user-provided or verified
- 🟡 **Medium** (`#EAB308`): Mix of user input and estimates
- 🔴 **Low** (`#EF4444`): Mostly assumptions or estimates

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup (Next.js, Tailwind, Supabase)
- [x] Design system (colors, typography, components)
- [x] Authentication (login, signup, logout)
- [x] Database schema and types
- [x] Basic layout (sidebar, header)
- [x] Landing page

### Phase 2: Core Analysis (In Progress)
- [x] Calculation engine (mortgage, cashflow, returns, BRRR)
- [x] Data transparency components
- [ ] Property form (all inputs)
- [ ] Deal summary card
- [ ] Save to database

### Phase 3: Visualizations
- [x] Chart components (equity, cashflow, waterfall)
- [ ] 10-year projections table
- [ ] Properties list view integration
- [ ] Interactive sensitivity analysis

### Phase 4: Polish
- [ ] Comparables management (ARV, rent)
- [ ] Scenario comparison
- [ ] PDF export
- [ ] Settings page (defaults)

### Phase 5: Enhancements
- [ ] Market scorecard
- [ ] Multi-property comparison
- [ ] Sensitivity sliders
- [ ] Pipeline/kanban view
- [ ] Mobile optimization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:ci

# Run with UI
npm run test:ui
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run headed (see browser)
npm run test:e2e:headed
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for BRRR investors who demand transparency
- Inspired by the need for better real estate analysis tools
- Thanks to all contributors and testers

---

<div align="center">

**[The Real Project](https://the-real-project.vercel.app)** - Every number, explained.

</div>
