import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteModal from '../components/DeleteModal';
import toast from 'react-hot-toast';
import { motion, useMotionValue, useTransform, animate as framerAnimate } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = framerAnimate(count, value, { duration: 2, ease: "easeOut" });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

const mockRevenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 7000 },
  { name: 'Jun', revenue: 6500 },
  { name: 'Jul', revenue: 8500 },
];

const Dashboard = () => {
    const { admin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${admin?.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/leads', config);
                setLeads(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching leads');
                setLoading(false);
            }
        };
        if (admin?.token) fetchLeads();
    }, [admin]);

    const confirmDelete = async () => {
        if (!leadToDelete) return;
        setIsDeleting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${admin?.token}` } };
            await axios.delete(`http://localhost:5000/api/leads/${leadToDelete.id}`, config);
            setLeads(leads.filter(lead => lead.id !== leadToDelete.id));
            toast.success('Lead permanently removed', {
                style: { background: '#0a140d', color: '#fff', border: '1px solid rgba(110,231,28,0.2)' }
            });
        } catch (error) {
            toast.error('Failed to remove lead', {
                style: { background: '#0a140d', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setLeadToDelete(null);
        }
    };

    const openDeleteModal = (lead) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };

    const totalLeads = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const contactedLeads = leads.filter(lead => lead.status === 'contacted').length;
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'new': return 'bg-[#0096ff]/10 text-[#0096ff] border-[#0096ff]/30 shadow-[0_0_10px_rgba(0,150,255,0.1)]';
            case 'contacted': return 'bg-[#eab308]/10 text-[#eab308] border-[#eab308]/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]';
            case 'converted': return 'bg-[#6ee71c]/10 text-[#6ee71c] border-[#6ee71c]/40 shadow-[0_0_15px_rgba(110,231,28,0.2)]';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
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

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen pb-20 bg-[#050a06]"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-12 h-1 bg-[#6ee71c] mb-6 rounded-full shadow-[0_0_15px_rgba(110,231,28,0.8)]"
                    />
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black text-white tracking-tight"
                    >
                        Intelligence Hub
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 mt-2 text-sm font-semibold tracking-wide uppercase"
                    >
                        Real-time pipeline monitoring
                    </motion.p>
                </div>
                <motion.button 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-btn-primary px-8 py-3.5 text-sm"
                    onClick={() => navigate('/add-lead')}
                >
                    Initialize Prospect
                </motion.button>
            </div>
            
            {/* Analytics Cards */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10"
            >
                {[
                    { label: 'Total Volume', value: totalLeads, glow: 'text-white' },
                    { label: 'Raw Leads', value: newLeads, glow: 'text-[#0096ff] drop-shadow-[0_0_15px_rgba(0,150,255,0.4)]' },
                    { label: 'Engaged', value: contactedLeads, glow: 'text-[#eab308] drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]' },
                    { label: 'Successfully Closed', value: convertedLeads, glow: 'text-[#6ee71c] text-glow-neon' }
                ].map((stat, idx) => (
                    <motion.div 
                        variants={itemVariants}
                        key={stat.label}
                        whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(110,231,28,0.1)" }}
                        className="glass-panel p-8 relative group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                            <div className={`w-16 h-16 rounded-full border-4 border-current animate-[spin_10s_linear_infinite]`} style={{ color: idx === 3 ? '#6ee71c' : 'white' }}></div>
                        </div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                        <p className={`text-5xl font-black tracking-tighter ${stat.glow}`}>
                            <AnimatedNumber value={stat.value} />
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Widgets Section: Graph & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 relative z-10">
               {/* Revenue Graph */}
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: [0, -4, 0] }}
                  transition={{ 
                      opacity: { delay: 0.3, duration: 0.5 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
                  }}
                  className="glass-panel p-8 lg:col-span-2 group"
               >
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-lg font-black text-white tracking-wide flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-[#6ee71c] animate-[pulse-glow_2s_infinite_alternate]"></span>
                           Revenue Projection
                       </h3>
                   </div>
                   <div className="h-64 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={mockRevenueData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} />
                               <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                               <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                               <Tooltip 
                                  contentStyle={{ backgroundColor: '#050a06', border: '1px solid rgba(110,231,28,0.2)', borderRadius: '12px' }}
                                  itemStyle={{ color: '#6ee71c', fontWeight: 'bold' }}
                               />
                               <Line 
                                  type="monotone" 
                                  dataKey="revenue" 
                                  stroke="#6ee71c" 
                                  strokeWidth={4} 
                                  dot={{ fill: '#050a06', stroke: '#6ee71c', strokeWidth: 2, r: 4 }} 
                                  activeDot={{ r: 8, fill: '#6ee71c', stroke: '#050a06', strokeWidth: 2 }}
                                  animationDuration={2000}
                               />
                           </LineChart>
                       </ResponsiveContainer>
                   </div>
               </motion.div>

               {/* Activity Feed */}
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: [0, -4, 0] }}
                  transition={{ 
                      opacity: { delay: 0.4, duration: 0.5 },
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
                  }}
                  className="glass-panel p-8 flex flex-col h-full"
               >
                   <h3 className="text-lg font-black text-white tracking-wide mb-6">Live Activity</h3>
                   <div className="flex-1 overflow-hidden relative">
                       <motion.div 
                          className="flex flex-col gap-4 absolute top-0 left-0 right-0"
                          animate={{ y: [0, -100] }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                       >
                           {[...leads, ...leads].slice(0, 8).map((lead, i) => (
                               <div key={i} className="flex gap-4 items-start p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                   <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${lead.status === 'converted' ? 'bg-[#6ee71c] shadow-[0_0_10px_rgba(110,231,28,0.5)]' : lead.status === 'contacted' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                   <div>
                                       <p className="text-sm font-semibold text-white">{lead.fullName} <span className="text-gray-500 font-normal">from {lead.company}</span></p>
                                       <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{lead.status} • {lead.source}</p>
                                   </div>
                               </div>
                           ))}
                       </motion.div>
                       {/* Fade overlays for smooth scrolling effect */}
                       <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#0a140d] to-transparent z-10 pointer-events-none"></div>
                       <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0a140d] to-transparent z-10 pointer-events-none"></div>
                   </div>
               </motion.div>
            </div>

            {/* Table Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: [0, -2, 0] }}
                transition={{ 
                    opacity: { delay: 0.5, duration: 0.5 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                className="glass-panel overflow-hidden relative z-10"
            >
                <div className="p-8 border-b border-[rgba(110,231,28,0.05)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#050a06]/50">
                    <h3 className="text-lg font-black text-white tracking-wide flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#6ee71c] animate-[pulse-glow_2s_infinite_alternate]"></span>
                        Active Pipeline
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <input
                            type="text"
                            placeholder="Search syntax..."
                            className="glass-input text-sm w-full sm:w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select 
                            className="glass-input text-sm w-full sm:w-48 cursor-pointer appearance-none [&>option]:bg-[#0a140d] [&>option]:text-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Stages</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="w-12 h-12 rounded-full border-2 border-[#6ee71c]/20 border-t-[#6ee71c] border-r-[#6ee71c] animate-spin shadow-[0_0_20px_rgba(110,231,28,0.3)]"></div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-96 text-red-400 font-bold text-sm tracking-widest uppercase">
                            [System Error] {error}
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-96 text-gray-500">
                            <div className="w-16 h-16 border border-gray-700 rounded-2xl flex items-center justify-center mb-4 transform rotate-45">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-ping"></div>
                            </div>
                            <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">No Active Telemetry</p>
                            <p className="text-xs mt-2 font-medium">Awaiting new data inputs.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-[rgba(255,255,255,0.02)]">
                            <thead className="bg-[#050a06]/80">
                                <tr>
                                    {['Target', 'Comms', 'Organization', 'Vector', 'State', ''].map((head, i) => (
                                        <th key={i} className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(255,255,255,0.02)]">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-[#6ee71c]/[0.03] transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="font-bold text-white text-sm tracking-wide">{lead.fullName}</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-300">{lead.email}</div>
                                            <div className="text-xs text-gray-600 mt-1 font-medium tracking-wide">{lead.phone}</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-300">{lead.company}</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-xs font-bold text-gray-400 tracking-wide">
                                                {lead.source}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 inline-flex text-[10px] font-black rounded-lg uppercase tracking-widest border ${getStatusStyle(lead.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 my-auto ${lead.status === 'converted' ? 'bg-[#6ee71c] animate-pulse' : lead.status === 'contacted' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => navigate(`/edit-lead/${lead.id}`)}
                                                    className="text-[11px] uppercase tracking-widest font-black text-gray-500 hover:text-[#6ee71c] transition-colors" 
                                                >
                                                    Modify
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(lead)}
                                                    className="text-[11px] uppercase tracking-widest font-black text-gray-500 hover:text-red-400 transition-colors" 
                                                >
                                                    Purge
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>

            <DeleteModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={confirmDelete} 
                leadName={leadToDelete?.fullName} 
                isDeleting={isDeleting}
            />
        </motion.div>
    );
};

export default Dashboard;
