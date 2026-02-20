import { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import { Truck, MapPin, Navigation, Calendar, CheckCircle } from 'lucide-react';

function TransportDashboard() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const res = await jobService.getAvailableJobs('transport');
            setTrips(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAccept = async (tripId) => {
        setLoading(true);
        try {
            await jobService.acceptTransportJob(tripId, { user_id: 3 }); // Mock transport user ID
            alert(`Transport job #${tripId} accepted! Navigation details sent.`);
            fetchTrips();
        } catch (err) {
            alert('Failed to accept trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-blue-900 flex items-center gap-3">
                        <Truck className="w-12 h-12 text-blue-600" />
                        Logistics & Transport
                    </h1>
                    <p className="text-blue-600/60 mt-2 font-medium">Manage banana transport requests across the region.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trips.length === 0 ? (
                    <div className="col-span-full bg-blue-50/50 rounded-3xl p-20 text-center border-2 border-dashed border-blue-100 flex flex-col items-center">
                        <Navigation className="w-16 h-16 text-blue-200 mb-4 animate-pulse" />
                        <h2 className="text-2xl font-black text-blue-300">No Pending Trips</h2>
                        <p className="text-blue-300 mt-2 font-medium italic">All quiet on the roads today...</p>
                    </div>
                ) : (
                    trips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-blue-50 hover:border-blue-300 transition-all hover:scale-[1.02] flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest italic">Express</div>
                                    <span className="text-gray-300 text-xs font-bold">#{trip.id}</span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                        Banana Transport <br />
                                        <span className="text-blue-600">{trip.distance_km} KM</span>
                                    </h3>
                                    <p className="text-gray-400 font-bold text-sm tracking-wide">Farmer #{trip.farmer_id} • {trip.acres} Acres</p>
                                </div>

                                <div className="py-6 border-y border-gray-50 flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Pickup</p>
                                            <p className="text-sm font-black text-gray-800 truncate">{trip.pickup_location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                            <Navigation className="w-4 h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Destination</p>
                                            <p className="text-sm font-black text-gray-800 truncate">{trip.delivery_location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleAccept(trip.id)}
                                disabled={loading}
                                className="mt-8 w-full bg-gray-900 hover:bg-blue-600 text-white font-black py-5 rounded-3xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                <CheckCircle className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                                Accept Trip
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TransportDashboard;
