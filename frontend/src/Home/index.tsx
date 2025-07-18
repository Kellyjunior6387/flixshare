export default function Home() {
    return (
        <div className="fill" id="home-container">
            <div className="main-container">
                <div className="inner-content">
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '700', 
                        margin: '0 0 1rem 0',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        FlixShare
                    </h1>
                    <p style={{ 
                        fontSize: '1.2rem', 
                        opacity: '0.8', 
                        margin: '0 0 2rem 0',
                        fontWeight: '300'
                    }}>
                        Share and discover amazing content with the world
                    </p>
                    <div className="buttons">
                        <a href="/auth" className="sessionButton">
                            Get Started
                        </a>
                        <a href="/dashboard" className="sessionButton" style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
