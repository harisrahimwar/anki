import { useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";
import type { Flashcard } from "./Admin";
import Login from "./login";

export type AppOutletContext = {
  flashcards: Flashcard[];
  onAdd: (flashcard: Flashcard) => void;
};

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function addFlashcard(flashcard: Flashcard) {
    setFlashcards((cards) => [...cards, flashcard]);
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Outlet context={{ flashcards, onAdd: addFlashcard }} />
  );
}

export function Home() {
  const { flashcards } = useOutletContext<AppOutletContext>();
  const [flippedCard, setFlippedCard] = useState<Set<number>>(() => new Set());

  return (
    <main>
      <h1>Anki Flashcards</h1>
      <Link to="/admin">Admin</Link>
      <section className="flashcard-container" aria-label="Flashcards">
        {flashcards.map((flashcard, index) => (
          <button
            key={`${flashcard.word}-${index}`}
            className="flashcard"
            type="button"
            //if flashcard has an index (card is showing meaning) the button is considered presse
            aria-pressed={flippedCard.has(index)}
            onClick={() =>
              setFlippedCard((current) => {
                const next = new Set(current);
                if (next.has(index)) {
                  next.delete(index);
                } else {
                  next.add(index);
                }
                return next;
              })
            }
          >
            {flippedCard.has(index) ? flashcard.meaning : flashcard.word}
          </button>
        ))}
      </section>
    </main>
  );
}

export default App;
