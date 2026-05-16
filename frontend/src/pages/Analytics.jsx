import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    PieChart, Pie, Cell, 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

const COLORS = ['#6ee71c', '#0096ff', '#eab308', '#ff6b6b'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#050a06] border border-[rgba(110,231,28,0.2)] rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-white font-black" style={{ color: entry.color }}>{entry.name}: <span className="text-white">{entry.value}</span></p>
                ))}
            </div>
        );
    }
    return null;
};

const Analytics = () => {
    const { admin } = useContext(AuthContext);
    
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${admin?.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/leads', config);
                setLeads(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch analytics data", err);
                setLoading(false);
            }
        };
        if (admin?.token) fetchLeads();
    }, [admin]);

    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const contactedLeads = leads.filter(l => l.status === 'contacted').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    const conversionRate = totalLeads ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    const pieData = [
        { name: 'Converted', value: convertedLeads || 0 },
        { name: 'New', value: newLeads || 0 },
        { name: 'Engaged', value: contactedLeads || 0 }
    ].filter(d => d.value > 0);

    // Source breakdown
    const sourceMap = {};
    leads.forEach(lead => {
        const src = lead.source || 'Unknown';
        sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
    const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

    const monthlyDataMap = {};
    leads.forEach(lead => {
        const month = new Date(lead.createdAt).toLocaleString('default', { month: 'short' });
        if (!monthlyDataMap[month]) monthlyDataMap[month] = { name: month, total: 0, converted: 0 };
        monthlyDataMap[month].total += 1;
        if (lead.status === 'converted') monthlyDataMap[month].converted += 1;
    });
    const monthlyData = Object.values(monthlyDataMap);

    const recentActivity = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: [0, -4, 0],
            transition: { 
                opacity: { duration: 0.5 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            } 
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#050a06]">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-[rgba(110,231,28,0.1)]"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#6ee71c] border-r-[#6ee71c] animate-spin shadow-[0_0_20px_rgba(110,231,28,0.4)]"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen pb-20 bg-[#050a06]"
        >
            <div className="mb-10 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-12 h-1 bg-[#6ee71c] mb-6 rounded-full shadow-[0_0_10px_rgba(110,231,28,0.8)]"
                />
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black text-white tracking-tight"
                >
                    Telemetry & Insights
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 mt-2 text-sm font-semibold tracking-wide uppercase"
                >
                    AI-powered velocity tracking
                </motion.p>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 relative z-10">
                
                {/* KPI Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { label: 'Total Volume', value: totalLeads, color: 'text-white', accent: '#ffffff' },
                        { label: 'Raw Leads', value: newLeads, color: 'text-[#0096ff]', accent: '#0096ff' },
                        { label: 'Engaged', value: contactedLeads, color: 'text-[#eab308]', accent: '#eab308' },
                        { label: 'Closed Won', value: convertedLeads, color: 'text-[#6ee71c]', accent: '#6ee71c' },
                        { label: 'Win Rate', value: `${conversionRate}%`, color: 'text-[#6ee71c] text-glow-neon', accent: '#6ee71c', highlight: true },
                    ].map((stat) => (
                        <motion.div 
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 20px ${stat.accent}20` }}
                            className={`glass-panel p-6 relative overflow-hidden ${stat.highlight ? 'border-[rgba(110,231,28,0.3)]' : ''}`}
                        >
                            {stat.highlight && (
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#6ee71c] rounded-full blur-3xl opacity-10"></div>
                            )}
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                            <p className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Pie Chart - Status Distribution */}
                    <motion.div variants={itemVariants} className="glass-panel p-8">
                        <h3 className="text-xs font-black text-gray-400 tracking-[0.15em] uppercase mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#6ee71c] shadow-[0_0_8px_rgba(110,231,28,0.8)]"></div>
                            Stage Analysis
                        </h3>
                        <div className="h-52 relative">
                            <div className="absolute inset-0 bg-[#6ee71c]/5 rounded-full blur-3xl scale-50 z-0 animate-pulse-glow"></div>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={5}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}80)` }} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-600 text-sm">No data yet</div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {pieData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index], boxShadow: `0 0 6px ${COLORS[index]}` }}></div>
                                    {entry.name} ({entry.value})
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Area Chart - Monthly Growth */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 lg:col-span-2 flex flex-col">
                        <h3 className="text-xs font-black text-gray-400 tracking-[0.15em] uppercase mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#6ee71c] shadow-[0_0_8px_rgba(110,231,28,0.8)]"></div>
                            Pipeline Velocity
                        </h3>
                        <div className="flex-1 min-h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData.length > 0 ? monthlyData : [{ name: 'No Data', total: 0, converted: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6ee71c" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#6ee71c" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0096ff" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0096ff" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="total" stroke="#6ee71c" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Total" animationDuration={2000} />
                                    <Area type="monotone" dataKey="converted" stroke="#0096ff" strokeWidth={2} fillOpacity={1} fill="url(#colorConverted)" name="Converted" animationDuration={2000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Source Breakdown + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Bar Chart - Source Breakdown */}
                    <motion.div variants={itemVariants} className="glass-panel p-8">
                        <h3 className="text-xs font-black text-gray-400 tracking-[0.15em] uppercase mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                            Lead Sources
                        </h3>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sourceData.length > 0 ? sourceData : [{ name: 'No Data', value: 0 }]} margin={{ top: 5, right: 5, left: -20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} angle={-25} textAnchor="end" />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" fill="#6ee71c" radius={[4, 4, 0, 0]} name="Leads" animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Event Stream / Activity Timeline */}
                    <motion.div variants={itemVariants} className="glass-panel p-8 lg:col-span-2">
                        <h3 className="text-xs font-black text-gray-400 tracking-[0.15em] uppercase mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            Event Stream
                        </h3>
                        
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-600 font-bold uppercase tracking-widest text-center py-10 text-xs">Awaiting signal transmission...</p>
                        ) : (
                            <div className="relative border-l border-[rgba(255,255,255,0.05)] ml-4 space-y-6 pb-2">
                                {recentActivity.map((lead) => (
                                    <div key={lead.id} className="relative pl-8 group">
                                        <div className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full shadow-md group-hover:scale-[1.6] transition-all duration-300 ${lead.status === 'converted' ? 'bg-[#6ee71c] shadow-[#6ee71c]/50' : lead.status === 'contacted' ? 'bg-[#eab308] shadow-[#eab308]/50' : 'bg-[#0096ff] shadow-[#0096ff]/50'}`}></div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-[rgba(110,231,28,0.08)] transition-all duration-300">
                                            <div>
                                                <p className="text-sm font-bold text-gray-300 tracking-wide">
                                                    Entity registered: <span className="text-[#6ee71c] font-black">{lead.fullName}</span>
                                                </p>
                                                <div className="flex gap-4 mt-1">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">via <span className="text-gray-400">{lead.source}</span></p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">@ <span className="text-gray-400">{lead.company}</span></p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border flex-shrink-0 ${lead.status === 'converted' ? 'border-[#6ee71c]/30 text-[#6ee71c] bg-[#6ee71c]/10' : lead.status === 'contacted' ? 'border-[#eab308]/30 text-[#eab308] bg-[#eab308]/10' : 'border-[#0096ff]/30 text-[#0096ff] bg-[#0096ff]/10'}`}>
                                                {lead.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Analytics;
