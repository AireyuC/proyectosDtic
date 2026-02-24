import type { LucideIcon } from 'lucide-react';

interface VerifierStatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
    isActive?: boolean;
}

export const VerifierStatCard = ({ label, value, trend, icon: Icon, iconColor, bgColor, isActive }: VerifierStatCardProps) => {
    return (
        <div className={`bg-white p-6 rounded-2xl border ${isActive ? 'border-gray-200 shadow-sm' : 'border-gray-200 shadow-sm hover:shadow-md'}`}>
            <div className="flex items-center space-x-6">
                <div className={`w-14 h-14 ${bgColor} ${iconColor} rounded-xl flex items-center justify-center`}>
                    <Icon size={24} strokeWidth={2} />
                </div>
                <div>
                    <div className="flex items-center space-x-3">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</p>
                    </div>
                    <div className="flex items-baseline space-x-2 mt-1">
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
                        {trend && (
                            <span className="text-xs font-bold text-green-500">
                                {trend}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
