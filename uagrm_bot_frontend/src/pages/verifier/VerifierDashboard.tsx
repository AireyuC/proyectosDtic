import { useState, useEffect } from 'react';
import api from '@/config/axios';

interface Document {
    id: number;
    title: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    uploaded_at: string;
    file_url?: string;
    uploaded_by?: {
        username: string;
    }
}

export const VerifierDashboard = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [filter, setFilter] = useState('PENDING');

    const fetchDocuments = async () => {
        try {
            const response = await api.get(`/api/institutional/documents/?status=${filter}`);
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents', error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [filter]);

    const handleVerify = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.post(`/api/institutional/documents/${id}/verify/`, { status });
            // Refresh list
            fetchDocuments();
        } catch (error) {
            console.error(`Error verifying document ${id}`, error);
            alert('Error updating document status');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Verifier Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl">Pending Verification</h2>
                    <div className="space-x-2">
                        <button
                            onClick={() => setFilter('PENDING')}
                            className={`px-3 py-1 rounded ${filter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('APPROVED')}
                            className={`px-3 py-1 rounded ${filter === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => setFilter('REJECTED')}
                            className={`px-3 py-1 rounded ${filter === 'REJECTED' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            Rejected
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploader</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                                        {doc.file_url && (
                                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                                View PDF
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.uploaded_by?.username || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(doc.uploaded_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {doc.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleVerify(doc.id, 'APPROVED')}
                                                    className="text-green-600 hover:text-green-900 mr-4 font-bold"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(doc.id, 'REJECTED')}
                                                    className="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {doc.status !== 'PENDING' && (
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {doc.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
