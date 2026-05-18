/**
 * RoutingAudit - CascadeFlow routing decision panel with cost tracking
 */
export default function RoutingAudit({ decision, analytics }) {
  if (!decision && !analytics) {
    return (
      <div className="glass-card h-fit">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔀</span>
          <h3 className="text-sm font-semibold text-gray-400">Routing Audit</h3>
        </div>
        <div className="text-center py-6">
          <div className="text-3xl mb-2 opacity-30">📊</div>
          <p className="text-xs text-gray-600">Process a comment to see routing decisions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card h-fit">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔀</span>
        <h3 className="text-sm font-semibold text-gray-400">Routing Audit</h3>
        <span className="ml-auto text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">CascadeFlow</span>
      </div>

      {/* Current Decision */}
      {decision && (
        <div className="space-y-3 mb-4 animate-fade-in">
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
            <div className="text-[10px] text-gray-500 mb-1.5">Model Selected</div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${decision.complexity === 'complex' ? 'bg-amber-400' : 'bg-green-400'}`}></span>
              <span className="text-sm font-medium text-white">{decision.model || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-gray-500 mb-1">Complexity</div>
              <div className={`text-xs font-medium ${decision.complexity === 'complex' ? 'text-amber-400' : 'text-green-400'}`}>
                {decision.complexity || 'N/A'}
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-gray-500 mb-1">Latency</div>
              <div className="text-xs font-medium text-cyan-400">
                {decision.latency_ms ? `${decision.latency_ms}ms` : 'N/A'}
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-gray-500 mb-1">Est. Cost</div>
              <div className="text-xs font-medium text-green-400">
                ${decision.estimated_cost?.toFixed(4) || '0.0000'}
              </div>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
              <div className="text-[10px] text-gray-500 mb-1">Escalated?</div>
              <div className={`text-xs font-medium ${decision.escalated ? 'text-amber-400' : 'text-green-400'}`}>
                {decision.escalated ? '⬆ Yes' : '✓ No'}
              </div>
            </div>
          </div>

          {decision.reason && (
            <div className="text-[10px] text-gray-500 bg-white/[0.02] rounded-lg p-2 border border-white/5">
              <span className="text-gray-400 font-medium">Reason:</span> {decision.reason}
            </div>
          )}
        </div>
      )}

      {/* Aggregate Stats */}
      {analytics && (
        <div className="border-t border-white/5 pt-3">
          <div className="text-[10px] text-gray-500 mb-2 font-medium">Session Statistics</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Cheap model usage</span>
              <span className="text-green-400 font-medium">{analytics.cheap_model_pct || 0}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-green-500/60 to-green-400 transition-all duration-700"
                style={{ width: `${analytics.cheap_model_pct || 0}%` }}/>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total cost</span>
              <span className="text-white font-medium">${analytics.total_cost?.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Estimated savings</span>
              <span className="text-green-400 font-medium">${analytics.cost_saved?.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Escalations</span>
              <span className="text-amber-400 font-medium">{analytics.escalations || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
