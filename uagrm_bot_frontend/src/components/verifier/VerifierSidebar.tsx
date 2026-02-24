import { LayoutDashboard, FileText, History, BarChart3, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const VerifierSidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Panel Principal' },
        { icon: FileText, label: 'Solicitudes Pendientes', badge: 24, active: true },
        { icon: History, label: 'Historial' },
        { icon: BarChart3, label: 'Reportes' },
    ];

    return (
        <div className="w-72 bg-[#2B3653] text-white h-screen flex flex-col fixed left-0 top-0 z-20">
            {/* Logo Section */}
            <div className="p-8 flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-uagrm-red" size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none tracking-tight">UAGRM</h1>
                    <p className="text-[10px] text-gray-300 font-semibold mt-0.5">Verificador Académico</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 mt-6">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center justify-between px-8 py-4 text-sm font-semibold transition-all duration-200 group ${item.active
                            ? 'bg-[#20283E] text-white border-l-4 border-uagrm-red'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <item.icon size={20} className={`${item.active ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors duration-300`} />
                            <span>{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className="bg-uagrm-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="mt-auto">
                <div className="bg-[#26314D] p-6 pt-5">
                    <div className="flex flex-col space-y-5">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-[#35415C] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {user?.username?.[0].toUpperCase() || 'R'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold truncate text-white">{user?.username || 'Lic. Ricardo Salas'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Verificador Senior</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center space-x-3 text-gray-400 hover:text-white text-sm font-semibold transition-all"
                        >
                            <LogOut size={18} />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
