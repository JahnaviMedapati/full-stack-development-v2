import { useState } from "react";

const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Login({ onLogin, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed");
            }

            onLogin(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="bubbles">
                <span className="bubble bubble-1"></span>
                <span className="bubble bubble-2"></span>
                <span className="bubble bubble-3"></span>
                <span className="bubble bubble-4"></span>
            </div>

            <div className="auth-card">

                <div className="auth-brand">
                    <div className="bunny-logo">
                        🐰
                    </div>

                    <h1>Tuduu</h1>

                    <p>Your little productivity buddy</p>
                </div>

                <div className="auth-heading">
                    <h2>Welcome back</h2>
                    <p>Let's get some things done.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="auth-switch">
                    <span>Don't have an account?</span>

                    <button onClick={onSwitchToSignup}>
                        Sign up
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Login;