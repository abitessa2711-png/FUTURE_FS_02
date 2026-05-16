import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Mock backend call
        setTimeout(() => setSubmitted(true), 1000);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#050a06] aurora-bg animate-aurora">
            <Starfield density="normal" />
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#6ee71c] opacity-[0.04] blur-[120px] rounded-full animate-float"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[420px] p-6 relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 mx-auto bg-[#0a140d] border border-[#6ee71c]/40 rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(110,231,28,0.15)] mb-6"
                    >
                        <svg className="w-6 h-6 text-[#6ee71c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </motion.div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">Reset Password</h2>
                    <p className="text-gray-400 text-sm font-medium">Enter your email to receive a reset link.</p>
                </div>

                <div className="glass-panel p-8 relative overflow-hidden bg-[#0a140d]/80 rounded-3xl">
                    {submitted ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto bg-[#6ee71c]/10 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-[#6ee71c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Check your email</h3>
                            <p className="text-gray-400 text-sm mb-6">We've sent a password reset link to {email}</p>
                            <Link to="/login" className="w-full block py-4 glass-btn-outline mt-2 text-[15px] rounded-xl font-bold">
                                Return to Login
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    required
                                    className="glass-input bg-[#050a06]/80 border-[rgba(110,231,28,0.1)] text-sm w-full py-4 rounded-xl"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 glass-btn-primary mt-6 text-[15px] rounded-xl"
                            >
                                Send Reset Link
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-[#6ee71c] transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
