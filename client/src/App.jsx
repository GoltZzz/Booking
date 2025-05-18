import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import LandingPage from "./pages/LandingPage";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import AdminRoute from "./components/AdminRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";

function App() {
	return (
		<ErrorBoundary
			message="Application Error"
			description="We're sorry, something went wrong with the application. Please try refreshing the page."
			resetButtonText="Refresh Page"
			onReset={() => window.location.reload()}>
			<Router>
				<AuthProvider>
					<ToastProvider>
						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route path="/home" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/booking" element={<Booking />} />
							<Route
								path="/auth/google/success"
								element={<GoogleAuthSuccess />}
							/>

							{/* Admin Routes */}
							<Route path="/admin" element={<AdminRoute />}>
								<Route index element={<AdminDashboard />} />
								<Route path="users" element={<UserManagement />} />
								<Route path="bookings" element={<BookingManagement />} />
							</Route>
						</Routes>
					</ToastProvider>
				</AuthProvider>
			</Router>
		</ErrorBoundary>
	);
}

export default App;
