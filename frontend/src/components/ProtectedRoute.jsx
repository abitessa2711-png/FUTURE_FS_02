import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { admin, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#050a06]">
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-[rgba(110,231,28,0.1)]"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#6ee71c] border-r-[#6ee71c] animate-spin shadow-[0_0_20px_rgba(110,231,28,0.3)]"></div>
                </div>
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
