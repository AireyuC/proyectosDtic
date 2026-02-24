import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface UserItem {
    id: string;
    username: string;
    email: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const roleStyles: Record<string, string> = {
    'DOCENTE': 'bg-blue-50 text-blue-600',
    'AUXILIAR': 'bg-orange-50 text-orange-600',
    'DIRECTIVO': 'bg-purple-50 text-purple-600',
};

export const RecentUsersTable = () => {
    const users: UserItem[] = [
        { id: '1', username: 'mcondori', email: 'm.condori@uagrm.edu.bo', role: 'DOCENTE', status: 'ACTIVE' },
        { id: '2', username: 'rsuarez', email: 'r.suarez@uagrm.edu.bo', role: 'AUXILIAR', status: 'ACTIVE' },
        { id: '3', username: 'lcastillo', email: 'l.castillo@uagrm.edu.bo', role: 'DIRECTIVO', status: 'INACTIVE' },
    ];

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden h-full flex flex-col min-w-0 min-h-0">
            <div className="p-4 lg:p-6 pb-2 lg:pb-4 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Usuarios Recientes</h2>
                    <p className="text-[11px] text-gray-400 font-bold">Mostrando los últimos registros del sistema</p>
                </div>
                <button className="flex items-center space-x-2 text-[10px] font-black text-uagrm-red uppercase tracking-widest hover:bg-red-50 px-3 py-2 rounded-xl transition-all">
                    <Filter size={14} />
                    <span>Filtrar Resultados</span>
                </button>
            </div>

            <div className="flex-1 w-full overflow-hidden min-w-0 min-h-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/30">
                            <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usuario</th>
                            <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                            <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rol</th>
                            <th className="px-4 lg:px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/20 transition-colors">
                                <td className="px-4 lg:px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 uppercase shrink-0">
                                            {user.username.slice(0, 2)}
                                        </div>
                                        <span className="text-sm font-black text-slate-800 tracking-tight">{user.username}</span>
                                    </div>
                                </td>
                                <td className="px-4 lg:px-6 py-4">
                                    <span className="text-xs font-bold text-gray-400 truncate max-w-[150px] block">{user.email}</span>
                                </td>
                                <td className="px-4 lg:px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${roleStyles[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 lg:px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        <span className={`text-[11px] font-black ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>
                                            {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50/30 px-4 lg:px-6 py-4 flex justify-between items-center border-t border-gray-50 shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Mostrando 1-3 de 12,450 usuarios
                </p>
                <div className="flex space-x-2">
                    <button className="w-7 h-7 lg:w-8 lg:h-8 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white transition-all">
                        <ChevronLeft size={14} />
                    </button>
                    <button className="w-7 h-7 lg:w-8 lg:h-8 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white transition-all">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
