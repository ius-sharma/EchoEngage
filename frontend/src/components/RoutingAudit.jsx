/**
 * RoutingAudit - CascadeFlow routing decision panel with cost tracking
 */
import { GitBranch, BarChart3, AlertCircle } from 'lucide-react';

export default function RoutingAudit({ decision, analytics }) {
  if (!decision && !analytics) {
    return (
      <div className="content-card routing-card">
        <div className="content-card-header">
          <h3>
            <GitBranch size={16} />
            Routing Audit
          </h3>
        </div>
        <div className="content-card-body flex items-center justify-center">
          <div className="text-center py-6">
            <div className="text-3xl mb-2 opacity-30"><BarChart3 size={32} /></div>
            <p className="text-xs text-gray-600">Process a comment to see routing decisions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-card routing-card">
      <div className="content-card-header">
        <h3>
          <GitBranch size={16} />
          Routing Audit
          <span className="ml-auto text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-normal border border-cyan-500/20">CascadeFlow</span>
        </h3>
      </div>
      <div className="content-card-body p-6 space-y-6">
        {/* Current Decision */}
        {decision && (
        <div className="space-y-5 mb-6 animate-fade-in">
          <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5 shadow-lg shadow-black/10">
            <div className="text-[11px] text-gray-500 font-medium mb-2">Model Selected</div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${decision.complexity === 'complex' ? 'bg-amber-400' : 'bg-green-400'}`}></span>
              <span className="text-sm font-semibold text-white">{decision.model || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 shadow-lg shadow-black/10 min-h-[96px]">
              <div className="text-[11px] text-gray-500 font-medium mb-1.5">Complexity</div>
              <div className={`text-xs font-semibold ${decision.complexity === 'complex' ? 'text-amber-400' : 'text-green-400'}`}>
                {decision.complexity || 'N/A'}
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 shadow-lg shadow-black/10 min-h-[96px]">
              <div className="text-[11px] text-gray-500 font-medium mb-1.5">Latency</div>
              <div className="text-xs font-semibold text-cyan-400">
                {decision.latency_ms ? `${decision.latency_ms}ms` : 'N/A'}
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 shadow-lg shadow-black/10 min-h-[96px]">
              <div className="text-[11px] text-gray-500 font-medium mb-1.5">Est. Cost</div>
              <div className="text-xs font-semibold text-green-400">
                ${decision.estimated_cost?.toFixed(4) || '0.0000'}
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 shadow-lg shadow-black/10 min-h-[96px]">
              <div className="text-[11px] text-gray-500 font-medium mb-1.5">Escalated?</div>
              <div className={`text-xs font-semibold flex items-center gap-1 ${decision.escalated ? 'text-amber-400' : 'text-green-400'}`}>
                {decision.escalated ? <AlertCircle size={12} /> : <span>✓</span>} {decision.escalated ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {decision.reason && (
            <div className="text-[11px] text-gray-500 bg-white/[0.02] rounded-xl p-4 border border-white/5 leading-6">
              <span className="text-gray-400 font-semibold">Reason:</span> {decision.reason}
            </div>
          )}
        </div>
      )}

      {/* Aggregate Stats */}
      {analytics && (
        <div className={`${decision ? 'border-t border-white/5 pt-5' : ''}`}>
          <div className="text-[11px] text-gray-500 font-semibold mb-4 uppercase tracking-wider">Session Statistics</div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs gap-3">
              <span className="text-gray-500 font-medium">Cheap model usage</span>
              <span className="text-green-400 font-semibold">{analytics.cheap_model_pct || 0}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-green-500/70 to-green-400 transition-all duration-700 shadow-lg"
                style={{ width: `${analytics.cheap_model_pct || 0}%` }}/>
            </div>
            <div className="flex justify-between text-xs mt-2 gap-3">
              <span className="text-gray-500 font-medium">Total cost</span>
              <span className="text-white font-semibold">${analytics.total_cost?.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="flex justify-between text-xs gap-3">
              <span className="text-gray-500 font-medium">Estimated savings</span>
              <span className="text-green-400 font-semibold">${analytics.cost_saved?.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-white/5 pt-4 mt-2 gap-3">
              <span className="text-gray-500 font-medium">Escalations</span>
              <span className="text-amber-400 font-semibold">{analytics.escalations || 0}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
