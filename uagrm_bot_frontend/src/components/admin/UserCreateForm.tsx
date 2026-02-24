import { UserPlus, Save, Eye } from 'lucide-react';

export const UserCreateForm = () => {
    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-4 lg:p-6 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-4 shrink-0">
                <div className="w-8 h-8 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center">
                    <UserPlus size={16} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Crear Usuario</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Datos para el nuevo registro</p>
                </div>
            </div>

            <form className="flex-1 flex flex-col justify-between overflow-hidden gap-2">
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">Username</label>
                        <input
                            type="text"
                            placeholder="usuario123"
                            className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs font-medium focus:ring-4 focus:ring-uagrm-red/5 focus:border-uagrm-red/20 outline-none transition-all w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej. Juan"
                                className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs font-medium focus:ring-4 focus:ring-uagrm-red/5 focus:border-uagrm-red/20 outline-none transition-all w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">Apellido</label>
                            <input
                                type="text"
                                placeholder="Ej. Pérez"
                                className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs font-medium focus:ring-4 focus:ring-uagrm-red/5 focus:border-uagrm-red/20 outline-none transition-all w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">Email</label>
                        <input
                            type="email"
                            placeholder="juan.perez@uagrm.edu.bo"
                            className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs font-medium focus:ring-4 focus:ring-uagrm-red/5 focus:border-uagrm-red/20 outline-none transition-all w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1">Contraseña</label>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="********"
                                className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs font-medium focus:ring-4 focus:ring-uagrm-red/5 focus:border-uagrm-red/20 outline-none transition-all w-full"
                            />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-uagrm-red transition-colors">
                                <Eye size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-2 shrink-0">
                    <button className="w-full bg-uagrm-red text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center space-x-2 shadow-sm shadow-uagrm-red/20 border-b-2 border-red-950 active:border-b-0 active:translate-y-px transition-all">
                        <Save size={16} />
                        <span>Guardar Usuario</span>
                    </button>
                </div>
            </form>
        </div>
    );
};
