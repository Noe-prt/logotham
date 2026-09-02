This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment

Copy `.env.example` to `.env` and provide the following:

- `DATABASE_URL` — Postgres connection string (e.g. `postgres://user:pass@localhost:5432/logotham`)
- `DATABASE_SSL` — set to `true` if your Postgres deployment requires SSL
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe API keys for billing
- `STRIPE_PRICE_SHIPPER`, `STRIPE_PRICE_STUDIO` — price IDs that map to the paid AI credit plans
- `STRIPE_PRICE_BOOST_PACK` — price ID for the one-time 1,000-credit Boost Pack
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth creds from Google Cloud for login
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — OAuth creds from GitHub for login

### Database

1. Run migrations (after configuring the env vars above):

   ```bash
   bunx drizzle-kit generate
   bunx drizzle-kit migrate
   ```

2. When developing locally, a Postgres instance running on `localhost:5432` with a database named `logotham` is assumed. Update `DATABASE_URL` if yours differs.

### Development server

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
