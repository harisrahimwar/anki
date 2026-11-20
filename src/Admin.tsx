import { useState, type SubmitEvent } from "react";

export type Flashcard = {
  word: string;
  meaning: string;
};

type AdminProps = {
  flashcards: Flashcard[];
  onAdd: (flashcard: Flashcard) => void;
  onBack: () => void;
};

function Admin({ flashcards, onAdd, onBack }: AdminProps) {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");

  function addFlashcard(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedWord = word.trim();
    const trimmedMeaning = meaning.trim();
    if (!trimmedWord || !trimmedMeaning) return;

    onAdd({ word: trimmedWord, meaning: trimmedMeaning });
    setWord("");
    setMeaning("");
  }

  return (
    <section className="admin-panel" aria-labelledby="admin-heading">
      <button type="button" onClick={onBack}>
        Back to flashcards
      </button>
      <h2 id="admin-heading">Admin Panel</h2>

      <form className="flashcard-form" onSubmit={addFlashcard}>
        <label>
          Word
          <input
            type="text"
            value={word}
            onChange={(event) => setWord(event.target.value)}
            required
          />
        </label>
        <label>
          Meaning
          <input
            type="text"
            value={meaning}
            onChange={(event) => setMeaning(event.target.value)}
            required
          />
        </label>
        <button type="submit">Add Flashcard</button>
      </form>

      <div className="flashcard-table-wrapper">
        <table className="flashcard-table">
          <thead>
            <tr>
              <th scope="col">Word</th>
              <th scope="col">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {flashcards.length === 0 ? (
              <tr>
                <td colSpan={2}>No flashcards have been added yet.</td>
              </tr>
            ) : (
              flashcards.map((flashcard, index) => (
                <tr key={`${flashcard.word}-${index}`}>
                  <td>{flashcard.word}</td>
                  <td>{flashcard.meaning}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Admin;
