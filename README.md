# Anki flashcards

## Connect Supabase

1. In your Supabase project, open **SQL Editor** and run:

   ```sql
   create table public.flashcards (
     id uuid primary key default gen_random_uuid(),
     word text not null,
     meaning text not null,
     country text not null,
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

   If `flashcards` already exists without a `country` column, add it with:

   ```sql
   alter table public.flashcards
     add column if not exists country text not null default 'Malaysia';
   ```

   These policies allow anyone with the app's public key to read and insert
   cards. This is suitable only for a prototype. Before deploying, use Supabase
   Auth and restrict inserts to authenticated administrators.

2. Copy `.env.example` to `.env.local` and replace the example values with your
   Supabase project URL and publishable key, and your Geoapify API key. Find
   the Supabase values in your project's API settings and create a key in
   Geoapify. Never put a Supabase `service_role` or secret key in a `VITE_`
   variable. The Geoapify key is visible to browser users; restrict it to your
   app's allowed domains in Geoapify.

3. Restart the Vite development server after changing `.env.local`.

The app loads cards from `public.flashcards` when it starts and inserts a card
when the Admin form is submitted. The returned database row (including its ID)
is then shared by the Home and Admin routes.

On the Home page, **Choose country from map** opens the CDSDK location picker
and reverse-geocodes the selected coordinates with Geoapify. Ensure the host
app grants the CDSDK `locationServices` permission. The country lookup maps
Malaysia (`MY`), Japan (`JP`), and China (`CN`) to the app's flashcard tags;
the country dropdown remains available as a manual fallback.
