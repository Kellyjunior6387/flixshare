import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RoomDetail from "./components/roomDetail";
import Home from "./components/Home";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/signUp";

function App() {
    return (
        <div className="App">
            <header>
                <div className="header-container">
                    <a href="/">
                        <img src="/favicon.svg" alt="FlixShare" />
                    </a>
                </div>
                <div className="header-container-right">
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </div>
            </header>
            <div className="app-container">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth/login" element={<Login/>} />
                        <Route path="/auth/register" element={<Register />} />
                        
                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route 
                            path="/room/:roomId"
                            element={
                                //<PrivateRoute>
                                    <RoomDetail />
                                //</PrivateRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;