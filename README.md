# Supabase Codegen

## Dev

First clone and run the Supabase [postgres-meta](https://github.com/supabase/postgres-meta) project locally `npm i & npm run dev`

The `supabase-codegen` package can be run in two different ways:
- `npm run dev` will generate the code in the root directory (useful for testing)
- `npm run build`, `cd` into the `demo/demo-next` directory, `npm i` and then `npm run generate` to see how the NPM package works in a Next.js project

## TODO

- [ ] Generate types from Swagger
- [ ] Bundle properly
- [ ] Push to NPM
- [ ] Views