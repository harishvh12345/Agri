import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import LabourDashboard from './pages/LabourDashboard';
import TransportDashboard from './pages/TransportDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/farmer" element={<FarmerDashboard />} />
                        <Route path="/labour" element={<LabourDashboard />} />
                        <Route path="/transport" element={<TransportDashboard />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
