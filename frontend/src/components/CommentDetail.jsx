/**
 * CommentDetail - Center panel showing selected comment, agent reply, and actions
 */
import { useState } from 'react';
import { Video, Camera, AlertCircle, Briefcase, MessageCircle, Zap, Flame, Lightbulb, Save, AlertTriangle, CheckCircle, Brain, ChevronDown, ChevronUp } from 'lucide-react';

function getPlatformIcon(platform) {
  const map = {
    youtube: Video,
    instagram: Camera,
    twitter: AlertCircle,
    linkedin: Briefcase,
  };
  return map[platform?.toLowerCase()] || MessageCircle;
}

function getPriorityConfig(priority) {
  const map = {
    high: { class: 'badge-vip', label: 'High Priority', desc: 'VIP / Buying Signal', icon: Flame },
    medium: { class: 'badge-repeat', label: 'Medium Priority', desc: 'Repeat Engager', icon: Zap },
    low: { class: 'badge-new', label: 'Normal', desc: 'Standard Reply', icon: MessageCircle },
  };
  return map[priority] || map.low;
}

export default function CommentDetail({ comment, result, processing, onProcess, onApprove, onRegenerate }) {
  const [showMemoryFacts, setShowMemoryFacts] = useState(false);

  if (!comment) {
    return (
      <div className="glass-card h-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-40"><MessageCircle size={48} /></div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">Select a Comment</h3>
          <p className="text-sm text-gray-600 max-w-xs">
            Choose a comment from the inbox to view details, generate AI replies, and manage relationships.
          </p>
        </div>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(result?.priority_label || comment.priority);
  const PriorityIcon = priorityConfig.icon;
  const PlatformIconComponent = getPlatformIcon(comment.platform);

  return (
    <div className="detail-card">
      {/* ── Comment Header ───────────────────── */}
      <div className="detail-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <div className="detail-avatar">
            {comment.follower_name?.charAt(0) || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="detail-name">{comment.follower_name}</div>
            <div className="detail-meta">
              <PlatformIconComponent size={13} />
              <span style={{ textTransform: 'capitalize' }}>{comment.platform}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{comment.follower_handle || '@user'}</span>
            </div>
          </div>
        </div>
        <span className={`badge ${priorityConfig.class}`} style={{ fontSize: '10px', padding: '4px 10px', flexShrink: 0 }}>
          <PriorityIcon size={11} />
          {priorityConfig.label}
        </span>
      </div>

      {/* ── Body ─────────────────────────────── */}
      <div className="detail-card-body">
        {/* Original Comment */}
        <div className="detail-section">
          <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.7 }}>{comment.message}</p>
          {comment.post_context && (
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
              on: "{comment.post_context}"
            </div>
          )}
        </div>

        {/* Process Button */}
        {!result && (
          <button
            id="process-comment-btn"
            className="btn-primary"
            style={{ width: '100%', padding: '14px 20px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={onProcess}
            disabled={processing}
          >
            {processing ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16 }}></div>
                Processing with LangGraph Agent...
              </>
            ) : (
              <>
                <Zap size={16} />
                Generate AI Reply
              </>
            )}
          </button>
        )}

        {/* Agent Result */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            {/* Classification */}
            {result.classification && (
              <div className="detail-classification">
                <div className="detail-classification-item">
                  <span className="detail-classification-label">Intent</span>
                  <span className="detail-classification-value">{result.classification.intent}</span>
                </div>
                <div className="detail-classification-item">
                  <span className="detail-classification-label">Complexity</span>
                  <span className="detail-classification-value">{result.classification.complexity}</span>
                </div>
              </div>
            )}

            {/* Suggested Reply */}
            <div className="detail-reply-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={14} /> AI-Generated Reply
                </h4>
                {result.model_used && (
                  <span style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                    {result.model_used}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {result.suggested_reply}
              </p>
            </div>

            {/* Explanation */}
            {result.explanation && (
              <div className="detail-explanation">
                <h5 style={{ fontSize: '12px', fontWeight: 600, color: '#22d3ee', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={12} /> Why this reply?
                </h5>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{result.explanation}</p>
              </div>
            )}

            {/* Memory Facts Used */}
            {result.memory_context && result.memory_context.length > 0 && (
              <div className="detail-expandable">
                <button
                  className="detail-expandable-btn"
                  onClick={() => setShowMemoryFacts(!showMemoryFacts)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Brain size={13} /> Memory facts used ({result.memory_context.length})
                  </span>
                  {showMemoryFacts ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {showMemoryFacts && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    {result.memory_context.map((fact, i) => (
                      <div key={i} className="detail-fact-item">
                        {typeof fact === 'string' ? fact : fact.content || JSON.stringify(fact)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* New Memory to Save */}
            {result.memory_updates && result.memory_updates.length > 0 && (
              <div className="detail-memory-save">
                <h5 style={{ fontSize: '12px', fontWeight: 600, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={13} /> New facts to remember
                </h5>
                {result.memory_updates.map((update, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px', lineHeight: 1.5 }}>
                    <span style={{ color: '#34d399', fontWeight: 700, flexShrink: 0 }}>+</span>
                    <span>{typeof update === 'string' ? update : update.content || JSON.stringify(update)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quality Gate */}
            {result.quality_gate_result && (
              <div className={`detail-quality ${result.quality_gate_result.passed ? 'passed' : 'warning'}`}>
                {result.quality_gate_result.passed ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                <span>Quality: {result.quality_gate_result.score || 'N/A'}/10</span>
                {result.quality_gate_result.escalated && <span>(escalated to stronger model)</span>}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '8px' }}>
              {!result.approved ? (
                <>
                  <button
                    id="approve-reply-btn"
                    className="btn-primary"
                    style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, fontSize: '13px' }}
                    onClick={onApprove}
                  >
                    <CheckCircle size={15} /> Approve & Send
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, padding: '14px', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={onRegenerate || onProcess}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="spinner" style={{ width: 14, height: 14 }}></div>
                        Regenerating...
                      </>
                    ) : (
                      '🔄 Regenerate'
                    )}
                  </button>
                </>
              ) : (
                <div className="detail-approved">
                  ✅ Reply Approved & Sent
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontWeight: 400, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '13px' }}>ℹ️</span> This is just a demo — real integration coming soon!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
