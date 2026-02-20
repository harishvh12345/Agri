import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        role: 'farmer',
        location: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Phone might already be in use.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Join BananaCoord</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="farmer">Farmer</option>
                        <option value="labour">Labour Team</option>
                        <option value="transport">Transport Provider</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="w-full btn-primary pt-2 mt-4">
                    Create Account
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
                Already have an account? <Link to="/login" className="text-primary-600 font-bold">Login</Link>
            </p>
        </div>
    );
}

export default Register;
