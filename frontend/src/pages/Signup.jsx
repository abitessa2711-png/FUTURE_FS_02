import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Starfield from '../components/Starfield';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, error, setError, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    // Basic password strength validation
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

    useEffect(() => {
        setError(''); // Clear errors on mount
    }, [setError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        if (strength < 2) {
            setError('Password is too weak. Please use a stronger password.');
            return;
        }

        const success = await register(name, email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    const handleGoogleSignup = async () => {
        if (googleLogin) {
            const success = await googleLogin();
            if (success) navigate('/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#050a06] aurora-bg animate-aurora">
            
            <Starfield density="normal" />
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#6ee71c] opacity-[0.04] blur-[120px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[#6ee71c] opacity-[0.03] blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[420px] p-6 relative z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 mx-auto bg-[#0a140d] border border-[#6ee71c]/40 rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(110,231,28,0.15)] mb-6"
                    >
                        <div className="w-6 h-6 bg-[#6ee71c] rounded-md shadow-[0_0_15px_rgba(110,231,28,0.8)]"></div>
                    </motion.div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 text-sm font-medium">Start your free 14-day trial.</p>
                </div>

                <div className="glass-panel p-8 relative overflow-hidden bg-[#0a140d]/80 rounded-3xl">
                    
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                className="glass-input bg-[#050a06]/80 border-[rgba(110,231,28,0.1)] text-sm w-full py-4 rounded-xl"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                className="glass-input bg-[#050a06]/80 border-[rgba(110,231,28,0.1)] text-sm w-full py-4 rounded-xl"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                className="glass-input bg-[#050a06]/80 border-[rgba(110,231,28,0.1)] text-sm w-full py-4 rounded-xl"
                                placeholder="Create Password"
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

                        <button
                            type="submit"
                            className="w-full py-4 glass-btn-primary mt-6 text-[15px] rounded-xl"
                        >
                            Create Account
                        </button>
                        
                        <div className="relative flex items-center py-5">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">or sign up with</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="w-full py-3.5 bg-[#050a06] hover:bg-white/5 border border-white/10 hover:border-[#6ee71c]/30 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-between px-4">
                    <span className="text-sm font-medium text-gray-500">Already have an account?</span>
                    <Link to="/login" className="text-sm font-bold text-[#6ee71c] hover:text-[#8cf53a] transition-colors">
                        Sign In instead
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
