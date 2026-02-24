import { useState, useEffect } from 'react';
import { Search, Bell, Settings, Filter, Download, Hourglass, CheckCircle2, AlertCircle } from 'lucide-react';
import { VerifierSidebar } from '@/components/verifier/VerifierSidebar';
import { VerifierStatCard } from '@/components/verifier/VerifierStatCard';
import { RequestsTable } from '@/components/verifier/RequestsTable';

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

export const VerifierDashboard = () => {
    const [requests, setRequests] = useState<Request[]>([]);

    const fetchRequests = async () => {
        try {
            // Simulated API response to match the design for now
            // In a real scenario, we would map the backend data here
            const mockData: Request[] = [
                {
                    id: '10293',
                    postulante: { name: 'Juan Pérez Vaca', carrera: 'Ingeniería de Sistemas' },
                    documento: { name: 'Certificado de Notas.pdf' },
                    fecha: 'Hoy',
                    hora: '09:45 AM'
                },
                {
                    id: '10294',
                    postulante: { name: 'Maria Garcia Soliz', carrera: 'Contaduría Pública' },
                    documento: { name: 'Titulo_Academico.pdf', isUrgent: true },
                    fecha: 'Ayer',
                    hora: '04:20 PM'
                },
                {
                    id: '10295',
                    postulante: { name: 'Carlos Rojas Méndez', carrera: 'Derecho' },
                    documento: { name: 'Plan_de_Estudios_2024.pdf' },
                    fecha: '12 Oct',
                    hora: '2023'
                },
                {
                    id: '10296',
                    postulante: { name: 'Ana Belén Justiniano', carrera: 'Medicina' },
                    documento: { name: 'Cedula_Identidad_Postulante.pdf' },
                    fecha: '11 Oct',
                    hora: '2023'
                }
            ];
            setRequests(mockData);
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
            <VerifierSidebar />

            <main className="ml-72 w-[calc(100%-18rem)] p-4 lg:p-6 h-screen overflow-hidden flex flex-col text-sm">
                {/* Top Navbar */}
                <header className="flex justify-between items-center mb-6 shrink-0">
                    <div className="relative w-1/2 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, ID o documento..."
                            className="w-full bg-[#F1F5F9] border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-gray-200 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative text-gray-400 hover:text-slate-700 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button className="text-gray-400 hover:text-slate-700 transition-colors">
                            <Settings size={22} />
                        </button>
                    </div>
                </header>

                {/* Page Title & Actions */}
                <div className="flex justify-between items-start mb-6 shrink-0">
                    <div>
                        <h1 className="text-[2rem] font-black text-[#1E293B] tracking-tight leading-none">Gestión de Solicitudes</h1>
                        <p className="text-[#64748B] text-sm font-semibold mt-2">Valide y procese los documentos académicos cargados por los postulantes.</p>
                    </div>

                    <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-gray-50 transition-all">
                            <Filter size={16} className="text-gray-500" />
                            <span>Filtrar</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-gray-50 transition-all">
                            <Download size={16} className="text-gray-500" />
                            <span>Exportar CSV</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4 mb-4 shrink-0 w-full">
                    <VerifierStatCard
                        label="Pendientes Hoy"
                        value="24"
                        trend="+12%"
                        icon={Hourglass}
                        bgColor="bg-red-50/50"
                        iconColor="text-uagrm-red"
                        isActive={true}
                    />
                    <VerifierStatCard
                        label="Procesados"
                        value="145"
                        icon={CheckCircle2}
                        bgColor="bg-[#EDF2F7]"
                        iconColor="text-[#4A5568]"
                    />
                    <VerifierStatCard
                        label="Urgentes"
                        value="03"
                        icon={AlertCircle}
                        bgColor="bg-yellow-50"
                        iconColor="text-yellow-500"
                    />
                </div>

                {/* Main Table */}
                <div className="flex-1 min-h-0 min-w-0 w-full">
                    <RequestsTable requests={requests} />
                </div>

                {/* Footer Brand */}
                <footer className="mt-auto pt-2 text-center shrink-0">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] truncate">Universidad Autónoma Gabriel René Moreno</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest truncate">© 2024 Departamento de Registro y Archivo Académico. Todos los derechos reservados.</p>
                </footer>
            </main>
        </div>
    );
};
