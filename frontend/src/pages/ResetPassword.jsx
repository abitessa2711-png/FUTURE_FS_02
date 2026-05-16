import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength += 1;
        if (pass.length > 7) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
        return strength;
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        if (strength < 2) {
            setError('Password is too weak. Please use a stronger password.');
            return;
        }

        // Mock backend call
        setTimeout(() => {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        }, 1000);
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </motion.div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">Create New Password</h2>
                    <p className="text-gray-400 text-sm font-medium">Please enter your new password below.</p>
                </div>

                <div className="glass-panel p-8 relative overflow-hidden bg-[#0a140d]/80 rounded-3xl">
                    {success ? (
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
                            <h3 className="text-white font-bold text-lg mb-2">Password Reset Successful</h3>
                            <p className="text-gray-400 text-sm mb-6">Redirecting you to login...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div>
                                <input
                                    type="password"
                                    required
                                    className="glass-input bg-[#050a06]/80 border-[rgba(110,231,28,0.1)] text-sm w-full py-4 rounded-xl"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {password.length > 0 && (
                                    <div className="mt-2 flex gap-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-300 ${strength >= 1 ? 'w-1/4 bg-red-500' : 'w-0'}`}></div>
                                        <div className={`h-full transition-all duration-300 ${strength >= 2 ? 'w-1/4 bg-orange-500' : 'w-0'}`}></div>
                                        <div className={`h-full transition-all duration-300 ${strength >= 3 ? 'w-1/4 bg-yellow-400' : 'w-0'}`}></div>
                                        <div className={`h-full transition-all duration-300 ${strength >= 4 ? 'w-1/4 bg-[#6ee71c]' : 'w-0'}`}></div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    required
                                    className="glass-input bg-[#050a06]/80 border-[rgba(110,231,28,0.1)] text-sm w-full py-4 rounded-xl"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 glass-btn-primary mt-6 text-[15px] rounded-xl"
                            >
                                Reset Password
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
