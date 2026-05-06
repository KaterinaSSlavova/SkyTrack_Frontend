import { Routes, Route, Navigate } from "react-router-dom";
import AirportOverviewPage from "./pages/AirportOverviewPage";
import CreateAirportPage from "./pages/CreateAirportPage";
import UpdateAirportPage from "./pages/UpdateAirportPage";
import RegistrationPage from "./pages/RegistrationPage";
import PassengerHomePage from "./pages/PassengerHomePage";
import SearchFlightsPage from "./pages/SearchFlightsPage";
import FlightsPage from "./pages/FlightsPage";
import CreateFlightPage from "./pages/CreateFlightPage";
import UpdateFlightPage from "./pages/UpdateFlightPage";
import LoginPage from "./pages/LoginPage";
import { UserProvider } from "./context/UserContext";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App() {
  return (
      <UserProvider>
       <Routes>
            <Route path="/" element={<Navigate to="/auth/login" />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/passenger" element={<PassengerHomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth/register" element={<RegistrationPage />} />
            <Route path="/airports" element={<AirportOverviewPage />} />
            <Route path="/airports/create" element={<CreateAirportPage />} />
            <Route path="/airports/update/:id" element={<UpdateAirportPage />} />
            <Route path="/flights/search" element={<SearchFlightsPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/flights/create" element={<CreateFlightPage />} />
            <Route path="/flights/update/:id" element={<UpdateFlightPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/seats" element={<SeatSelectionPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
       </Routes>
      </UserProvider>
  )
}

export default App