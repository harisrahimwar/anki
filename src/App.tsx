import { useEffect, useState } from "react";
import { Link, Outlet, useOutletContext } from "react-router";
import { FLASHCARD_COUNTRIES, type Flashcard, type NewFlashcard } from "./Admin";
import Login from "./login";
import { getSupabaseClient } from "./lib/supabase";

export type AppOutletContext = {
  flashcards: Flashcard[];
  isLoading: boolean;
  loadError: string | null;
  onAdd: (flashcard: NewFlashcard) => Promise<void>;
};

//Defining Geocoding API response type
type LocationPickerResult = {
  latitude: number;
  longitude: number;
  address?: string;
};

type GeoapifyResponse = {
  results?: Array<{
    country_code?: string;
  }>;
};

const COUNTRY_BY_CODE: Record<string, (typeof FLASHCARD_COUNTRIES)[number]> = {
  MY: "Malaysia",
  JP: "Japan",
  CN: "China",
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
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const visibleFlashcards = selectedCountry
    ? flashcards.filter((flashcard) => flashcard.country === selectedCountry)
    : flashcards;

  async function chooseCountryFromMap() {
    setLocationError("");
    setIsPickingLocation(true);

    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Geoapify is not configured. Set VITE_GEOAPIFY_API_KEY in .env.local.",
        );
      }

      const cdsdk = (window as Window & {
        cdsdk?: {
          openLocationPicker?: (
            options?: {
              showUserLocation?: boolean;
            },
          ) => Promise<LocationPickerResult> | undefined;
        };
      }).cdsdk;

      if (!cdsdk?.openLocationPicker) {
        throw new Error("The CDSDK location picker is not available.");
      }

      const location = await cdsdk.openLocationPicker({
        showUserLocation: true,
      });
      if (!location) {
        throw new Error("The location picker did not return a location.");
      }

      const query = new URLSearchParams({
        lat: String(location.latitude),
        lon: String(location.longitude),
        type: "country",
        format: "json",
        apiKey,
      });
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?${query.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Country lookup failed (HTTP ${response.status}).`);
      }

      const result: GeoapifyResponse = await response.json();
      const countryCode = result.results?.[0]?.country_code?.toUpperCase();
      const country = countryCode ? COUNTRY_BY_CODE[countryCode] : undefined;

      if (!country) {
        throw new Error(
          "The selected location is not in Malaysia, Japan, or China. Choose a country manually.",
        );
      }

      setSelectedCountry(country);
    } catch (error) {
      setLocationError(
        error instanceof Error
          ? error.message
          : "Unable to determine the selected location's country.",
      );
    } finally {
      setIsPickingLocation(false);
    }
  }

  return (
    <main>
      <h1>Anki Flashcards</h1>
      <Link to="/admin">Admin</Link>
      {loadError && <p role="alert">Could not load flashcards: {loadError}</p>}
      <label>
        Filter by country
        <select
          value={selectedCountry}
          onChange={(event) => {
            setSelectedCountry(event.target.value);
            setLocationError("");
          }}
        >
          <option value="">All countries</option>
          {FLASHCARD_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => void chooseCountryFromMap()}
        disabled={isPickingLocation}
      >
        {isPickingLocation ? "Finding country..." : "Choose country from map"}
      </button>
      {locationError && <p role="alert">{locationError}</p>}
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
