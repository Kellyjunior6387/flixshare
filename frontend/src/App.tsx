import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RoomDetail from "./components/roomDetail";
import Home from "./components/Home";
import Billing from "./components/Billing";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/signUp";

function App() {
    return (
        <div className="App">
            
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
                                <PrivateRoute>
                                    <RoomDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/billing"
                            element={
                                <PrivateRoute>
                                    <Billing />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;