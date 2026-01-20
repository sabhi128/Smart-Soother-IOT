import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const res = await register(name, email, password);
        if (!res.success) {
            setError(res.msg);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row-reverse"
            >
                {/* Right Side - Illustration (Now Left visually on logic, but flex-reversed) */}
                <div className="md:w-1/2 bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90 z-0"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500 opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500 opacity-20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="text-3xl font-bold flex items-center gap-2 mb-2 text-brand-400">
                            Join Us
                        </div>
                    </div>

                    <div className="relative z-10 my-12">
                        <h2 className="text-3xl font-bold mb-4">Start your Journey</h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Create an account to begin tracking your baby's health with advanced AI insights.
                        </p>
                    </div>

                    <div className="relative z-10 text-slate-400 text-sm">
                        &copy; 2024 GlowCare Innovations
                    </div>
                </div>

                {/* Left Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white">
                    <div className="text-center md:text-left mb-8">
                        <h3 className="text-2xl font-bold text-slate-800">Create Account</h3>
                        <p className="text-slate-500 mt-2">It's free and easy.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"
                            >
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Get Started <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-brand-600 font-bold hover:underline">Sign in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
