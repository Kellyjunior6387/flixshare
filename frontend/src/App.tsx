import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RoomDetail from "./components/roomDetail";
import RoomDetailDemo from "./components/roomDetail/demo";
import Home from "./components/Home";
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
                        <Route path="/room-demo" element={<RoomDetailDemo />} />
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
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;