# Anki flashcards

## Connect Supabase

1. In your Supabase project, open **SQL Editor** and run:

   ```sql
   create table public.flashcards (
     id uuid primary key default gen_random_uuid(),
     word text not null,
     meaning text not null,
     created_at timestamptz not null default now()
   );

   alter table public.flashcards enable row level security;

   create policy "Public can read flashcards"
     on public.flashcards for select
     to anon, authenticated
     using (true);

   create policy "Public can add flashcards"
     on public.flashcards for insert
     to anon, authenticated
     with check (true);
   ```

   These policies allow anyone with the app's public key to read and insert
   cards. This is suitable only for a prototype. Before deploying, use Supabase
   Auth and restrict inserts to authenticated administrators.

2. Copy `.env.example` to `.env.local` and replace the example values with your
   Supabase project URL and publishable key. Find them in your project's API
   settings. Never put a `service_role` or secret key in a `VITE_` variable.

3. Restart the Vite development server after changing `.env.local`.

The app loads cards from `public.flashcards` when it starts and inserts a card
when the Admin form is submitted. The returned database row (including its ID)
is then shared by the Home and Admin routes.
