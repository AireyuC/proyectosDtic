import { FileText, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface Request {
    id: string;
    postulante: {
        name: string;
        carrera: string;
        avatar?: string;
    };
    documento: {
        name: string;
        isUrgent?: boolean;
    };
    fecha: string;
    hora: string;
}

interface RequestsTableProps {
    requests: Request[];
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
    onView?: (id: string) => void;
}

export const RequestsTable = ({ requests, onAccept, onReject, onView }: RequestsTableProps) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-2 lg:px-4 py-4 text-[10px] xl:text-[11px] font-black text-gray-400 uppercase tracking-widest min-w-[60px]">ID</th>
                            <th className="px-2 lg:px-4 py-4 text-[10px] xl:text-[11px] font-black text-gray-400 uppercase tracking-widest">Postulante</th>
                            <th className="px-2 lg:px-4 py-4 text-[10px] xl:text-[11px] font-black text-gray-400 uppercase tracking-widest w-1/3">Documento</th>
                            <th className="px-2 lg:px-4 py-4 text-[10px] xl:text-[11px] font-black text-gray-400 uppercase tracking-widest min-w-[90px]">Fecha Envío</th>
                            <th className="px-2 lg:px-4 py-4 text-[10px] xl:text-[11px] font-black text-gray-400 uppercase tracking-widest text-center min-w-[200px]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/80">
                        {requests.map((req) => (
                            <tr key={req.id} className="group hover:bg-gray-50/30 transition-colors duration-200">
                                <td className="px-2 lg:px-4 py-4 text-xs lg:text-sm font-bold text-gray-500 whitespace-nowrap">
                                    #{req.id}
                                </td>
                                <td className="px-2 lg:px-4 py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-[#EDF2F7] rounded-full flex items-center justify-center overflow-hidden">
                                            {req.postulante.avatar ? (
                                                <img src={req.postulante.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-black text-[#4A5568] uppercase">
                                                    {req.postulante.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{req.postulante.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{req.postulante.carrera}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-2 lg:px-4 py-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-0.5 text-uagrm-red shrink-0">
                                            <FileText size={18} strokeWidth={2} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs lg:text-sm font-bold text-slate-700 leading-tight truncate max-w-[120px] lg:max-w-[200px] xl:max-w-xs" title={req.documento.name}>
                                                {req.documento.name}
                                            </p>
                                            {req.documento.isUrgent && (
                                                <span className="inline-block mt-1.5 bg-red-100 text-uagrm-red text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                                    Urgente
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-2 lg:px-4 py-4 whitespace-nowrap">
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">{req.fecha},</p>
                                        <p className="text-sm text-slate-700 font-bold mt-0.5">{req.hora}</p>
                                    </div>
                                </td>
                                <td className="px-2 lg:px-4 py-4">
                                    <div className="flex items-center justify-center space-x-1.5 xl:space-x-2">
                                        <button
                                            onClick={() => onView?.(req.id)}
                                            className="w-8 h-8 bg-[#EDF2F7] text-[#4A5568] rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all shrink-0"
                                        >
                                            <Eye size={16} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => onAccept?.(req.id)}
                                            className="px-2.5 xl:px-4 py-2 bg-uagrm-red text-white text-[10px] xl:text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all hover:bg-red-900 shrink-0"
                                        >
                                            <Check size={14} strokeWidth={3} />
                                            <span>Aceptar</span>
                                        </button>
                                        <button
                                            onClick={() => onReject?.(req.id)}
                                            className="px-2.5 xl:px-4 py-2 bg-white border border-gray-200 text-slate-700 text-[10px] xl:text-xs font-bold rounded-lg flex items-center space-x-1.5 hover:bg-gray-50 transition-all shrink-0"
                                        >
                                            <X size={14} strokeWidth={3} />
                                            <span>Rechazar</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="bg-white px-4 lg:px-6 py-4 flex justify-between items-center border-t border-gray-100 shrink-0">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                    Mostrando 4 de 24 resultados
                </p>
                <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-white border border-gray-200 text-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all">
                        <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                    <button className="w-8 h-8 bg-uagrm-red text-white text-xs font-bold rounded-lg">1</button>
                    <button className="w-8 h-8 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all">2</button>
                    <button className="w-8 h-8 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all">3</button>
                    <button className="w-8 h-8 bg-white border border-gray-200 text-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all">
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};
