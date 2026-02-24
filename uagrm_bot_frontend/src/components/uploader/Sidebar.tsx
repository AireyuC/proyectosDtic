import { LayoutDashboard, FileUp, BookOpen, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Panel de Control', active: true },
        { icon: FileUp, label: 'Mis Cargas' },
        { icon: BookOpen, label: 'Guías Institucionales' },
        { icon: HelpCircle, label: 'Soporte' },
    ];

    return (
        <div className="w-64 bg-uagrm-blue text-white h-screen flex flex-col fixed left-0 top-0">
            {/* Logo Section */}
            <div className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <img src="/uagrm-logo.png" alt="UAGRM" className="w-8 h-8 object-contain" onError={(e) => {
                        // Fallback icon if logo not found
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-uagrm-blue font-bold text-xs text-center">UAGRM</span>';
                    }} />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-tight uppercase">UAGRM</h1>
                    <p className="text-[10px] text-gray-300">Gestión Documental</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 mt-4 px-3 space-y-1">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${item.active
                                ? 'bg-uagrm-red text-white'
                                : 'text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
                <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white overflow-hidden">
                            {/* Placeholder image/initial */}
                            <span className="text-xl font-medium">J</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user?.username || 'Juan Perez'}</p>
                            <p className="text-[10px] text-gray-400">Rol: Cargador</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
