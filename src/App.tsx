import { useEffect, useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";
import type { Flashcard, NewFlashcard } from "./Admin";
import Login from "./login";
import { getSupabaseClient } from "./lib/supabase";

export type AppOutletContext = {
  flashcards: Flashcard[];
  isLoading: boolean;
  loadError: string | null;
  onAdd: (flashcard: NewFlashcard) => Promise<void>;
};

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFlashcards() {
      try {
        const { data, error } = await getSupabaseClient()
          .from("flashcards")
          .select("id, word, meaning, country")
          .order("created_at", { ascending: true })
          .returns<Flashcard[]>();

        if (error) throw error;
        if (!data) throw new Error("Supabase returned no flashcard data.");

        if (isMounted) {
          setFlashcards(data);
          setLoadError(null);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load flashcards.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadFlashcards();

    return () => {
      isMounted = false;
    };
  }, []);

  async function addFlashcard(flashcard: NewFlashcard) {
    const { data, error } = await getSupabaseClient()
      .from("flashcards")
      .insert(flashcard)
      .select("id, word, meaning, country")
      .single()
      .returns<Flashcard>();

    if (error) throw error;
    if (!data) throw new Error("Supabase returned no saved flashcard.");

    setFlashcards((cards) => [...cards, data]);
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Outlet
      context={{ flashcards, isLoading, loadError, onAdd: addFlashcard }}
    />
  );
}

export function Home() {
  const { flashcards, isLoading, loadError } =
    useOutletContext<AppOutletContext>();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [flippedCard, setFlippedCard] = useState<Set<string>>(() => new Set());
  const countries = [...new Set(flashcards.map((flashcard) => flashcard.country))]
    .filter(Boolean)
    .sort();
  const visibleFlashcards = selectedCountry
    ? flashcards.filter((flashcard) => flashcard.country === selectedCountry)
    : flashcards;

  return (
    <main>
      <h1>Anki Flashcards</h1>
      <Link to="/admin">Admin</Link>
      {loadError && <p role="alert">Could not load flashcards: {loadError}</p>}
      <label>
        Filter by country
        <select
          value={selectedCountry}
          onChange={(event) => setSelectedCountry(event.target.value)}
        >
          <option value="">All countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>
      <section className="flashcard-container" aria-label="Flashcards">
        {isLoading ? (
          <p>Loading flashcards...</p>
        ) : visibleFlashcards.length === 0 ? (
          <p>
            {selectedCountry
              ? `No flashcards found for ${selectedCountry}.`
              : "No flashcards have been added yet."}
          </p>
        ) : (
          visibleFlashcards.map((flashcard) => (
            <button
              key={flashcard.id}
              className="flashcard"
              type="button"
              aria-pressed={flippedCard.has(flashcard.id)}
              onClick={() =>
                setFlippedCard((current) => {
                  const next = new Set(current);
                  if (next.has(flashcard.id)) {
                    next.delete(flashcard.id);
                  } else {
                    next.add(flashcard.id);
                  }
                  return next;
                })
              }
            >
              {flippedCard.has(flashcard.id)
                ? flashcard.meaning
                : flashcard.word}
            </button>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
