import { Search, Bell, Users, FolderUp, CheckCircle2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { UserCreateForm } from '@/components/admin/UserCreateForm';
import { RecentUsersTable } from '@/components/admin/RecentUsersTable';

export const AdminDashboard = () => {
    return (
        <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
            <AdminSidebar />

            <main className="ml-72 w-[calc(100%-18rem)] p-4 lg:p-6 h-screen overflow-hidden flex flex-col">
                {/* Header Navbar */}
                <header className="flex justify-between items-center gap-4 mb-4 shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar expedientes, usuarios o registros..."
                            className="w-full bg-[#F1F5F9]/60 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-uagrm-red/5 outline-none transition-all placeholder:text-gray-400/80"
                        />
                    </div>

                    <div className="flex items-center space-x-6 shrink-0">
                        <div className="relative cursor-pointer group">
                            <div className="text-slate-700 hover:text-uagrm-red transition-colors">
                                <Bell size={24} />
                            </div>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F8FAFC] shadow-lg shadow-red-500/20"></span>
                        </div>
                        <div className="text-right border-l pl-8 border-gray-200">
                            <p className="text-sm font-black text-slate-800 leading-tight tracking-tighter">Martes, 24 Oct</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">UAGRM Santa Cruz</p>
                        </div>
                    </div>
                </header>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-4 shrink-0 w-full">
                    <AdminStatCard
                        label="Total Usuarios"
                        value="12,450"
                        trend="+2.5% este mes"
                        icon={Users}
                        iconBg="bg-red-50"
                        iconColor="text-uagrm-red"
                    />
                    <AdminStatCard
                        label="Archivos Subidos"
                        value="856"
                        trend="-1.2% hoy"
                        isNegative={true}
                        icon={FolderUp}
                        iconBg="bg-blue-50"
                        iconColor="text-uagrm-blue"
                    />
                    <AdminStatCard
                        label="Verificaciones Hoy"
                        value="42"
                        trend="+15% vs ayer"
                        icon={CheckCircle2}
                        iconBg="bg-green-50"
                        iconColor="text-green-600"
                    />
                </div>

                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 min-w-0">
                    <div className="col-span-4 flex flex-col min-h-0 min-w-0">
                        <UserCreateForm />
                    </div>
                    <div className="col-span-8 flex flex-col min-h-0 min-w-0 overflow-hidden">
                        <RecentUsersTable />
                    </div>
                </div>

                {/* Decorative Footer */}
                <footer className="mt-auto pt-2 border-t border-gray-100 flex justify-between items-center shrink-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:block text-truncate">
                        © 2024 UAGRM - Sistema de Gestión Administrativa. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Servidor Online</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Conexión Segura</span>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};
