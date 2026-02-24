import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TestChatBubble } from '../components/TestChatBubble';

export const DashboardLayout = () => {
    const { user, logout, isAdmin, isVerifier, isUploader } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isSpecialRoute = location.pathname.startsWith('/uploader') ||
        location.pathname.startsWith('/verifier') ||
        location.pathname.startsWith('/admin');

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Hidden on special routes to use the new institutional design */}
            {!isSpecialRoute && (
                <div className="w-64 bg-slate-800 text-white flex flex-col">
                    <div className="p-4 text-xl font-bold border-b border-slate-700">
                        UAGRM Bot
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {isAdmin && (
                            <Link to="/admin" className="block px-4 py-2 hover:bg-slate-700 rounded transition-colors">
                                Admin Panel
                            </Link>
                        )}

                        {(isVerifier || isAdmin) && (
                            <Link to="/verifier" className="block px-4 py-2 hover:bg-slate-700 rounded transition-colors">
                                Verifier Panel
                            </Link>
                        )}

                        {(isUploader || isAdmin) && (
                            <Link to="/uploader" className="block px-4 py-2 hover:bg-slate-700 rounded transition-colors">
                                My Uploads
                            </Link>
                        )}
                    </nav>

                    <div className="p-4 border-t border-slate-700">
                        <div className="mb-4 text-sm text-slate-400">
                            Loged in as: <span className="text-white">{user?.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-100 relative">
                <Outlet />
                {(isAdmin || isVerifier) && <TestChatBubble />}
            </div>
        </div>
    );
};
