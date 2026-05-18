/**
 * CommentDetail - Center panel showing selected comment, agent reply, and actions
 */
import { useState } from 'react';

function getPlatformIcon(platform) {
  const map = {
    youtube: '🎬',
    instagram: '📸',
    twitter: '🐦',
    linkedin: '💼',
  };
  return map[platform?.toLowerCase()] || '💬';
}

function getPriorityConfig(priority) {
  const map = {
    high: { class: 'badge-vip', label: '🔥 High Priority', desc: 'VIP / Buying Signal' },
    medium: { class: 'badge-repeat', label: '⚡ Medium Priority', desc: 'Repeat Engager' },
    low: { class: 'badge-new', label: '💚 Normal', desc: 'Standard Reply' },
  };
  return map[priority] || map.low;
}

export default function CommentDetail({ comment, result, processing, onProcess, onApprove }) {
  const [showMemoryFacts, setShowMemoryFacts] = useState(false);

  if (!comment) {
    return (
      <div className="glass-card h-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-40">💬</div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">Select a Comment</h3>
          <p className="text-sm text-gray-600 max-w-xs">
            Choose a comment from the inbox to view details, generate AI replies, and manage relationships.
          </p>
        </div>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(result?.priority_label || comment.priority);

  return (
    <div className="glass-card p-0 overflow-hidden">
      {/* Comment Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-lg font-bold border border-white/10">
              {comment.follower_name?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="font-semibold text-white">{comment.follower_name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{getPlatformIcon(comment.platform)} {comment.platform}</span>
                <span>•</span>
                <span>{comment.follower_handle || '@user'}</span>
              </div>
            </div>
          </div>
          <span className={`badge ${priorityConfig.class}`}>
            {priorityConfig.label}
          </span>
        </div>

        {/* Original Comment */}
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
          <p className="text-sm text-gray-200 leading-relaxed">{comment.message}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            {comment.post_context && (
              <span className="truncate max-w-[200px]">
                on: "{comment.post_context}"
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Agent Actions */}
      <div className="p-5">
        {/* Process Button */}
        {!result && (
          <button
            id="process-comment-btn"
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
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
                🤖 Generate AI Reply
                <span className="text-xs opacity-60 ml-1">(LangGraph → Hindsight → CascadeFlow)</span>
              </>
            )}
          </button>
        )}

        {/* Agent Result */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            {/* Classification */}
            {result.classification && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">Intent:</span>
                <span className="badge badge-ghost">{result.classification.intent}</span>
                <span className="text-gray-500">Complexity:</span>
                <span className="badge badge-ghost">{result.classification.complexity}</span>
              </div>
            )}

            {/* Suggested Reply */}
            <div className="bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-xl p-4 border border-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                  ✨ AI-Generated Reply
                </h4>
                {result.model_used && (
                  <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                    via {result.model_used}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {result.suggested_reply}
              </p>
            </div>

            {/* Explanation */}
            {result.explanation && (
              <div className="bg-white/[0.02] rounded-lg p-3 border border-white/5">
                <h5 className="text-xs font-medium text-cyan-400 mb-1">💡 Why this reply?</h5>
                <p className="text-xs text-gray-400 leading-relaxed">{result.explanation}</p>
              </div>
            )}

            {/* Memory Facts Used */}
            {result.memory_context && result.memory_context.length > 0 && (
              <div>
                <button
                  className="text-xs text-gray-500 hover:text-purple-400 transition flex items-center gap-1"
                  onClick={() => setShowMemoryFacts(!showMemoryFacts)}
                >
                  🧠 Memory facts used ({result.memory_context.length})
                  <span className="text-[10px]">{showMemoryFacts ? '▲' : '▼'}</span>
                </button>
                {showMemoryFacts && (
                  <div className="mt-2 space-y-1 animate-fade-in">
                    {result.memory_context.map((fact, i) => (
                      <div key={i} className="text-xs text-gray-500 bg-white/[0.02] rounded px-3 py-1.5 border border-white/5">
                        {typeof fact === 'string' ? fact : fact.content || JSON.stringify(fact)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* New Memory to Save */}
            {result.memory_updates && result.memory_updates.length > 0 && (
              <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                <h5 className="text-xs font-medium text-green-400 mb-2">💾 New facts to remember</h5>
                {result.memory_updates.map((update, i) => (
                  <div key={i} className="text-xs text-gray-400 flex items-start gap-2 mb-1">
                    <span className="text-green-500 mt-0.5">+</span>
                    <span>{typeof update === 'string' ? update : update.content || JSON.stringify(update)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quality Gate */}
            {result.quality_gate_result && (
              <div className={`text-xs flex items-center gap-2 ${
                result.quality_gate_result.passed ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {result.quality_gate_result.passed ? '✅' : '⚠️'}
                Quality: {result.quality_gate_result.score || 'N/A'}/10
                {result.quality_gate_result.escalated && ' (escalated to stronger model)'}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {!result.approved ? (
                <>
                  <button
                    id="approve-reply-btn"
                    className="btn-primary flex-1 py-2.5"
                    onClick={onApprove}
                  >
                    ✅ Approve & Send
                  </button>
                  <button
                    className="btn-secondary flex-1 py-2.5"
                    onClick={onProcess}
                    disabled={processing}
                  >
                    🔄 Regenerate
                  </button>
                </>
              ) : (
                <div className="flex-1 text-center py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
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
