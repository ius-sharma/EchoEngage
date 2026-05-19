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

export default function CommentDetail({ comment, result, processing, onProcess, onApprove }) {
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
    <div className="glass-card p-0 overflow-hidden min-h-[720px] flex flex-col border border-slate-700/30 shadow-lg rounded-2xl">
      {/* Comment Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-lg font-bold border border-white/10 flex-shrink-0 shadow-lg shadow-blue-500/10">
              {comment.follower_name?.charAt(0) || '?'}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-base truncate">{comment.follower_name}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <PlatformIconComponent size={14} />
                <span className="capitalize">{comment.platform}</span>
                <span>•</span>
                <span className="truncate">{comment.follower_handle || '@user'}</span>
              </div>
            </div>
          </div>
          <span className={`badge ${priorityConfig.class} flex items-center gap-1 flex-shrink-0`}>
            <PriorityIcon size={12} />
            {priorityConfig.label}
          </span>
        </div>

        {/* Original Comment */}
        <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5 shadow-lg shadow-black/10">
          <p className="text-sm text-gray-200 leading-7 mb-4">{comment.message}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {comment.post_context && (
              <span className="truncate max-w-[240px]">
                on: "{comment.post_context}"
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Agent Actions */}
      <div className="p-6 space-y-6 flex-1 flex flex-col">
        {/* Process Button */}
        {!result && (
          <button
            id="process-comment-btn"
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
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
                <span className="text-xs opacity-60 ml-1">(LangGraph → Hindsight → CascadeFlow)</span>
              </>
            )}
          </button>
        )}

        {/* Agent Result */}
        {result && (
          <div className="space-y-6 animate-fade-in flex-1 flex flex-col">
            {/* Classification */}
            {result.classification && (
              <div className="flex items-center gap-3 text-xs bg-white/[0.02] rounded-lg p-4 border border-white/5">
                <span className="text-gray-500 font-medium">Intent:</span>
                <span className="badge badge-ghost text-xs">{result.classification.intent}</span>
                <span className="text-gray-500 font-medium ml-2">Complexity:</span>
                <span className="badge badge-ghost text-xs">{result.classification.complexity}</span>
              </div>
            )}

            {/* Suggested Reply */}
            <div className="bg-gradient-to-br from-blue-500/8 to-cyan-500/8 rounded-xl p-6 border border-blue-500/15 shadow-lg shadow-blue-500/5">
              <div className="flex items-center justify-between mb-4 gap-3">
                <h4 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                  <Lightbulb size={15} /> AI-Generated Reply
                </h4>
                {result.model_used && (
                  <span className="text-[11px] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    via {result.model_used}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-200 leading-7 whitespace-pre-wrap">
                {result.suggested_reply}
              </p>
            </div>

            {/* Explanation */}
            {result.explanation && (
              <div className="bg-white/[0.02] rounded-lg p-5 border border-white/5">
                <h5 className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                  <Lightbulb size={13} /> Why this reply?
                </h5>
                <p className="text-xs text-gray-400 leading-6">{result.explanation}</p>
              </div>
            )}

            {/* Memory Facts Used */}
            {result.memory_context && result.memory_context.length > 0 && (
              <div>
                <button
                  className="text-xs text-gray-500 hover:text-blue-400 transition flex items-center gap-2 font-medium"
                  onClick={() => setShowMemoryFacts(!showMemoryFacts)}
                >
                  <Brain size={13} /> Memory facts used ({result.memory_context.length})
                  <span className="text-[11px] ml-auto">{showMemoryFacts ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</span>
                </button>
                {showMemoryFacts && (
                  <div className="mt-4 space-y-2.5 animate-fade-in">
                    {result.memory_context.map((fact, i) => (
                      <div key={i} className="text-xs text-gray-400 bg-white/[0.02] rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition leading-6">
                        {typeof fact === 'string' ? fact : fact.content || JSON.stringify(fact)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* New Memory to Save */}
            {result.memory_updates && result.memory_updates.length > 0 && (
              <div className="bg-green-500/8 rounded-lg p-5 border border-green-500/15">
                <h5 className="text-xs font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <Save size={13} /> New facts to remember
                </h5>
                {result.memory_updates.map((update, i) => (
                  <div key={i} className="text-xs text-gray-400 flex items-start gap-3 mb-2 last:mb-0 leading-6">
                    <span className="text-green-500 font-bold mt-0.5">+</span>
                    <span>{typeof update === 'string' ? update : update.content || JSON.stringify(update)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quality Gate */}
            {result.quality_gate_result && (
              <div className={`text-xs flex items-center gap-2 font-medium p-3 rounded-lg ${
                result.quality_gate_result.passed ? 'text-green-400 bg-green-500/8 border border-green-500/15' : 'text-yellow-400 bg-yellow-500/8 border border-yellow-500/15'
              }`}>
                {result.quality_gate_result.passed ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                Quality: {result.quality_gate_result.score || 'N/A'}/10
                {result.quality_gate_result.escalated && ' (escalated to stronger model)'}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto flex gap-4 pt-2">
              {!result.approved ? (
                <>
                  <button
                    id="approve-reply-btn"
                    className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 font-semibold text-sm"
                    onClick={onApprove}
                  >
                    <CheckCircle size={16} /> Approve & Send
                  </button>
                  <button
                    className="btn-secondary flex-1 py-3.5 font-semibold text-sm"
                    onClick={onProcess}
                    disabled={processing}
                  >
                    🔄 Regenerate
                  </button>
                </>
              ) : (
                <div className="flex-1 text-center py-3 rounded-xl bg-green-500/12 border border-green-500/25 text-green-400 text-sm font-semibold">
                  ✅ Reply Approved & Sent
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
