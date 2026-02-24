import { LayoutDashboard, Users, Settings, ShieldCheck, UserCog, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminSidebar = () => {
    const { user, logout } = useAuth();

    const menuGroups = [
        {
            title: 'GENERAL',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', active: true },
                { icon: Users, label: 'Gestión de Usuarios' },
            ]
        },
        {
            title: 'SISTEMA',
            items: [
                { icon: Settings, label: 'Configuración' },
                { icon: ShieldCheck, label: 'Auditoría' },
                { icon: UserCog, label: 'Roles' },
            ]
        }
    ];

    return (
        <div className="w-72 bg-[#8B0000] text-white h-screen flex flex-col fixed left-0 top-0 z-20 shadow-2xl">
            {/* Logo Section */}
            <div className="p-8 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-inner flex items-center justify-center">
                    <GraduationCap className="text-uagrm-red" size={28} />
                </div>
                <div>
                    <h1 className="font-black text-xl leading-none tracking-tight">UAGRM</h1>
                    <p className="text-[10px] text-red-200 font-bold uppercase tracking-widest mt-1">Admin Portal</p>
                </div>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 mt-4 px-4 overflow-y-auto">
                {menuGroups.map((group, gIdx) => (
                    <div key={gIdx} className="mb-8">
                        <p className="px-5 text-[10px] font-black text-red-300/60 uppercase tracking-[0.2em] mb-4">
                            {group.title}
                        </p>
                        <nav className="space-y-1">
                            {group.items.map((item, iIdx) => (
                                <button
                                    key={iIdx}
                                    className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${item.active
                                        ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                                        : 'text-red-100/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={20} className={item.active ? 'text-white' : 'opacity-60'} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>

            {/* User Profile */}
            <div className="p-6">
                <div className="bg-black/10 rounded-3xl p-4 flex items-center justify-between border border-white/5 shadow-inner">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 bg-uagrm-blue rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg shrink-0">
                            {user?.username?.[0].toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black truncate">{user?.username || 'Administrador'}</p>
                            <p className="text-[9px] text-red-200/60 font-bold uppercase tracking-tighter">Super Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2.5 text-red-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
