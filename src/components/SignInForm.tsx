import { useState } from "react";
import { setToken } from "../scripts/token";
import { z } from "zod";

const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const result = signUpSchema.safeParse({ email, password });
        if (!result.success) {
            const fieldErrors: { email?: string; password?: string } =
                {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as "email" | "password"] =
                        err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});

        const headersList = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
            email,
            password,
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/auth/signin`, {
                method: "POST",
                body: bodyContent,
                headers: headersList,
            });

            const data = await response.json();
            if (!data || !data.token) {
                alert("Signin Failed");
                return;
            }
            setToken(data.token);
            alert("Signin Successful!");
        } catch (error) {
            alert("An error occurred during signin.");
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h5>Sign In</h5>
            <label htmlFor="email">Email Address</label>
            <input
                type="email"
                value={email}
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
            <label htmlFor="password">Password</label>
            <input
                type="password"
                value={password}
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
                <div style={{ color: "red" }}>{errors.password}</div>
            )}
            <button type="submit">Sign In</button>
        </form>
    );
}

export default SignInForm;
