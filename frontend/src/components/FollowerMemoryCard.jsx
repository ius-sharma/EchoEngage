/**
 * FollowerMemoryCard - Right panel showing follower profile and Hindsight memory
 */
import { useState } from 'react';

function getScoreColor(score) {
  if (score >= 80) return '#a78bfa';
  if (score >= 50) return '#22d3ee';
  if (score >= 30) return '#facc15';
  return '#6b7280';
}

function ScoreRing({ score, size = 56 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const col = getScoreColor(score);
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out', filter: `drop-shadow(0 0 6px ${col}40)` }}/>
      </svg>
      <div className="score-ring-value" style={{ color: col }}>{score}</div>
    </div>
  );
}

export default function FollowerMemoryCard({ follower, memory }) {
  const [open, setOpen] = useState(null);
  if (!follower) {
    return (
      <div className="glass-card h-fit">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🧠</span>
          <h3 className="text-sm font-semibold text-gray-400">Follower Memory</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-30">👤</div>
          <p className="text-xs text-gray-600">Select a comment to view follower memory</p>
        </div>
      </div>
    );
  }
  const score = follower.relationship_score || 0;
  const facts = memory?.facts || memory?.memories || [];
  const interests = follower.interests || [];
  const questions = follower.past_questions || [];
  const toggle = s => setOpen(open === s ? null : s);

  return (
    <div className="glass-card h-fit">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🧠</span>
        <h3 className="text-sm font-semibold text-gray-400">Follower Memory</h3>
        <span className="ml-auto text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Hindsight</span>
      </div>
      {/* Profile */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-xl font-bold border-2 border-white/10">
            {follower.name?.charAt(0) || '?'}
          </div>
          {follower.is_vip && <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px]">👑</div>}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{follower.name}</h4>
          <p className="text-xs text-gray-500">{follower.handle || `@${follower.name?.toLowerCase().replace(/\s/g,'')}`}</p>
          <span className="text-xs text-gray-500">{follower.total_interactions || 0} interactions</span>
        </div>
        <ScoreRing score={score} />
      </div>
      {/* Tags */}
      {follower.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {follower.tags.map((t,i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">{t}</span>)}
        </div>
      )}
      {/* Interests */}
      {interests.length > 0 && (
        <div className="mb-3">
          <button className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-purple-400 transition mb-2" onClick={() => toggle('i')}>
            <span>🎯 Interests ({interests.length})</span><span className="text-[10px]">{open==='i'?'▲':'▼'}</span>
          </button>
          {open==='i' && <div className="flex flex-wrap gap-1.5 animate-fade-in">{interests.map((x,i) => <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/10">{x}</span>)}</div>}
        </div>
      )}
      {/* Memory Facts */}
      {facts.length > 0 && (
        <div className="mb-3">
          <button className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-cyan-400 transition mb-2" onClick={() => toggle('m')}>
            <span>💾 Memory Facts ({facts.length})</span><span className="text-[10px]">{open==='m'?'▲':'▼'}</span>
          </button>
          {open==='m' && <div className="space-y-1.5 animate-fade-in max-h-40 overflow-y-auto">{facts.map((f,i) => <div key={i} className="text-xs text-gray-400 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5"><span className="text-cyan-500 mr-2">•</span>{typeof f==='string'?f:f.content||JSON.stringify(f)}</div>)}</div>}
        </div>
      )}
      {/* Past Questions */}
      {questions.length > 0 && (
        <div>
          <button className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-yellow-400 transition mb-2" onClick={() => toggle('q')}>
            <span>❓ Past Questions ({questions.length})</span><span className="text-[10px]">{open==='q'?'▲':'▼'}</span>
          </button>
          {open==='q' && <div className="space-y-1.5 animate-fade-in max-h-32 overflow-y-auto">{questions.map((q,i) => <div key={i} className="text-xs text-gray-400 bg-yellow-500/5 rounded-lg px-3 py-2 border border-yellow-500/10">"{typeof q==='string'?q:q.text||JSON.stringify(q)}"</div>)}</div>}
        </div>
      )}
      {/* Score bar */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] text-gray-600">
          <span>Relationship Score</span>
          <span className="font-medium" style={{color:getScoreColor(score)}}>{score>=80?'VIP':score>=50?'Engaged':score>=30?'Casual':'New'}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 mt-1.5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{width:`${score}%`,background:`linear-gradient(90deg,${getScoreColor(score)}60,${getScoreColor(score)})`}}/>
        </div>
      </div>
    </div>
  );
}
