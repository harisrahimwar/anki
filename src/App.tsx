import { useState } from "react";

function App() {
  const [showMeaning, setShowMeaning] = useState(false);

  return (
    <main>
      <h1>React and TypeScript</h1>
      <button
        className="flashcard"
        type="button"
        aria-pressed={showMeaning}
        onClick={() => setShowMeaning((isShowingMeaning) => !isShowingMeaning)}
      >
        {showMeaning ? "Lasting for a short time" : "Ephemeral"}
      </button>
    </main>
  );
}

export default App;
