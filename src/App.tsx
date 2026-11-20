import { useState, type SubmitEvent } from "react";
import Login from "./login";

type Flashcard = {
  word: string;
  meaning: string;
};

function App() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedCard, setFlippedCard] = useState<Set<number | null>>(new Set(null));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }


  function addFlashcard(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setFlashcards(cards => [...cards, { word, meaning }]);
    setWord("");
    setMeaning("");
  }

  return (
    <main>
      <h1>Anki Flashcards</h1>

      <form className="flashcard-form" onSubmit={addFlashcard}>
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />
        <input
          type="text"
          placeholder="Meaning"
          value={meaning}
          onChange={(event) => setMeaning(event.target.value)}
        />
        <button type="submit">Add Flashcard</button>
      </form>

      <section className="flashcard-container">
        {flashcards.map((flashcard, index) => (
          <button
            key={index}
            className="flashcard"
            type="button"
            aria-pressed={flippedCard.has(index)}
            onClick={() => setFlippedCard((current) => {
              const next = new Set(current);
              
              if (next.has(index)) {
                next.delete(index);
              }else {
                next.add(index);
              }
              return next;
            })}
          >
            {flippedCard.has(index) ? flashcard.meaning : flashcard.word}
          </button>
        ))}
      </section>

      {/* <button
        className="flashcard"
        type="button"
        aria-pressed={showMeaning}
        onClick={() => setShowMeaning((isShowingMeaning) => !isShowingMeaning)}
      >
        {showMeaning ? "Lasting for a short time" : "Ephemeral"}
      </button> */}
    </main>
  );
}

export default App;