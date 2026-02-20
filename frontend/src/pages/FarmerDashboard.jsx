import { useState, useEffect } from 'react';
import { harvestService } from '../services/api';
import { Calculator, PlusCircle, History, MapPin, Ruler, Leaf, Truck, CheckCircle, Phone, User as UserIcon } from 'lucide-react';

function FarmerDashboard() {
    const [acres, setAcres] = useState('');
    const [distance, setDistance] = useState('');
    const [labourCount, setLabourCount] = useState('');
    const [pickup, setPickup] = useState('');
    const [delivery, setDelivery] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await harvestService.getRequests();
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await harvestService.predictCost({
                acres: parseFloat(acres),
                distance_km: parseFloat(distance),
                labour_count: parseInt(labourCount),
                fuel_price: 102.5,
            });
            setPrediction(res.data);
        } catch (err) {
            alert('Prediction failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRequest = async () => {
        try {
            await harvestService.createRequest({
                farmer_id: 1,
                acres: parseFloat(acres),
                distance_km: parseFloat(distance),
                pickup_location: pickup,
                delivery_location: delivery,
            });
            alert('Harvest request created successfully!');
            fetchRequests();
        } catch (err) {
            alert('Failed to create request');
        }
    };

    const handleComplete = async (jobId) => {
        if (!confirm('Are you sure you want to mark this job as completed? This will close the request.')) return;
        try {
            await harvestService.completeHarvest(jobId);
            alert('Job marked as completed!');
            fetchRequests();
        } catch (err) {
            alert('Failed to complete job');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <header className="bg-gradient-to-r from-primary-600 to-green-600 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden mb-8">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                        Welcome, Farmer Arun! <span className="text-3xl animate-bounce">🍌</span>
                    </h1>
                    <p className="text-primary-100 text-lg opacity-90">Manage your harvest and transport in one place.</p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Leaf className="w-48 h-48 rotate-12" />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Prediction Form */}
                <div className="lg:col-span-5 space-y-6">
                    <section className="card border-none backdrop-blur-xl bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-primary-100">
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                            <div className="bg-primary-100 p-3 rounded-2xl">
                                <Calculator className="w-6 h-6 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Cost Estimator</h2>
                        </div>
                        <form onSubmit={handlePredict} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Acres</label>
                                    <div className="relative group">
                                        <Ruler className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-12 p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-400 outline-none transition-all bg-gray-50/50 text-gray-900"
                                            placeholder="e.g. 5"
                                            value={acres}
                                            onChange={(e) => setAcres(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Dist. (km)</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-12 p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-400 outline-none transition-all bg-gray-50/50 text-gray-900"
                                            placeholder="Distance"
                                            value={distance}
                                            onChange={(e) => setDistance(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-primary-600">From (Pickup)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-400 outline-none bg-gray-50/50 text-gray-900"
                                        placeholder="Pickup location"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-green-600">To (Delivery)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-400 outline-none bg-gray-50/50 text-gray-900"
                                        placeholder="Market location"
                                        value={delivery}
                                        onChange={(e) => setDelivery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Required Labour</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-400 outline-none bg-gray-50/50 text-gray-900"
                                    placeholder="Number of workers"
                                    value={labourCount}
                                    onChange={(e) => setLabourCount(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-tr from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-200 transition-all hover:-translate-y-1 active:scale-95 text-lg" disabled={loading}>
                                {loading ? 'Analyzing Data...' : 'Estimate Now'}
                            </button>
                        </form>

                        {prediction && (
                            <div className="mt-8 pt-6 border-t border-gray-100 animate-in slide-in-from-bottom duration-500">
                                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-3xl border-2 border-primary-200">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">Estimated Total</p>
                                            <h3 className="text-5xl font-black text-primary-900 leading-none">₹{prediction.predicted_cost}</h3>
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl shadow-sm rotate-3">
                                            <Truck className="w-10 h-10 text-primary-600" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        <div className="bg-white/80 p-3 rounded-2xl shadow-sm text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Labour</p>
                                            <p className="text-sm font-black text-gray-800">₹{prediction.cost_breakdown.labour}</p>
                                        </div>
                                        <div className="bg-white/80 p-3 rounded-2xl shadow-sm text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Transport</p>
                                            <p className="text-sm font-black text-gray-800">₹{prediction.cost_breakdown.transport}</p>
                                        </div>
                                        <div className="bg-white/80 p-3 rounded-2xl shadow-sm text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Others</p>
                                            <p className="text-sm font-black text-gray-800">₹{prediction.cost_breakdown.base}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCreateRequest}
                                        className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-xl shadow-green-100"
                                    >
                                        <PlusCircle className="w-6 h-6" />
                                        Book Everything
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Requests Dashboard */}
                <div className="lg:col-span-7 space-y-6">
                    <section className="card h-full min-h-[600px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] bg-white">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-2xl">
                                    <History className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800">Live Track</h2>
                            </div>
                            <span className="text-sm font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
                                {requests.length} Requests
                            </span>
                        </div>

                        <div className="space-y-6">
                            {requests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                    <Leaf className="w-20 h-20 mb-4" />
                                    <p className="font-bold text-xl">No active requests found</p>
                                </div>
                            ) : (
                                requests.map((req) => (
                                    <div key={req.id} className={`p-6 rounded-3xl border-2 transition-all group ${req.status === 'completed' ? 'opacity-60 bg-gray-50 border-transparent' : 'bg-white border-gray-100 hover:border-primary-100'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-[.2em]">Job ID #{req.id}</span>
                                                    {req.status === 'completed' && <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-md italic">Done</span>}
                                                </div>
                                                <h3 className="text-xl font-black text-gray-800">{req.acres} Acre Banana Farm</h3>
                                            </div>
                                            <div className="flex flex-col gap-2 items-end">
                                                <StatusBadge label="Labour" status={req.labour_status} />
                                                <StatusBadge label="Transport" status={req.transport_status} />
                                            </div>
                                        </div>

                                        <div className="relative mb-6 flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                            <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                                            <div className="flex-1 flex items-center gap-2 overflow-hidden text-gray-900">
                                                <span className="font-bold text-xs truncate max-w-[150px]">{req.pickup_location}</span>
                                                <div className="h-[2px] flex-1 bg-gradient-to-r from-primary-500 to-green-500 rounded-full min-w-[30px]" />
                                                <span className="font-bold text-xs truncate max-w-[150px]">{req.delivery_location}</span>
                                            </div>
                                            <Truck className="w-5 h-5 text-green-600 shrink-0" />
                                        </div>

                                        {/* Provider Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            {req.labour_details && (
                                                <div className="bg-primary-50/50 p-4 rounded-2xl border border-primary-100">
                                                    <p className="text-[10px] font-black text-primary-600 uppercase mb-2">Labour Provider</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white p-2 rounded-xl text-primary-600">
                                                            <UserIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-gray-900">
                                                            <p className="font-black text-sm">{req.labour_details.name}</p>
                                                            <p className="text-xs font-bold text-primary-600 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {req.labour_details.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {req.transport_details && (
                                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                                    <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Transport Provider</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white p-2 rounded-xl text-blue-600">
                                                            <Truck className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-gray-900">
                                                            <p className="font-black text-sm">{req.transport_details.name}</p>
                                                            <p className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {req.transport_details.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${req.status === 'completed' ? 'bg-green-500' : 'bg-primary-500'}`} />
                                                    <span>Status: <span className="text-gray-900 uppercase">{req.status}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <History className="w-4 h-4" />
                                                    <span>{new Date(req.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {req.status === 'pending' && req.labour_status === 'accepted' && req.transport_status === 'accepted' && (
                                                <button
                                                    onClick={() => handleComplete(req.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-2 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-green-100 flex items-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Complete Job
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

const StatusBadge = ({ label, status }) => (
    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
        }`}>
        {status === 'accepted' ? <CheckCircle className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />}
        {label}: {status}
    </div>
);

export default FarmerDashboard;
