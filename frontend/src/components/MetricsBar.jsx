/**
 * MetricsBar - Top dashboard metrics row
 */
import { MessageCircle, CheckCircle, Star, DollarSign, Zap } from 'lucide-react';

export default function MetricsBar({ analytics }) {
  const metrics = [
    {
      label: 'Total Comments',
      value: analytics?.total_comments || 0,
      icon: MessageCircle,
      color: 'from-blue-500/20 to-blue-500/5',
    },
    {
      label: 'Processed',
      value: analytics?.processed_comments || 0,
      icon: CheckCircle,
      color: 'from-green-500/20 to-green-500/5',
    },
    {
      label: 'VIP Followers',
      value: analytics?.priority_breakdown?.['VIP Follower'] || 0,
      icon: Star,
      color: 'from-amber-500/20 to-amber-500/5',
    },
    {
      label: 'Cost Saved',
      value: `$${(analytics?.routing?.savings || 0).toFixed(3)}`,
      icon: DollarSign,
      color: 'from-cyan-500/20 to-cyan-500/5',
      subtitle: analytics?.routing?.savings_percentage
        ? `${analytics.routing.savings_percentage}% savings`
        : null,
    },
    {
      label: 'Avg Latency',
      value: `${(analytics?.routing?.avg_latency_ms || 0).toFixed(0)}ms`,
      icon: Zap,
      color: 'from-rose-500/20 to-rose-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {metrics.map((m, i) => {
        const IconComponent = m.icon;
        return (
          <div key={i} className={`metric-card bg-gradient-to-br ${m.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <IconComponent size={18} />
              <span className="text-xs text-gray-400 font-medium">{m.label}</span>
            </div>
            <div className="text-2xl font-bold">{m.value}</div>
            {m.subtitle && (
              <div className="text-xs text-green-400 mt-1">{m.subtitle}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
