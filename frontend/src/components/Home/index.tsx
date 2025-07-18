export default function Home() {
    return (
        <div className="fill" id="home-container">
            <div className="logos">
            </div>
            <div className="main-container">
                <div className="inner-content">
                    <p>
                        <strong>SuperTokens</strong> x <strong>React</strong> <br /> example project
                    </p>
                    <div className="buttons">
                        <a href="/auth/register" className="sessionButton">
                            Sign-up / Login
                        </a>
                        <a href="/dashboard" className="sessionButton">
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
