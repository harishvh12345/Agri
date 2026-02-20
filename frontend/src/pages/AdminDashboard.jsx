import { useState, useEffect } from 'react';
import { harvestService } from '../services/api';
import { ShieldCheck, BarChart3, Users } from 'lucide-react';

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRequests: 0,
        modelAccuracy: '98.5%',
        activeUsers: 42
    });
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await harvestService.getRequests();
            setRequests(res.data);
            setStats(prev => ({ ...prev, totalRequests: res.data.length }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-purple-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-purple-50 border-purple-100">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-10 h-10 text-purple-600" />
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Model Accuracy</p>
                            <h4 className="text-2xl font-bold">{stats.modelAccuracy}</h4>
                        </div>
                    </div>
                </div>
                <div className="card bg-blue-50 border-blue-100">
                    <div className="flex items-center gap-3">
                        <History className="w-10 h-10 text-blue-600" />
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                            <h4 className="text-2xl font-bold">{stats.totalRequests}</h4>
                        </div>
                    </div>
                </div>
                <div className="card bg-green-50 border-green-100">
                    <div className="flex items-center gap-3">
                        <Users className="w-10 h-10 text-green-600" />
                        <div>
                            <p className="text-sm text-green-600 font-medium">Active Users</p>
                            <h4 className="text-2xl font-bold">{stats.activeUsers}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-6">System Analytics & All Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-sm border-b">
                                <th className="pb-4">ID</th>
                                <th className="pb-4">Acres</th>
                                <th className="pb-4">Distance</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {requests.map(req => (
                                <tr key={req.id} className="text-sm text-gray-700">
                                    <td className="py-4">#{req.id}</td>
                                    <td className="py-4">{req.acres}</td>
                                    <td className="py-4">{req.distance_km}km</td>
                                    <td className="py-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-4">{new Date(req.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Reuse History icon from Lucide
function History({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    );
}

export default AdminDashboard;
