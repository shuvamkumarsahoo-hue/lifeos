# LifeOS — Premium Final

A polished React/Vite personal operating system.

## Included
- Premium Dashboard / Overview
- Premium Task Manager with edit/delete/complete
- Premium Goals with add/edit/delete/progress controls
- Premium Habits with add/edit/delete/weekly targets/check-ins
- Premium Study with editable subjects + focus timer + chart
- Premium Finance with add/edit/delete expenses
- Premium Notes with add/edit/delete
- Premium Calendar
- Dark/light mode
- Supabase authentication
- LocalStorage persistence
- Responsive UI

## Run
1. Copy `.env.example` to `.env.local`.
2. Add your Supabase URL and publishable key.
3. Run `npm install`.
4. Run `npm run dev`.

## Production build
`npm run build`

The project intentionally keeps editing controls only on modules where the user owns/manages data. Dashboard, Calendar presentation, and focus presentation remain clean instead of adding unnecessary edit controls.
