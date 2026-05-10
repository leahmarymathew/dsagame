# Techio - Deployment Guide

## Environment Variables (Required for Vercel)

Set these environment variables in your Vercel dashboard:

```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

## Build Optimization

- **Code Splitting**: Vendor, Supabase, and animation libraries are split into separate chunks
- **Gzip Size**: ~173 KB total (down from 500 KB+)
- **Production Build**: Minified and optimized for Vercel Edge Network

## Performance Improvements

- **Auth Context**: Memoized to prevent unnecessary re-renders
- **useCallback hooks**: Callbacks wrapped to avoid recreation
- **Reusable Components**: Card, Button, and Spinner components for consistency
- **CSS Animations**: GPU-accelerated with glow effects
- **Mobile Responsive**: Improved spacing and breakpoints

## Deployment Steps

1. Connect GitHub repository to Vercel
2. Add environment variables in Project Settings
3. Deploy main branch
4. Vercel automatically runs `npm run build` and serves from `dist/`

## Features Ready

✓ Supabase Authentication (login, signup, guest)
✓ Leaderboard with real-time data
✓ Algorithm Arena with visualization
✓ Learn page with algorithm guides
✓ Compare page for algorithm performance
✓ Responsive mobile design
✓ Dark theme with neon accents
