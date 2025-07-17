import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../utils/firebase"; // Make sure the path matches your project

const TestLogin = () => {
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("test1234");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("Logging in...");

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password.trim()
            );

            setMessage(`✅ Logged in as ${userCredential.user.email}`);
            console.log("User:", userCredential.user);
        } catch (error) {
            console.error("Login error:", error.code, error.message);
            setMessage(`❌ ${error.code}: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white shadow-md p-6 rounded-md space-y-4 w-full max-w-sm"
            >
                <h2 className="text-xl font-bold text-center">Test Firebase Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>

                {message && (
                    <div className="text-sm text-center text-gray-700">{message}</div>
                )}
            </form>
        </div>
    );
};

export default TestLogin;
