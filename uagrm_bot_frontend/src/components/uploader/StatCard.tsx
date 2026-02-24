import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?: string;
}

export const StatCard = ({ label, value, icon: Icon, iconColor = 'text-gray-600', bgColor = 'bg-gray-100' }: StatCardProps) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 min-w-[180px]">
            <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center ${iconColor}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};
