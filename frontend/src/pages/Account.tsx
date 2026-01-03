import { Link } from "react-router";
import { useAuth } from "../components/auth/AuthContext";

export function Account() {
    const { user, token, isAuthenticated } = useAuth();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                margin: "auto",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#f5f5f5",
                width: "300px", // poki nei ma layoutu ogarnieteego
            }}
        >
            <div style={{ width: "100%", maxWidth: "400px" }}>
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "2rem",
                    }}
                >
                    {isAuthenticated ? (
                        <>
                            <p>
                                user data{JSON.stringify(user)}, token: {token}
                            </p>
                        </>
                    ) : (
                        <>
                            Użytkownik nie jest zalogowany.
                            <br />
                            <Link to="/login">Zaloguj się</Link>
                            <br />
                            <Link to="/register">Zarejestruj się</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
