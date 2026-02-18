import { useState } from 'react';
import api from '@/config/axios';

export const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'Verifier'
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const payload = {
                ...formData,
                groups: [formData.role]
            };
            await api.post('/api/auth/register/', payload);
            setMessage(`User ${formData.username} created successfully!`);
            setFormData({
                username: '',
                password: '',
                email: '',
                first_name: '',
                last_name: '',
                role: 'Verifier'
            });
        } catch (err: any) {
            console.error('Create user error:', err);
            if (err.response?.data) {
                // Handle different error structures (detail vs field errors)
                const data = err.response.data;
                if (data.detail) {
                    setError(data.detail);
                } else {
                    // Combine field errors into a string
                    const fieldErrors = Object.entries(data)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join(' | ');
                    setError(fieldErrors || 'Error creating user');
                }
            } else {
                setError('Network or server error');
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <h2 className="text-xl mb-4">Create New User</h2>
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border p-2 rounded"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">First Name</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Last Name</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Role</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Verifier">Verifier</option>
                            <option value="Uploader">Uploader</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Create User
                    </button>
                </form>
            </div>
        </div>
    );
};
