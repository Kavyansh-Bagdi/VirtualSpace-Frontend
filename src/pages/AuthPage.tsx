import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
function AuthPage() {
    return (
        <>
            <h1>Virtual Space</h1>
            <SignUpForm />
            <SignInForm />
        </>
    );
}

export default AuthPage;