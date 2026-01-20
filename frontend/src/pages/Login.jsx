import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
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
        const res = await login(email, password);
        if (!res.success) {
            setError(res.msg);
            setIsLoading(false);
        }
        // Navigate handled by useEffect
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row"
            >
                {/* Left Side - Illustration */}
                <div className="md:w-1/2 bg-brand-600 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700 opacity-90 z-0"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-500 opacity-20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="text-3xl font-bold flex items-center gap-2 mb-2">
                            SmartSoother
                        </div>
                        <p className="text-brand-100">Peace of mind for modern parents.</p>
                    </div>

                    <div className="relative z-10 my-12">
                        <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-brand-100 text-lg leading-relaxed">
                            Monitor your baby's vitals in real-time. Stay connected, stay assured.
                        </p>
                    </div>

                    <div className="relative z-10 text-brand-200 text-sm">
                        &copy; 2024 GlowCare Innovations
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white">
                    <div className="text-center md:text-left mb-8">
                        <h3 className="text-2xl font-bold text-slate-800">Sign In</h3>
                        <p className="text-slate-500 mt-2">Enter your credentials to access the dashboard.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-slate-600">
                                <input type="checkbox" className="mr-2 rounded text-brand-600 focus:ring-brand-500" />
                                Remember me
                            </label>
                            <a href="#" className="text-brand-600 hover:text-brand-700 font-medium">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-brand-200 hover:bg-brand-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account? <Link to="/signup" className="text-brand-600 font-bold hover:underline">Sign up for free</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
