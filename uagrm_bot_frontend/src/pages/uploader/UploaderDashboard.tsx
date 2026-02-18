import { useState, useEffect } from 'react';
import api from '@/config/axios';

interface Document {
    id: number;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    uploaded_at: string;
    file_url?: string;
}

export const UploaderDashboard = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/api/institutional/documents/');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents', error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);

        try {
            await api.post('/api/institutional/documents/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Document uploaded successfully!');
            setTitle('');
            setFile(null);
            fetchDocuments();
        } catch (error) {
            console.error('Error uploading document', error);
            setMessage('Error uploading document.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Uploader Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl mb-4">Upload New Document</h2>
                    {message && <div className={`p-3 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">PDF File</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                className="w-full border p-2 rounded"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                            Upload Document
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl mb-4">My Uploads</h2>
                    {documents.length === 0 ? (
                        <p className="text-gray-500">No documents uploaded yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {documents.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="px-4 py-2 whitespace-nowrap">{doc.title}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(doc.uploaded_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
