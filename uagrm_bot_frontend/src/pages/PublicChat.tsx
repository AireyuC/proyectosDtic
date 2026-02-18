import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const PublicChat = () => {
    const { user } = useAuth();
    return (
        <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">UAGRM Bot</h1>
                <div className="flex gap-4">
                    {user ? (
                        <span>Welcome, {user.username}</span>
                    ) : (
                        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    )}
                </div>
            </header>
            <main>
                <section className="bg-white p-6 rounded-lg shadow h-[400px] flex flex-col justify-center">
                    <div className="messages-area flex-1 mb-4 p-4 bg-gray-50 rounded flex flex-col justify-center items-center text-center">
                        <h2 className="text-xl font-semibold mb-2">Bienvenido al asistente virtual</h2>
                        <p className="text-gray-600">
                            Para consultas públicas, por favor utiliza nuestro canal oficial de WhatsApp.
                        </p>
                    </div>
                    {user && (
                        <div className="flex justify-end pt-4 border-t">
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="text-red-600 hover:text-red-800 font-medium"
                            >
                                Ir a Login / Cerrar Sesión
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div >
    );
};

