# বাজার দর (BazarDor)

বাজার দর is a Bangla daily essentials price viewer. Browse today's prices for groceries, see price changes and compare prices in different markets.

## Features

- Browse all products with today's prices and percentage changes.
- See the six biggest price increases and decreases.
- Browse products by category and sort by price.
- View minimum, maximum and average market prices on product detail pages.
- Sign in with email and password or with Google/GitHub.
- Protect product details and profile pages for signed-in users.
- Update your profile name.
- Responsive layout with Bangla numbers, loading skeletons and a scrolling price ticker.

## Built with

Next.js (App Router), React, JavaScript, Tailwind CSS, DaisyUI, Better Auth, MongoDB and react-hot-toast.

Product data: [Programming Hero BazarDor API](https://openapi.programming-hero.com/api/bazardor).

## Run locally

1. Install Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and enter your own MongoDB and authentication credentials.
4. Run `npm run dev` and open `http://localhost:3000`.

The app needs an accessible MongoDB database for user accounts and sessions. Product browsing uses the public API.

## Authentication setup

Set `MONGODB_URI` to the connection string from MongoDB Atlas and keep your database password private. Set `BETTER_AUTH_SECRET` to a random string of at least 32 characters and `BETTER_AUTH_URL` to the site origin. For OAuth, add client IDs and client secrets to `.env.local` and register these callback URLs:

| Provider | Development callback |
| --- | --- |
| Google | `http://localhost:3000/api/auth/callback/google` |
| GitHub | `http://localhost:3000/api/auth/callback/github` |

When deploying, register the corresponding HTTPS callbacks using your live domain. Update your live environment variables in the deployment dashboard too. Never push `.env.local` to GitHub.

## Deployment

Deploy to Vercel and add the same environment variables in Project Settings. Set `BETTER_AUTH_URL` to your production domain without a trailing slash. After deployment, test email registration, both OAuth providers, product details, and a direct refresh on a category or product URL.

## Design

The supplied Figma reference is included unchanged under `design/`.

## Links

- GitHub: https://github.com/Sayeed-sbs/bazardor2.0
- Live site: add the final verified deployment link here.

## First run

Run `npm install` to install dependencies and generate `package-lock.json`, then run `npm run dev`.
