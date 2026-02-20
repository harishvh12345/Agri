import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
                    <Leaf className="w-8 h-8" />
                    <span>BananaCoord</span>
                </Link>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => alert('Language toggled (Mock)')}
                        className="text-xs font-bold bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    >
                        தமிழ் / EN
                    </button>
                    {token ? (
                        <>
                            <span className="text-sm font-medium text-gray-600 capitalize">{role} Mode</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-gray-600 font-medium">Login</Link>
                            <Link to="/register" className="text-primary-600 font-medium border-b-2 border-primary-600">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
