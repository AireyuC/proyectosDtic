import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatCardProps {
    label: string;
    value: string | number;
    trend: string;
    isNegative?: boolean;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
}

export const AdminStatCard = ({ label, value, trend, isNegative, icon: Icon, iconBg, iconColor }: AdminStatCardProps) => {
    return (
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex-1">
            <div className="flex items-center space-x-5">
                <div className={`w-16 h-16 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <Icon size={30} strokeWidth={2.5} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1.5">{label}</p>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter mb-1 leading-none">{value}</p>
                    <div className="flex items-center space-x-1.5">
                        {isNegative ? (
                            <TrendingDown size={14} className="text-red-500" />
                        ) : (
                            <TrendingUp size={14} className="text-green-500" />
                        )}
                        <span className={`text-[11px] font-black ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                            {trend}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
