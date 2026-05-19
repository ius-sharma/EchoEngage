/**
 * CommentDetail - Center panel with pipeline animation, memory toggle, editable reply
 */
import { useState, useEffect } from 'react';
import { Video, Camera, AlertCircle, Briefcase, MessageCircle, Zap, Flame, Lightbulb, Save, AlertTriangle, CheckCircle, Brain, ChevronDown, ChevronUp, Search, ClipboardList, GitBranch, PenTool, Shield, Database, Edit3, Eye, EyeOff } from 'lucide-react';

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

// Pipeline step definitions
const PIPELINE_STEPS = [
  { key: 'recall_memory', label: 'Recalling Memory', icon: Search, desc: 'Searching Hindsight for follower history' },
  { key: 'classify_comment', label: 'Classifying Comment', icon: ClipboardList, desc: 'Analyzing intent, complexity & priority' },
  { key: 'route_model', label: 'Routing Model', icon: GitBranch, desc: 'CascadeFlow selecting optimal model' },
  { key: 'generate_reply', label: 'Generating Reply', icon: PenTool, desc: 'Crafting personalized response' },
  { key: 'quality_gate', label: 'Quality Gate', icon: Shield, desc: 'Evaluating reply quality' },
  { key: 'retain_memory', label: 'Saving Memory', icon: Database, desc: 'Storing new facts in Hindsight' },
];

function PipelineAnimation({ steps, currentStep }) {
  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <span className="pipeline-title">⚡ LangGraph Pipeline</span>
        <span className="pipeline-subtitle">6-Node Agent Processing</span>
      </div>
      <div className="pipeline-steps">
        {PIPELINE_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const completed = steps[step.key];
          const isActive = currentStep === step.key;
          const isPending = !completed && !isActive;
          
          return (
            <div
              key={step.key}
              className={`pipeline-step ${completed ? 'done' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="pipeline-step-icon">
                {completed ? (
                  <CheckCircle size={16} className="pipeline-check" />
                ) : isActive ? (
                  <div className="pipeline-spinner" />
                ) : (
                  <StepIcon size={16} />
                )}
              </div>
              <div className="pipeline-step-content">
                <div className="pipeline-step-label">{step.label}</div>
                {completed && steps[step.key].preview ? (
                  <div className="pipeline-step-preview">{steps[step.key].preview}</div>
                ) : isActive ? (
                  <div className="pipeline-step-desc">{step.desc}</div>
                ) : null}
              </div>
              {idx < PIPELINE_STEPS.length - 1 && <div className="pipeline-connector" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Generic reply for "without memory" comparison
function getGenericReply(followerName) {
  return `Thanks for your comment, ${followerName}! I really appreciate you taking the time to share your thoughts. Feel free to reach out anytime!`;
}

export default function CommentDetail({ comment, result, processing, pipelineSteps, currentPipelineStep, onProcess, onApprove, onRegenerate }) {
  const [showMemoryFacts, setShowMemoryFacts] = useState(false);
  const [showWithMemory, setShowWithMemory] = useState(true);
  const [editedReply, setEditedReply] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Sync editedReply when result changes
  useEffect(() => {
    if (result?.suggested_reply) {
      setEditedReply(result.suggested_reply);
      setIsEditing(false);
    }
  }, [result?.suggested_reply]);

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
  const hasMemory = result?.memory_context && result.memory_context !== "No previous memories found for this follower." && result.memory_context.length > 0;

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

        {/* Process Button — with Pipeline Animation */}
        {!result && (
          processing ? (
            <PipelineAnimation steps={pipelineSteps || {}} currentStep={currentPipelineStep} />
          ) : (
            <button
              id="process-comment-btn"
              className="btn-primary"
              style={{ width: '100%', padding: '14px 20px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={onProcess}
              disabled={processing}
            >
              <Zap size={16} />
              Generate AI Reply
            </button>
          )
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

            {/* ── Memory Impact Toggle ────────────── */}
            <div className="memory-toggle-bar">
              <button
                className={`memory-toggle-btn ${!showWithMemory ? 'active-off' : ''}`}
                onClick={() => setShowWithMemory(false)}
              >
                <EyeOff size={13} />
                Without Memory
              </button>
              <button
                className={`memory-toggle-btn ${showWithMemory ? 'active-on' : ''}`}
                onClick={() => setShowWithMemory(true)}
              >
                <Brain size={13} />
                With Memory
                {hasMemory && <span className="memory-badge-dot" />}
              </button>
            </div>

            {/* Suggested Reply */}
            <div className={`detail-reply-box ${showWithMemory ? 'with-memory' : 'without-memory'}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: showWithMemory ? '#93c5fd' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={14} />
                  {showWithMemory ? '🧠 Memory-Powered Reply' : '⚪ Generic Reply (No Memory)'}
                </h4>
                {showWithMemory && !result.approved && (
                  <button
                    className="edit-toggle-btn"
                    onClick={() => setIsEditing(!isEditing)}
                    title={isEditing ? 'Preview' : 'Edit reply'}
                  >
                    {isEditing ? <Eye size={13} /> : <Edit3 size={13} />}
                    {isEditing ? 'Preview' : 'Edit'}
                  </button>
                )}
              </div>

              {showWithMemory ? (
                isEditing ? (
                  <textarea
                    className="reply-textarea"
                    value={editedReply}
                    onChange={(e) => setEditedReply(e.target.value)}
                    rows={5}
                  />
                ) : (
                  <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {editedReply || result.suggested_reply}
                  </p>
                )
              ) : (
                <div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, fontStyle: 'italic' }}>
                    {getGenericReply(comment.follower_name)}
                  </p>
                  <div className="memory-impact-note">
                    <Brain size={12} />
                    <span>Toggle "With Memory" to see how Hindsight personalizes this reply using past interactions</span>
                  </div>
                </div>
              )}
            </div>

            {/* Only show these sections when memory toggle is ON */}
            {showWithMemory && (
              <>
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
                        <Brain size={13} /> Memory facts used ({typeof result.memory_context === 'string' ? '1' : result.memory_context.length})
                      </span>
                      {showMemoryFacts ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    {showMemoryFacts && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                        {Array.isArray(result.memory_context) ? result.memory_context.map((fact, i) => (
                          <div key={i} className="detail-fact-item">
                            {typeof fact === 'string' ? fact : fact.content || JSON.stringify(fact)}
                          </div>
                        )) : (
                          <div className="detail-fact-item">{result.memory_context}</div>
                        )}
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
              </>
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
                    onClick={() => onApprove(editedReply !== result.suggested_reply ? editedReply : null)}
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
