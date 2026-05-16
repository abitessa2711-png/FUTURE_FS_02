import { motion, AnimatePresence } from 'framer-motion';

const DeleteModal = ({ isOpen, onClose, onConfirm, leadName, isDeleting }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#050816]/90 backdrop-blur-md"
                        onClick={!isDeleting ? onClose : undefined}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="bg-[#0a140d] border border-red-500/20 rounded-2xl p-8 w-full max-w-md shadow-[0_20px_60px_rgba(239,68,68,0.08)] pointer-events-auto relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

                            <div className="flex flex-col text-left">
                                <h3 className="text-lg font-bold text-white mb-2">Delete Prospect?</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    You are about to permanently remove <span className="text-white font-semibold">{leadName}</span> from the pipeline. This action cannot be undone.
                                </p>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-[#030510] hover:bg-white/5 text-gray-300 rounded-xl text-sm font-semibold transition-colors border border-white/10 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        'Confirm Deletion'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;
