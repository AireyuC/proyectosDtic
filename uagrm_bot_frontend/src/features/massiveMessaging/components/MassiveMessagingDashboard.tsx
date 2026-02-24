import React, { useState, useEffect } from 'react';
import { massiveMessagingApi, type MockFaculty, type MockCareer, type MockStudent } from '../api/massiveMessagingApi';

export const MassiveMessagingDashboard: React.FC = () => {
    const [faculties, setFaculties] = useState<MockFaculty[]>([]);
    const [careers, setCareers] = useState<MockCareer[]>([]);
    const [students, setStudents] = useState<MockStudent[]>([]);

    const [targetType, setTargetType] = useState<string>('all');
    const [selectedFaculty, setSelectedFaculty] = useState<number | ''>('');
    const [selectedCareer, setSelectedCareer] = useState<number | ''>('');
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [message, setMessage] = useState<string>('');

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const data = await massiveMessagingApi.getFaculties();
                setFaculties(data);
            } catch (error) {
                console.error("Error fetching faculties", error);
            }
        };
        fetchFaculties();
    }, []);

    useEffect(() => {
        const fetchCareers = async () => {
            if (targetType === 'faculty' || targetType === 'career' || targetType === 'student') {
                try {
                    const data = await massiveMessagingApi.getCareers(selectedFaculty ? Number(selectedFaculty) : undefined);
                    setCareers(data);
                } catch (error) {
                    console.error("Error fetching careers", error);
                }
            }
        };
        fetchCareers();
    }, [selectedFaculty, targetType]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (targetType === 'student' && selectedCareer) {
                try {
                    const data = await massiveMessagingApi.getStudents(Number(selectedCareer));
                    setStudents(data);
                } catch (error) {
                    console.error("Error fetching students", error);
                }
            } else if (targetType === 'global_students') {
                try {
                    const data = await massiveMessagingApi.getStudents();
                    setStudents(data);
                } catch (error) {
                    console.error("Error fetching all students", error);
                }
            }
        };
        fetchStudents();
    }, [selectedCareer, targetType]);

    const handleSend = async () => {
        if (!message.trim()) {
            setFeedback({ type: 'error', text: 'El mensaje no puede estar vacío.' });
            return;
        }

        setLoading(true);
        setFeedback(null);

        let targetIds: number[] = [];
        if (targetType === 'faculty' && selectedFaculty) targetIds = [Number(selectedFaculty)];
        else if (targetType === 'career' && selectedCareer) targetIds = [Number(selectedCareer)];
        else if ((targetType === 'student' || targetType === 'global_students') && selectedStudents.length > 0) targetIds = selectedStudents;

        if ((targetType === 'student' || targetType === 'global_students') && targetIds.length === 0) {
            setFeedback({ type: 'error', text: 'Por favor, selecciona al menos un estudiante.' });
            return;
        }

        try {
            await massiveMessagingApi.sendMassiveMessage({
                // Si es global_students, el backend task.py espera target_type = 'student' con el listado de IDs 
                target_type: targetType === 'global_students' ? 'student' : targetType,
                target_ids: targetType === 'all' ? [] : targetIds,
                message: message
            });
            setFeedback({ type: 'success', text: '¡Mensajes enviados a la cola correctamente!' });
            setMessage('');
        } catch (error: any) {
            console.error("Error sending messages", error);
            setFeedback({ type: 'error', text: error.response?.data?.detail || 'Error al enviar mensajes masivos.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensajería Masiva (WhatsApp)</h1>
                <p className="text-gray-600">Simulador de envío de comunicados para emergencias y noticias.</p>
            </div>

            {feedback && (
                <div className={`p-4 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* Seleccion de publico objetivo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">¿A quién deseas enviar el mensaje?</label>
                    <select
                        value={targetType}
                        onChange={(e) => {
                            setTargetType(e.target.value);
                            setSelectedFaculty('');
                            setSelectedCareer('');
                            setSelectedStudents([]);
                            setFeedback(null);
                        }}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="all">A todos los estudiantes</option>
                        <option value="faculty">A una Facultad específica</option>
                        <option value="career">A una Carrera específica</option>
                        <option value="student">A un Estudiante (Filtrado por Carrera)</option>
                        <option value="global_students">A estudiantes específicos (Lista Completa)</option>
                    </select>
                </div>

                {/* Filtros dinámicos basados en la selección */}
                {(targetType === 'faculty' || targetType === 'career' || targetType === 'student' || targetType === 'global_students') && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Selector de Facultad */}
                        {targetType !== 'global_students' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facultad</label>
                                <select
                                    value={selectedFaculty}
                                    onChange={(e) => {
                                        setSelectedFaculty(e.target.value === '' ? '' : Number(e.target.value));
                                        setSelectedCareer('');
                                        setSelectedStudents([]);
                                    }}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Seleccione una facultad</option>
                                    {faculties.map(f => (
                                        <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Selector de Carrera */}
                        {(targetType === 'career' || targetType === 'student') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                                <select
                                    value={selectedCareer}
                                    onChange={(e) => {
                                        setSelectedCareer(e.target.value === '' ? '' : Number(e.target.value));
                                        setSelectedStudents([]);
                                    }}
                                    disabled={!selectedFaculty}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">Seleccione una carrera</option>
                                    {careers.map(c => (
                                        <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Selector de Estudiante */}
                        {(targetType === 'student' || targetType === 'global_students') && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estudiantes (Mantén Ctrl o Cmd para seleccionar varios)</label>
                                <select
                                    multiple
                                    value={selectedStudents.map(String)}
                                    onChange={(e) => {
                                        const options = Array.from(e.target.selectedOptions, option => Number(option.value));
                                        setSelectedStudents(options);
                                    }}
                                    disabled={targetType === 'student' && !selectedCareer}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 h-32"
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.registration_number} - {s.full_name} ({s.phone_number})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Composición del mensaje */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                    <textarea
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe aquí el comunicado oficial..."
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                </div>

                {/* Botón Enviar */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
                    >
                        {loading ? 'Enviando...' : 'Enviar Comunicado'}
                    </button>
                </div>

            </div>
        </div>
    );
};
