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
        <div className="content-card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ marginBottom: '8px', opacity: 0.3 }}><BarChart3 size={28} /></div>
            <p style={{ fontSize: '12px', color: '#475569' }}>Process a comment to see routing decisions</p>
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
      <div className="routing-body">
        {/* Current Decision */}
        {decision && (
          <div className="routing-decision">
            {/* Model Selected */}
            <div className="routing-model-box">
              <div className="routing-label">Model Selected</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span className={`routing-dot ${decision.complexity === 'complex' ? 'amber' : 'green'}`}></span>
                <span className="routing-model-name">{decision.model || 'N/A'}</span>
              </div>
            </div>

            {/* 2x2 Grid */}
            <div className="routing-grid">
              <div className="routing-grid-item">
                <div className="routing-grid-label">Complexity</div>
                <div className={`routing-grid-value ${decision.complexity === 'complex' ? 'amber' : 'green'}`}>
                  {decision.complexity || 'N/A'}
                </div>
              </div>
              <div className="routing-grid-item">
                <div className="routing-grid-label">Latency</div>
                <div className="routing-grid-value cyan">
                  {decision.latency_ms ? `${decision.latency_ms}ms` : 'N/A'}
                </div>
              </div>
              <div className="routing-grid-item">
                <div className="routing-grid-label">Est. Cost</div>
                <div className="routing-grid-value green">
                  ${decision.estimated_cost?.toFixed(4) || '0.0000'}
                </div>
              </div>
              <div className="routing-grid-item">
                <div className="routing-grid-label">Escalated?</div>
                <div className={`routing-grid-value ${decision.escalated ? 'amber' : 'green'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {decision.escalated ? <AlertCircle size={12} /> : <span>✓</span>} {decision.escalated ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {/* Reason */}
            {decision.reason && (
              <div className="routing-reason">
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>Reason:</span> {decision.reason}
              </div>
            )}
          </div>
        )}

        {/* Aggregate Stats */}
        {analytics && (
          <div className={`routing-stats ${decision ? 'has-border' : ''}`}>
            <div className="routing-stats-title">Session Statistics</div>

            <div className="routing-stats-content">
              {/* Cheap model usage */}
              <div className="routing-stat-row">
                <span className="routing-stat-label">Cheap model usage</span>
                <span className="routing-stat-value green">{analytics.cheap_model_pct || 0}%</span>
              </div>
              <div className="routing-progress-track">
                <div className="routing-progress-fill" style={{ width: `${analytics.cheap_model_pct || 0}%` }}/>
              </div>

              {/* Cost rows */}
              <div className="routing-stat-row">
                <span className="routing-stat-label">Total cost</span>
                <span className="routing-stat-value white">${analytics.total_cost?.toFixed(4) || '0.0000'}</span>
              </div>
              <div className="routing-stat-row">
                <span className="routing-stat-label">Estimated savings</span>
                <span className="routing-stat-value green">${analytics.cost_saved?.toFixed(4) || '0.0000'}</span>
              </div>

              {/* Escalations */}
              <div className="routing-stat-row" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: '4px' }}>
                <span className="routing-stat-label">Escalations</span>
                <span className="routing-stat-value amber">{analytics.escalations || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
