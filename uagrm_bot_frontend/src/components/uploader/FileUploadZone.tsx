import { FileUp } from 'lucide-react';

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
}

export const FileUploadZone = ({ onFileSelect }: FileUploadZoneProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Subir Nuevo Documento</h2>
                <span className="text-[10px] font-bold text-uagrm-red bg-red-50 px-2 py-1 rounded uppercase tracking-wider">
                    Información Institucional
                </span>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center transition-colors hover:border-uagrm-red/50 group"
            >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 relative">
                    <FileUp className="text-uagrm-red" size={32} />
                    <div className="absolute -top-1 -right-1 bg-uagrm-red text-white text-[8px] font-bold px-1 rounded">PDF</div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    Arrastra y suelta tu archivo PDF aquí
                </h3>
                <p className="text-gray-500 text-sm mb-8 text-center max-w-sm">
                    Asegúrate de que el documento esté firmado y tenga el formato institucional vigente.
                </p>

                <label className="cursor-pointer bg-uagrm-red text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-uagrm-red/20">
                    <FileUp size={18} />
                    <span>Seleccionar Archivo</span>
                    <input
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                </label>

                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Máximo 20MB • Formato PDF
                </p>
            </div>
        </div>
    );
};
