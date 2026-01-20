import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Radio, LogOut, Menu, X, User } from 'lucide-react';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className="relative group">
                <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                )}>
                    <Icon size={20} className={isActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"} />
                    <span className="font-medium text-sm">{label}</span>
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-surface-secondary font-sans selection:bg-brand-200 selection:text-brand-900">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center text-white mr-3 shadow-lg shadow-brand-200">
                                <Radio size={18} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500 tracking-tight">
                                SmartSoother
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        {user && (
                            <div className="hidden md:flex items-center space-x-2">
                                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                                <NavItem to="/devices" icon={Radio} label="My Devices" />
                            </div>
                        )}

                        {/* User Profile / Auth Actions */}
                        <div className="hidden md:flex items-center">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                                        <User size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-600">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-accent transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login" className="text-slate-500 hover:text-brand-600 font-medium text-sm">Login</Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-medium shadow-md shadow-brand-200 hover:bg-brand-700 transition-all hover:shadow-lg hover:shadow-brand-200/50"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-slate-200 z-40 shadow-lg overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            {user ? (
                                <>
                                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Dashboard</Link>
                                    <Link to="/devices" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">My Devices</Link>
                                    <div className="border-t border-slate-100 pt-4 mt-2">
                                        <div className="text-sm text-slate-500 mb-2">Logged in as {user.name}</div>
                                        <button onClick={handleLogout} className="text-accent text-sm font-medium flex items-center gap-2">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 text-slate-600">Login</Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 bg-brand-600 text-white rounded-lg">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-24 pb-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {children}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
