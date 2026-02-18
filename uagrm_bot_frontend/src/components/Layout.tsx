import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow p-4">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold text-gray-800">UAGRM Bot</h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; {new Date().getFullYear()} UAGRM</p>
            </footer>
        </div>
    );
};
