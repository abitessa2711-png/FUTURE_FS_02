import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import Starfield from './Starfield';

const AppLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#050a06] aurora-bg animate-aurora relative overflow-hidden font-sans">
            
            {/* Cinematic Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <Starfield density="normal" />
                {/* Floating energy waves */}
                <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(110,231,28,0.05)_0%,transparent_70%)] blur-[120px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[radial-gradient(ellipse_at_center,rgba(110,231,28,0.03)_0%,transparent_70%)] blur-[120px] rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
                
                {/* Micro-particles / Light streaks (simulated via grain) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
                
                {/* Vignette effect for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,12,7,0.9)_100%)]"></div>
            </div>

            <Sidebar />
            
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar scroll-smooth">
                {/* Page Transition Wrapper */}
                <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default AppLayout;
