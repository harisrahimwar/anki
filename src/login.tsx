import {useState, type SubmitEvent, useEffect} from "react";

type LoginProps = {
    onLogin: () => void;
};

const VALID_MSISDN = "661121565931";

function isValidMsisdn(value: string) {
    return value.replace(/\D/g, "") === VALID_MSISDN;
}

function login({onLogin}: LoginProps) {
    const [msisdn, setMsisdn] = useState("");
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const getUserInfo = (window as Window & {
        cdsdk?: { getUserInfo?: () => Promise<{ idNumber?: string }> };
        }).cdsdk?.getUserInfo;

        if (!getUserInfo) {
            setMsisdn("Unavailable");
            setChecking(false);
            return;
        }

        let cancelled = false;

        getUserInfo()
        .then((info) => {
            if (cancelled) return;
            const id = info.idNumber ?? "";
            if (isValidMsisdn(id)) {
                onLogin();
                return;
            }
            setMsisdn(id || "Unavailable");
            setChecking(false);
        })
        .catch(() => {
            if (cancelled) return;
            setMsisdn("Unable to load");
            setChecking(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (isValidMsisdn(msisdn)) {
            onLogin();
            } else {
            setError("That MSISDN was not recognized.");
            }
    }

    if (checking) {
        return (
            <main>
                <header className="screen-header">
                    <h1>Login</h1>
                </header>
                <div className="sheet">
                    <p className="text-tertiary" role="status">Signing in…</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <header className="screen-header">
                <h1>Login</h1>
            </header>
            <div className="sheet">
            <p className="text-tertiary">echo "MSISDN: {msisdn}"</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="msisdn">MSISDN</label>
                <input
                id="msisdn"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={msisdn}
                onChange={(event) => {
                    setMsisdn(event.target.value);
                    setError("");
                }}
                required
                />
                <button className="btn btn--primary" type="submit">Login</button>
                {error && <p role="alert">{error}</p>}
            </form>
            </div>
        </main>
    );
}

export default login;