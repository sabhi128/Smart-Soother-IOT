import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, UserPlus, Smartphone, Wifi, WifiOff, Baby, Trash2 } from 'lucide-react';
import { PageTransition, FadeIn } from '../components/Animations';

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [babies, setBabies] = useState([]);
    const [newDeviceId, setNewDeviceId] = useState('');
    const [selectedBabyId, setSelectedBabyId] = useState('');
    const [babyName, setBabyName] = useState('');
    const [babyAge, setBabyAge] = useState('');
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('success');

    useEffect(() => {
        fetchDevices();
        fetchBabies();
    }, []);

    const fetchDevices = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/devices`);
            setDevices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBabies = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/babies`);
            setBabies(res.data);
            if (res.data.length > 0) setSelectedBabyId(res.data[0]._id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddBaby = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/babies`, {
                name: babyName,
                ageMonths: babyAge
            });
            showMsg('Baby profile created successfully!', 'success');
            setBabyName('');
            setBabyAge('');
            fetchBabies();
        } catch (err) {
            showMsg('Error adding baby profile.', 'error');
        }
    };

    const handlePair = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/devices/pair`, {
                deviceId: newDeviceId,
                babyId: selectedBabyId
            });
            showMsg('Device paired successfully!', 'success');
            setNewDeviceId('');
            fetchDevices();
        } catch (err) {
            showMsg(err.response?.data?.msg || 'Error pairing device', 'error');
        }
    };

    const showMsg = (text, type) => {
        setMsg(text);
        setMsgType(type);
        setTimeout(() => setMsg(''), 4000);
    };

    return (
        <PageTransition>
            <div className="space-y-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Device Management</h1>
                    <p className="text-slate-500 mt-1">Manage baby profiles and pair your SmartSoother devices.</p>
                </div>

                {msg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl flex items-center justify-center font-medium ${msgType === 'error' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-700'}`}
                    >
                        {msg}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Col: Actions */}
                    <div className="space-y-8">
                        {/* Step 1: Add Baby */}
                        <FadeIn delay={0.1}>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Baby size={120} className="text-brand-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">1</div>
                                        <h2 className="text-xl font-bold text-slate-800">Create Profile</h2>
                                    </div>

                                    <form onSubmit={handleAddBaby} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-600 mb-1">Baby Name</label>
                                            <input type="text" value={babyName} onChange={e => setBabyName(e.target.value)} required placeholder="e.g. Alex" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-600 mb-1">Age (Months)</label>
                                            <input type="number" value={babyAge} onChange={e => setBabyAge(e.target.value)} required placeholder="e.g. 6" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
                                        </div>
                                        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                            <UserPlus size={18} /> Add Baby
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Step 2: Pair Device */}
                        <FadeIn delay={0.2}>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Smartphone size={120} className="text-accent-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-bold">2</div>
                                        <h2 className="text-xl font-bold text-slate-800">Pair Device</h2>
                                    </div>

                                    <form onSubmit={handlePair} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-600 mb-1">Device ID</label>
                                            <input type="text" value={newDeviceId} onChange={e => setNewDeviceId(e.target.value)} placeholder="Enter Hardware ID" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-600 mb-1">Assign to</label>
                                            <div className="relative">
                                                <select value={selectedBabyId} onChange={e => setSelectedBabyId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all">
                                                    <option value="">Select a baby</option>
                                                    {babies.map(b => (
                                                        <option key={b._id} value={b._id}>{b.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                                    <Baby size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-accent-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-accent-200 hover:bg-accent-700 transition-all flex items-center justify-center gap-2">
                                            <Wifi size={18} /> Pair Now
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right Col: Device List */}
                    <FadeIn delay={0.3}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-slate-800">Connected Devices</h2>
                                <span className="text-sm px-3 py-1 bg-white rounded-full border border-slate-200 text-slate-500 font-medium">{devices.length} Total</span>
                            </div>

                            {devices.length === 0 ? (
                                <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                                    <Smartphone size={48} className="text-slate-300 mb-4" />
                                    <p className="text-slate-500 font-medium">No devices connected yet.</p>
                                    <p className="text-slate-400 text-sm mt-1">Add a baby and pair a device to get started.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {devices.map((device, idx) => (
                                        <motion.div
                                            key={device._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-brand-200 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${device.status === 'connected' ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Smartphone size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{device.deviceId}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${device.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                            {device.status === 'connected' ? <Wifi size={12} /> : <WifiOff size={12} />}
                                                            <span className="capitalize">{device.status}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-400">&bull;</span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Baby size={12} /> {device.assignedBaby?.name || 'Unassigned'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </PageTransition>
    );
};

export default Devices;
