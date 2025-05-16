import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import LandingPage from "./pages/LandingPage";
import "./App.css";

function App() {
	return (
		<Router>
			<div className="app">
				<main className="main-content">
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/home" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/booking" element={<Booking />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
