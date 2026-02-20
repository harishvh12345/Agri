import { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import { Briefcase, CheckCircle, MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

function LabourDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await jobService.getAvailableJobs('labour');
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAccept = async (jobId) => {
        setLoading(true);
        try {
            await jobService.acceptLabourJob(jobId, { user_id: 2 }); // Mock labour user ID
            alert(`Job #${jobId} accepted! The farmer has been notified.`);
            fetchJobs();
        } catch (err) {
            alert('Failed to accept job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <Briefcase className="w-10 h-10 text-primary-500" />
                        Labour Opportunities
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Find and accept harvesting jobs near you.</p>
                </div>
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 px-6 h-16">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Jobs</p>
                        <p className="text-xl font-black text-primary-600 leading-none">{jobs.length}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <Users className="w-6 h-6 text-gray-300" />
                </div>
            </header>

            <div className="grid gap-8">
                {jobs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-6">
                            <Calendar className="w-12 h-12 text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-400">No Jobs Available</h2>
                        <p className="text-gray-400 mt-2 max-w-xs">Check back later for new harvesting requests in your region.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="group bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-50 hover:border-primary-200 transition-all hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Briefcase className="w-32 h-32 rotate-12" />
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Banana Harvest</span>
                                        <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">ID #{job.id}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900">{job.acres} Acres Harvesting</h3>

                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Pickup At</p>
                                                <p className="text-sm font-black text-gray-700">{job.pickup_location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Date Requested</p>
                                                <p className="text-sm font-black text-gray-700">{new Date(job.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-48">
                                    <button
                                        onClick={() => handleAccept(job.id)}
                                        disabled={loading}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-primary-100 transition-all group-hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default LabourDashboard;
