import { useState, type SubmitEvent } from "react";
import { Link, useOutletContext } from "react-router";
import type { AppOutletContext } from "./App";

export type Flashcard = {
  id: string;
  word: string;
  meaning: string;
  country: string;
};

export type NewFlashcard = Omit<Flashcard, "id">;

function Admin() {
  const { flashcards, isLoading, loadError, onAdd } =
    useOutletContext<AppOutletContext>();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [country, setCountry] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function addFlashcard(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedWord = word.trim();
    const trimmedMeaning = meaning.trim();
    const trimmedCountry = country.trim();
    if (!trimmedWord || !trimmedMeaning || !trimmedCountry) return;

    setIsSaving(true);
    setSaveError("");
    try {
      await onAdd({ word: trimmedWord, meaning: trimmedMeaning, country: trimmedCountry });
      setWord("");
      setMeaning("");
      setCountry("");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Unable to save the flashcard.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="admin-panel" aria-labelledby="admin-heading">
      <Link to="/">Back to flashcards</Link>
      <h2 id="admin-heading">Admin Panel</h2>

      {loadError && <p role="alert">Could not load flashcards: {loadError}</p>}

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
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={isLoading || isSaving}>
          {isSaving ? "Saving..." : "Add Flashcard"}
        </button>
      </form>

      {saveError && <p role="alert">Could not save flashcard: {saveError}</p>}

      <div className="flashcard-table-wrapper">
        <table className="flashcard-table">
          <thead>
            <tr>
              <th scope="col">Word</th>
              <th scope="col">Meaning</th>
              <th scope="col">Country</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2}>Loading flashcards...</td>
              </tr>
            ) : flashcards.length === 0 ? (
              <tr>
                <td colSpan={2}>No flashcards have been added yet.</td>
              </tr>
            ) : (
              flashcards.map((flashcard) => (
                <tr key={flashcard.id}>
                  <td>{flashcard.word}</td>
                  <td>{flashcard.meaning}</td>
                  <td>{flashcard.country}</td>
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
