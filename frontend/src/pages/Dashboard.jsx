import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SocketContext from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, Droplets, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import { PageTransition, FadeIn } from '../components/Animations';

const Dashboard = () => {
    const socket = useContext(SocketContext);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [liveData, setLiveData] = useState(null);
    const [history, setHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchDevices();
    }, []);

    useEffect(() => {
        if (selectedDeviceId) {
            fetchHistory(selectedDeviceId);
            fetchAlerts(selectedDeviceId);

            if (socket) {
                socket.on(`reading:${selectedDeviceId}`, (data) => {
                    setLiveData(data);
                    setHistory(prev => [data, ...prev].slice(0, 50));
                });

                socket.on(`alert:${selectedDeviceId}`, (alert) => {
                    setAlerts(prev => [alert, ...prev]);
                });
            }
        }

        return () => {
            if (socket && selectedDeviceId) {
                socket.off(`reading:${selectedDeviceId}`);
                socket.off(`alert:${selectedDeviceId}`);
            }
        };
    }, [selectedDeviceId, socket]);

    const fetchDevices = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/devices`);
            setDevices(res.data);
            if (res.data.length > 0) {
                const connected = res.data.find(d => d.status === 'connected');
                setSelectedDeviceId(connected ? connected.deviceId : res.data[0].deviceId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async (id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/readings/${id}`);
            setHistory(res.data.reverse());
            if (res.data.length > 0) setLiveData(res.data[0]);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAlerts = async (id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/readings/alerts/${id}`);
            setAlerts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (devices.length === 0) {
        return (
            <PageTransition>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                    <div className="bg-slate-100 p-6 rounded-full mb-6">
                        <Smartphone size={48} className="text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">No Devices Setup</h2>
                    <p className="text-slate-500 max-w-md mb-8">
                        It looks like you haven't paired any SmartSoother devices yet.
                        Head over to the device manager to get started.
                    </p>
                    <a href="/devices" className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium shadow-lg shadow-brand-200 hover:bg-brand-700 transition">
                        Pair a Device
                    </a>
                </div>
            </PageTransition>
        );
    }

    // Helper for status colors & icons
    const getStatus = (val, type) => {
        let status = 'normal';
        if (type === 'temp' && val > 38) status = 'critical';
        if (type === 'hr' && (val < 90 || val > 160)) status = 'warning';
        if (type === 'hydro' && val < 40) status = 'warning';

        if (status === 'critical') return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: AlertTriangle };
        if (status === 'warning') return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: AlertTriangle };
        return { color: 'text-brand-600', bg: 'bg-white', border: 'border-slate-100', icon: CheckCircle };
    };

    const VitalCard = ({ title, value, unit, icon: Icon, type, delay }) => {
        const { color, bg, border, icon: StatusIcon } = liveData ? getStatus(value, type) : { color: 'text-slate-400', bg: 'bg-white', border: 'border-slate-100' };

        return (
            <FadeIn delay={delay}>
                <div className={`relative overflow-hidden p-6 rounded-3xl shadow-sm border ${border} ${bg} transition-colors duration-300`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 bg-current`}>
                            <Icon size={24} />
                        </div>
                        {liveData && (
                            <div className={`flex items-center gap-1 text-xs font-bold uppercase px-2 py-1 rounded-full ${color} bg-opacity-10 bg-current`}>
                                {getStatus(value, type).color === 'text-brand-600' ? 'Normal' : 'Check'}
                            </div>
                        )}
                    </div>

                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
                    <div className="mt-1 flex items-baseline gap-1">
                        <span className={`text-4xl font-extrabold tracking-tight ${color === 'text-slate-400' ? 'text-slate-700' : 'text-slate-900'}`}>
                            {liveData ? value : '--'}
                        </span>
                        <span className="text-lg font-medium text-slate-400">{unit}</span>
                    </div>
                </div>
            </FadeIn>
        );
    };

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Live Monitor</h1>
                        <p className="text-slate-500">Real-time vitals tracking</p>
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none w-full sm:w-64 pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm cursor-pointer"
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                        >
                            {devices.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>
                                    {d.assignedBaby ? d.assignedBaby.name : 'Unknown Baby'} ({d.deviceId})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <Smartphone size={16} />
                        </div>
                    </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <VitalCard
                        title="Temperature"
                        value={liveData?.temperature}
                        unit="°C"
                        icon={Thermometer}
                        type="temp"
                        delay={0.1}
                    />
                    <VitalCard
                        title="Heart Rate"
                        value={liveData?.heartRate}
                        unit="BPM"
                        icon={Activity}
                        type="hr"
                        delay={0.2}
                    />
                    <VitalCard
                        title="Hydration"
                        value={liveData?.hydration}
                        unit="%"
                        icon={Droplets}
                        type="hydro"
                        delay={0.3}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FadeIn delay={0.4}>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-96">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Temperature & Hydration</h3>
                                <div className="flex gap-4 text-xs font-medium">
                                    <span className="flex items-center gap-1 text-orange-500"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Temp</span>
                                    <span className="flex items-center gap-1 text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-600"></div> Hydration</span>
                                </div>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history}>
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorHydro" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="timestamp" hide />
                                        <YAxis yAxisId="left" domain={[35, 40]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                        />
                                        <Area yAxisId="left" type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                                        <Area yAxisId="right" type="monotone" dataKey="hydration" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorHydro)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.5}>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-96">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Heart Rate</h3>
                                <div className="flex gap-4 text-xs font-medium">
                                    <span className="flex items-center gap-1 text-indigo-500"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> BPM</span>
                                </div>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history}>
                                        <defs>
                                            <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="timestamp" hide />
                                        <YAxis domain={[50, 200]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#6366f1' }}
                                        />
                                        <Area type="monotone" dataKey="heartRate" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Recent Alerts */}
                <FadeIn delay={0.6}>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Alert History</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{alerts.length} Events</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {alerts.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No alerts recorded yet. Everything looks good!</div>
                            ) : (
                                <ul className="divide-y divide-slate-50">
                                    <AnimatePresence>
                                        {alerts.map((alert, idx) => (
                                            <motion.li
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`px-6 py-4 hover:bg-slate-50 transition-colors ${alert.severity === 'critical' ? 'bg-red-50/30' : ''}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        <AlertTriangle size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {alert.key} {alert.message}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            {new Date(alert.timestamp).toLocaleTimeString()} &bull; {new Date(alert.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {alert.severity}
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </PageTransition>
    );
};

export default Dashboard;
