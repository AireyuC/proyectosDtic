import { Link } from 'react-router-dom';

export const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
            <p className="text-xl mb-8">You do not have permission to access this page.</p>
            <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
                Go back to Home
            </Link>
        </div>
    );
};
