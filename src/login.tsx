import {useState, type SubmitEvent} from "react";

type LoginProps = {
    onLogin: () => void;
};

function login({onLogin}: LoginProps) {
    const [msisdn, setMsisdn] = useState("");
    const [error, setError] = useState("")

    // useEffect(() => {
    //     const getUserInfo = (window as Window & {
    //     cdsdk?: { getUserInfo?: () => Promise<{ idNumber?: string }> };
    //     }).cdsdk?.getUserInfo;

    //     if (!getUserInfo) {
    //         setMsisdn("Unavailable");
    //         return;
    //     }

    //     getUserInfo()
    //     .then((info) => setMsisdn(info.idNumber ?? "Unavailable"))
    //     .catch(() => setMsisdn("Unable to load"));
    // }, []);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (msisdn.replace(/\D/g, "") === "60133501703") {
            onLogin();
            } else {
            setError("That MSISDN was not recognized.");
            }
    }

    return (
        <main>
            <h1>Login</h1>
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
                <button type="submit">Login</button>
                {error && <p role="alert">{error}</p>}
            </form>
        </main>
    );
}

export default login;