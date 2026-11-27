import airplane from "./assets/start/airplane.webp";
import globe from "./assets/start/globe.webp";
import passport from "./assets/start/passport.webp";
import ticket from "./assets/start/ticket.webp";

type StartProps = {
  onStart: () => void;
};

// Start page from the design prototype (CD Flash Cards.html, "Landing" screen)
function Start({ onStart }: StartProps) {
  return (
    <main className="start">
      <header className="start__top-bar">
        <div className="wordmark">
          <PlaneIcon />
          <span className="wordmark__text">Pocket Passport</span>
        </div>
      </header>

      {/* Landing hero / Travel (3D globe, passport, ticket, airplane) */}
      <div className="start__scene" aria-hidden="true">
        <img className="start__item start__item--ticket" src={ticket} alt="" />
        <img className="start__item start__item--globe" src={globe} alt="" />
        <img className="start__item start__item--passport" src={passport} alt="" />
        <img className="start__item start__item--airplane" src={airplane} alt="" />
      </div>

      <section className="sheet start__sheet" aria-labelledby="start-title">
        <h2 className="start__title" id="start-title">
          Let's learn about your travel destination
        </h2>
        <p className="start__body">
          Pick the country you're in and flip through bite-sized travel trivia.
        </p>
        <button className="btn btn--primary" type="button" onClick={onStart}>
          Choose my destination
        </button>
        <p className="start__note">No scores, no pressure. Just fun facts.</p>
      </section>
    </main>
  );
}

// Plane icon from the design prototype (i-plane)
function PlaneIcon() {
  return (
    <svg
      className="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.8 19.2L16 11L19.5 7.5C21 6 21.5 4 21 3C20 2.5 18 3 16.5 4.5L13 8L4.8 6.2C4.3 6.1 3.9 6.3 3.7 6.7L3.4 7.2C3.2 7.7 3.3 8.2 3.7 8.5L9 12L7 15H4L3 16L6 18L8 21L9 20V17L12 15L15.5 20.3C15.8 20.7 16.3 20.8 16.8 20.6L17.3 20.4C17.7 20.1 17.9 19.7 17.8 19.2Z" />
    </svg>
  );
}

export default Start;
