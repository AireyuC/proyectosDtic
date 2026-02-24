import { useState, useEffect } from 'react';
import api from '@/config/axios';
import { Search, Bell, FileText, CheckCircle2, MessageSquare } from 'lucide-react';
import { Sidebar } from '@/components/uploader/Sidebar';
import { StatCard } from '@/components/uploader/StatCard';
import { FileUploadZone } from '@/components/uploader/FileUploadZone';
import { RecentUploadsTable } from '@/components/uploader/RecentUploadsTable';

interface Document {
    id: number;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    uploaded_at: string;
    file_url?: string;
    category: string;
    size?: string;
}

export const UploaderDashboard = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [message, setMessage] = useState('');

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/api/institutional/documents/');
            // Adding mock data to match the design for display
            const docs = response.data.map((doc: any) => ({
                ...doc,
                category: doc.category || 'Normativas',
                size: doc.size || '4.2 MB',
                uploaded_at: new Date(doc.uploaded_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
            }));
            setDocuments(docs);
        } catch (error) {
            console.error('Error fetching documents', error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('title', file.name.split('.')[0]);
        formData.append('file', file);

        try {
            await api.post('/api/institutional/documents/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Documento subido con éxito!');
            fetchDocuments();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error uploading document', error);
            setMessage('Error al subir el documento.');
        }
    };

    const stats = {
        total: documents.length,
        approved: documents.filter(d => d.status === 'APPROVED').length,
        pending: documents.filter(d => d.status === 'PENDING').length
    };

    return (
        <div className="flex h-screen w-full bg-uagrm-bg overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 overflow-hidden h-screen flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            className="w-full bg-gray-100/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-uagrm-red/20 outline-none transition-shadow"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative cursor-pointer">
                            <div className="bg-gray-100 p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
                                <Bell size={20} />
                            </div>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-800">Facultad de Tecnología</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Departamento Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">Bienvenido, Juan</h1>
                        <p className="text-gray-500 text-sm">Panel de gestión de carga documental institucional</p>
                    </div>

                    <div className="flex space-x-4">
                        <StatCard
                            label="Total Subidos"
                            value={stats.total || 42}
                            icon={FileText}
                            bgColor="bg-red-50"
                            iconColor="text-uagrm-red"
                        />
                        <StatCard
                            label="Aprobados"
                            value={stats.approved || 38}
                            icon={CheckCircle2}
                            bgColor="bg-green-50"
                            iconColor="text-green-500"
                        />
                        <StatCard
                            label="Pendientes"
                            value={stats.pending || 4}
                            icon={MessageSquare}
                            bgColor="bg-orange-50"
                            iconColor="text-orange-500"
                        />
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${message.includes('Error')
                        ? 'bg-red-50 text-red-700 border-red-100'
                        : 'bg-green-50 text-green-700 border-green-100'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="flex-1 min-h-0 flex flex-col gap-6">
                    <FileUploadZone onFileSelect={handleFileUpload} />

                    <RecentUploadsTable
                        documents={documents.length > 0 ? documents : [
                            { id: 1, title: 'Reglamento_Academico_V2.pdf', size: '4.2 MB', uploaded_at: '24 Oct, 2023', category: 'Normativas', status: 'APPROVED' },
                            { id: 2, title: 'Guia_Matriculacion_2024.pdf', size: '1.8 MB', uploaded_at: 'Hace 2 horas', category: 'Manuales', status: 'PENDING' }
                        ]}
                    />
                </div>
            </main>
        </div>
    );
};
