import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
    ShieldCheck, 
    Cloud, 
    Settings, 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    ArrowRight 
} from 'lucide-react';

type ProfileType = 'Verificador' | 'Cargador' | 'Admin';

export const Login = () => {
    const [selectedProfile, setSelectedProfile] = useState<ProfileType>('Verificador');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            // Usar username y password para el login (el backend puede requerir solo estos)
            const response = await login({ username, password });
            const groups = response.user.groups || [];

            if (groups.includes('Admin')) {
                navigate('/admin');
            } else if (groups.includes('Verifier')) {
                navigate('/verifier');
            } else if (groups.includes('Uploader')) {
                navigate('/uploader');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Credenciales inválidas';
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
            {/* Fondo con patrón de puntos */}
            <div 
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(circle, #9ca3af 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Card principal */}
            <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-lg p-8 md:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Portal de Acceso
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Por favor, seleccione su perfil e ingrese sus credenciales.
                    </p>
                </div>

                {/* Selector de Perfil */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        PERFIL DE USUARIO
                    </label>
                    <div className="flex gap-3 justify-center">
                        {/* Botón Verificador */}
                        <button
                            type="button"
                            onClick={() => setSelectedProfile('Verificador')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                selectedProfile === 'Verificador'
                                    ? 'border-[#800000] bg-[#fff5f5]'
                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                            <ShieldCheck 
                                className={`w-6 h-6 mb-2 ${
                                    selectedProfile === 'Verificador' ? 'text-[#800000]' : 'text-gray-500'
                                }`}
                            />
                            <span className={`text-sm font-medium ${
                                selectedProfile === 'Verificador' ? 'text-[#800000]' : 'text-gray-600'
                            }`}>
                                Verificador
                            </span>
                        </button>

                        {/* Botón Cargador */}
                        <button
                            type="button"
                            onClick={() => setSelectedProfile('Cargador')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                selectedProfile === 'Cargador'
                                    ? 'border-[#800000] bg-[#fff5f5]'
                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                            <Cloud 
                                className={`w-6 h-6 mb-2 ${
                                    selectedProfile === 'Cargador' ? 'text-[#800000]' : 'text-gray-500'
                                }`}
                            />
                            <span className={`text-sm font-medium ${
                                selectedProfile === 'Cargador' ? 'text-[#800000]' : 'text-gray-600'
                            }`}>
                                Cargador
                            </span>
                        </button>

                        {/* Botón Admin */}
                        <button
                            type="button"
                            onClick={() => setSelectedProfile('Admin')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                selectedProfile === 'Admin'
                                    ? 'border-[#800000] bg-[#fff5f5]'
                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                            <Settings 
                                className={`w-6 h-6 mb-2 ${
                                    selectedProfile === 'Admin' ? 'text-[#800000]' : 'text-gray-500'
                                }`}
                            />
                            <span className={`text-sm font-medium ${
                                selectedProfile === 'Admin' ? 'text-[#800000]' : 'text-gray-600'
                            }`}>
                                Admin
                            </span>
                        </button>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-[#fee2e2] text-[#991b1b] p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Nombre de Usuario */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre de Usuario
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                placeholder="p.ej. j.perez"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                placeholder="p.ej. juan.perez@uagrm.edu.bo"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Nombre y Apellido (lado a lado) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                                placeholder="Juan"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Apellido
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                                placeholder="Pérez"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Contraseña
                            </label>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                                ¿Olvidó su contraseña?
                            </a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Recordar sesión */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 border-gray-300 rounded text-[#800000] focus:ring-[#800000]"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                            Recordar sesión en este equipo
                        </label>
                    </div>

                    {/* Botón de Iniciar Sesión */}
                    <button
                        type="submit"
                        className="w-full bg-[#800000] hover:bg-[#700000] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                        <span>Iniciar Sesión</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-700 transition-colors">
                            Soporte Técnico
                        </a>
                        <span className="hidden md:inline">•</span>
                        <a href="#" className="hover:text-gray-700 transition-colors">
                            Aviso de Privacidad
                        </a>
                        <span className="hidden md:inline">•</span>
                        <span className="text-gray-500">
                            © 2024 UAGRM. Todos los derechos reservados.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
