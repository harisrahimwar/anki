import { useState } from "react";
import Admin, { type Flashcard } from "./Admin";
import Login from "./login";

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedCard, setFlippedCard] = useState<Set<number>>(() => new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  function addFlashcard(flashcard: Flashcard) {
    setFlashcards((cards) => [...cards, flashcard]);
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  if (isAdminView) {
    return (
      <main>
        <Admin
          flashcards={flashcards}
          onAdd={addFlashcard}
          onBack={() => setIsAdminView(false)}
        />
      </main>
    );
  }

  return (
    <main>
      <h1>Anki Flashcards</h1>

      <button type="button" onClick={() => setIsAdminView(true)}>
        Admin
      </button>

      <section className="flashcard-container" aria-label="Flashcards">
        {flashcards.map((flashcard, index) => (
          <button
            key={`${flashcard.word}-${index}`}
            className="flashcard"
            type="button"
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
