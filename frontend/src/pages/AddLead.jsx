import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddLead = () => {
    const { admin } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website Form',
        status: 'new',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const config = { headers: { Authorization: `Bearer ${admin?.token}` } };
            await axios.post('http://localhost:5000/api/leads', formData, config);
            
            toast.success('System updated: Target Acquired', {
                style: { background: '#0a140d', color: '#6ee71c', border: '1px solid rgba(110,231,28,0.3)', borderRadius: '16px', fontWeight: 'bold', fontSize: '14px' },
                iconTheme: { primary: '#6ee71c', secondary: '#050a06' }
            });
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transmission failed', {
                style: { background: '#0a140d', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', fontWeight: 'bold' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const inputVariants = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen relative z-10 flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
                transition={{ 
                    opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="glass-panel p-8 md:p-12 w-full"
            >
                <div className="mb-12">
                    <div className="w-12 h-1 bg-[#6ee71c] mb-6 rounded-full shadow-[0_0_10px_rgba(110,231,28,0.8)]"></div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Initialize Target</h2>
                    <p className="text-gray-400 mt-2 text-xs font-bold uppercase tracking-widest">Provide data parameters to begin tracking.</p>
                </div>

                <motion.form variants={formVariants} initial="hidden" animate="show" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <motion.div variants={inputVariants} className="space-y-3">
                            <label className="text-[10px] font-black text-[#6ee71c] uppercase tracking-[0.2em] pl-1">Target Designation</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                className="glass-input bg-[#050a06]/80"
                                placeholder="E.g. Jane Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </motion.div>

                        <motion.div variants={inputVariants} className="space-y-3">
                            <label className="text-[10px] font-black text-[#6ee71c] uppercase tracking-[0.2em] pl-1">Comms Uplink (Email)</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="glass-input bg-[#050a06]/80"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </motion.div>

                        <motion.div variants={inputVariants} className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Frequency (Phone)</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="glass-input bg-[#050a06]/80"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </motion.div>

                        <motion.div variants={inputVariants} className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Host Organization</label>
                            <input
                                type="text"
                                name="company"
                                required
                                className="glass-input bg-[#050a06]/80"
                                placeholder="Company Name"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </motion.div>

                        <motion.div variants={inputVariants} className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Acquisition Vector</label>
                            <div className="relative">
                                <select
                                    name="source"
                                    className="glass-input bg-[#050a06]/80 appearance-none cursor-pointer [&>option]:bg-[#0a140d] [&>option]:text-white relative z-10"
                                    value={formData.source}
                                    onChange={handleChange}
                                >
                                    <option value="Website Form">Website Form</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Cold Call">Cold Call</option>
                                    <option value="Conference">Conference</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#6ee71c] pointer-events-none animate-pulse-glow"></div>
                            </div>
                        </motion.div>

                        <motion.div variants={inputVariants} className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Initial State</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    className="glass-input bg-[#050a06]/80 appearance-none cursor-pointer [&>option]:bg-[#0a140d] [&>option]:text-white relative z-10"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="new">New Lead</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Converted</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#6ee71c] pointer-events-none animate-pulse-glow"></div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={inputVariants} className="space-y-3 pt-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Intelligence Logs</label>
                        <textarea
                            name="notes"
                            rows="4"
                            className="glass-input bg-[#050a06]/80 resize-none"
                            placeholder="Input tactical data, background parameters, or specific conditions..."
                            value={formData.notes}
                            onChange={handleChange}
                        ></textarea>
                    </motion.div>

                    <motion.div variants={inputVariants} className="pt-6 flex items-center justify-end gap-5">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-white transition-colors"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="glass-btn-primary px-10 py-4 text-[13px] rounded-2xl"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-[#050a06]/30 border-t-[#050a06] rounded-full animate-spin"></div>
                                    Processing...
                                </div>
                            ) : (
                                'Commit Target'
                            )}
                        </button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default AddLead;
