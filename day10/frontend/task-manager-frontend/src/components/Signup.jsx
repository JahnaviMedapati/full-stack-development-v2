import { useState } from "react";

function Signup({ onSignupSuccess, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await fetch("http://127.0.0.1:8000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Signup failed");
            }

            onSignupSuccess();
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
                    <h2>Create your account</h2>
                    <p>Let's get your tasks under control.</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="What should Tuduu call you?"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            minLength={8}
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
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <div className="auth-switch">
                    <span>Already have an account?</span>

                    <button onClick={onSwitchToLogin}>
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Signup;