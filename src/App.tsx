import { useState, type SubmitEvent } from "react";

type Flashcard = {
  word: string;
  meaning: string;
};

function App() {
  const [showMeaning, setShowMeaning] = useState(false);

  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

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
            aria-pressed={flippedCard === index}
            onClick={() => setFlippedCard(flippedCard === index ? null : index)}
          >
            {flippedCard === index ? flashcard.meaning : flashcard.word}
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
