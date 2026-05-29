# EnglishFlow

EnglishFlow is a local-first React dashboard for tracking Isaac's daily English routine. It stores study sessions, vocabulary, goals, settings, charts and reports in the browser with LocalStorage. No backend, Firebase, Supabase or external database is required.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- LocalStorage
- Basic PWA with manifest and service worker

## Features

- Dashboard with daily progress, streaks, weekly trend, skill progress and CEFR journey
- Create, edit and delete daily study sessions
- Track listening, speaking, reading, writing, grammar and vocabulary minutes
- Track focus, pronunciation, grammar accuracy, mood and notes
- Vocabulary manager with search, status filters and mastery tracking
- Goal manager with progress bars and statuses
- Reports with automatic insights and recommendations
- Calendar intensity view for studied and missed days
- Dark mode
- Export and import JSON data
- Demo data for the last 30 days when no data exists
- Installable PWA on mobile

## Project Structure

```txt
src/
  components/
    layout/
      Sidebar.tsx
      Topbar.tsx
      MobileNav.tsx
    dashboard/
      StatCard.tsx
      TodayProgress.tsx
      SkillChart.tsx
      WeeklyTrendChart.tsx
      CEFRJourney.tsx
      RecommendationCard.tsx
    forms/
      StudySessionForm.tsx
      GoalForm.tsx
      VocabularyForm.tsx
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Select.tsx
      Modal.tsx
      Badge.tsx
  pages/
    Dashboard.tsx
    Routine.tsx
    Skills.tsx
    Vocabulary.tsx
    Goals.tsx
    Reports.tsx
    Calendar.tsx
    Settings.tsx
  hooks/
    useLocalStorage.ts
    useStudyData.ts
  utils/
    calculations.ts
    dateHelpers.ts
    recommendations.ts
    demoData.ts
  types/
    index.ts
  App.tsx
  main.tsx
  index.css
```

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```txt
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Push this project to the repository.
3. Build the app:

```bash
npm run build
```

4. Deploy the `dist/` folder with your preferred GitHub Pages workflow.

Example using `gh-pages`:

```bash
npm install --save-dev gh-pages
```

Add these scripts to `package.json`:

```json
{
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Then run:

```bash
npm run deploy
```

If your repository is served from a subpath like `/englishflow/`, set `base: '/englishflow/'` in `vite.config.ts` before building.

## Install as PWA

### iPhone or iPad

1. Open the deployed app in Safari.
2. Tap the Share button.
3. Tap **Add to Home Screen**.
4. Confirm the name **EnglishFlow**.

### Android

1. Open the deployed app in Chrome.
2. Tap the three-dot menu.
3. Tap **Install app** or **Add to Home screen**.
4. Confirm installation.

## Data

EnglishFlow uses `localStorage` under the key `englishflow-data-v1`. Use **Settings > Export JSON** before clearing browser data or moving to another device.
