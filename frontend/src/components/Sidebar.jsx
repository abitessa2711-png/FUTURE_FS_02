import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid,
    FiLayers,
    FiBarChart2,
    FiPlusSquare,
    FiLogOut,
    FiMenu,
    FiX,
    FiCpu
} from 'react-icons/fi';

const navItems = [
    { to: '/dashboard',  label: 'Analytics Dashboard',   icon: FiGrid },
    { to: '/leads',      label: 'Pipeline',   icon: FiLayers },
    { to: '/add-lead',   label: 'Add Lead',   icon: FiPlusSquare },
    { to: '/analytics',  label: 'Reports',  icon: FiBarChart2 },
];

const Sidebar = () => {
    const { admin, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#050a06]/90 backdrop-blur-3xl border-r border-[rgba(110,231,28,0.05)] relative z-20">
            {/* Subtle Edge Glow */}
            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#6ee71c]/20 to-transparent"></div>

            {/* Logo Section */}
            <div className="flex items-center gap-4 px-8 py-10">
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-10 h-10 bg-[#0a140d] border border-[#6ee71c]/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(110,231,28,0.15)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[#6ee71c]/10"></div>
                    <FiCpu className="text-[#6ee71c] w-5 h-5" />
                </motion.div>
                <div>
                    <h1 className="text-white font-black text-xl tracking-tight">Orionify<span className="text-[#6ee71c]">.</span></h1>
                    <p className="text-gray-500 text-[9px] uppercase tracking-[0.25em] font-bold mt-1">Intelligence</p>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto z-10 pt-4 custom-scrollbar">
                <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-4">Workspace</p>
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold tracking-wide transition-all duration-300 group
                            ${isActive
                                ? 'text-[#050a06]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebarActive"
                                        className="absolute inset-0 bg-gradient-to-r from-[#6ee71c] to-[#8cf53a] rounded-2xl shadow-[0_0_20px_rgba(110,231,28,0.3)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon
                                    size={18}
                                    className={`relative z-10 flex-shrink-0 transition-transform duration-300 ${isActive ? 'text-[#050a06]' : 'group-hover:scale-110 group-hover:text-[#6ee71c]'}`}
                                />
                                <span className="relative z-10">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Admin Profile */}
            <div className="p-6 mt-auto">
                <div className="p-4 rounded-2xl bg-[#0a140d]/50 border border-[rgba(110,231,28,0.1)] mb-4 hover:border-[rgba(110,231,28,0.3)] transition-colors duration-300 group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#050a06] flex items-center justify-center border border-[#6ee71c]/30 flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(110,231,28,0.2)] transition-shadow">
                            <span className="text-[#6ee71c] font-bold text-sm">
                                {admin?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-bold truncate tracking-wide">{admin?.name || 'Admin User'}</p>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider truncate font-semibold">{admin?.email || 'admin@orionify.com'}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold text-gray-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-300"
                >
                    <FiLogOut size={16} />
                    <span className="tracking-wide">Disconnect</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <aside className="hidden md:flex flex-col w-[280px] h-screen sticky top-0 flex-shrink-0 z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#050a06]/90 backdrop-blur-2xl border-b border-[rgba(110,231,28,0.1)] sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <FiCpu className="text-[#6ee71c] w-6 h-6" />
                    <span className="text-white font-black text-lg tracking-tight">Orionify</span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 text-[#6ee71c] hover:bg-[#6ee71c]/10 rounded-xl transition"
                >
                    <FiMenu size={24} />
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-[#050a06]/95 backdrop-blur-xl md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-[280px] md:hidden shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-6 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl z-50 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
