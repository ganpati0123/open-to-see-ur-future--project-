# Replit project notes

- Start the app with `npm run dev`. The Vite preview runs on port `5000`.
- Build a production bundle with `npm run build`; run the TypeScript check with `npm run lint`.
- Product photos are served from `public/products/`.
- Shop collections have direct URLs in the form `/shop/<category-id>`.
- The catalog and cart are currently client-side; checkout is a demo flow and does not process payments.
- `.env.example` documents a Gemini key for API calls; the current source does not read it.
