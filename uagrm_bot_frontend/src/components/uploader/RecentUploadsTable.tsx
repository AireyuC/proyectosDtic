import { FileText, Eye, Download, Trash2, ArrowRight } from 'lucide-react';

interface Document {
    id: number;
    title: string;
    size?: string;
    uploaded_at: string;
    category: string;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

interface RecentUploadsTableProps {
    documents: Document[];
    onView?: (doc: Document) => void;
    onDownload?: (doc: Document) => void;
    onDelete?: (doc: Document) => void;
}

export const RecentUploadsTable = ({ documents, onView, onDownload, onDelete }: RecentUploadsTableProps) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-50 text-green-600 ring-green-500/10';
            case 'PENDING':
                return 'bg-orange-50 text-orange-600 ring-orange-500/10';
            default:
                return 'bg-red-50 text-red-600 ring-red-500/10';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'Aprobado';
            case 'PENDING': return 'Pendiente';
            case 'REJECTED': return 'Rechazado';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <h2 className="text-lg font-bold text-gray-800">Mis Cargas Recientes</h2>
                <button className="text-uagrm-red text-sm font-bold flex items-center space-x-1 hover:underline">
                    <span>Ver todo el historial</span>
                    <ArrowRight size={14} />
                </button>
            </div>

            <div className="overflow-auto flex-1 h-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Documento</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha de Carga</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categoría</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                    No hay cargas recientes para mostrar.
                                </td>
                            </tr>
                        ) : documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center text-uagrm-red">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{doc.title}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{doc.size || '0.0 MB'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600 font-medium">{doc.uploaded_at}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                        {doc.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusStyles(doc.status)}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                                        {getStatusLabel(doc.status)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end space-x-4">
                                        <button
                                            onClick={() => onView?.(doc)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDownload?.(doc)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(doc)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
