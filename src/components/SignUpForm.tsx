import { useState } from "react";
import { setToken } from "../scripts/token";
import { z } from "zod";

const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const result = signUpSchema.safeParse({ name, email, password });
        if (!result.success) {
            const fieldErrors: { name?: string; email?: string; password?: string } =
                {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as "name" | "email" | "password"] =
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
            name,
            email,
            password,
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/auth/signup`, {
                method: "POST",
                body: bodyContent,
                headers: headersList,
            });

            const data = await response.json();
            if (!data || !data.token) {
                alert("Signup Failed");
                return;
            }
            setToken(data.token);
            alert("Signup Successful!");
        } catch (error) {
            alert("An error occurred during signup.");
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h5>Sign Up</h5>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                value={name}
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
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
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignUpForm;
