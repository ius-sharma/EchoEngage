/**
 * FollowerMemoryCard - Right panel showing follower profile and Hindsight memory
 */
import { useState } from 'react';
import { Brain, User, Crown, Target, Database, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';

function getScoreColor(score) {
  if (score >= 80) return '#a78bfa';
  if (score >= 50) return '#22d3ee';
  if (score >= 30) return '#facc15';
  return '#6b7280';
}

function ScoreRing({ score, size = 64 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const col = getScoreColor(score);
  return (
    <div className="score-ring shrink-0" style={{ width: size, height: size }}>
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
      <div className="content-card memory-card">
        <div className="content-card-header">
          <h3>
            <Brain size={16} />
            Follower Memory
          </h3>
        </div>
        <div className="content-card-body flex items-center justify-center">
          <div className="text-center py-10">
            <div className="text-4xl mb-3 opacity-30"><User size={48} /></div>
            <p className="text-xs text-gray-600">Select a comment to view follower memory</p>
          </div>
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
    <div className="content-card memory-card">
      <div className="content-card-header">
        <h3>
          <Brain size={16} />
          Follower Memory
          <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-normal">Hindsight</span>
        </h3>
      </div>
      <div className="content-card-body p-6 space-y-5 flex-1 flex flex-col">
        {/* Profile */}
        <div className="flex items-start gap-4 mb-1">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-xl font-bold border-2 border-white/10 shadow-lg shadow-blue-500/10">
              {follower.name?.charAt(0) || '?'}
            </div>
            {follower.is_vip && <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px]"><Crown size={12} className="text-white" /></div>}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate text-base">{follower.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{follower.handle || `@${follower.name?.toLowerCase().replace(/\s/g,'')}`}</p>
            <span className="text-xs text-gray-500 mt-2 block">{follower.total_interactions || 0} interactions</span>
          </div>
          <div className="flex flex-col items-center gap-2 px-2">
            <ScoreRing score={score} />
            <span className="text-[10px] uppercase tracking-[0.18em] text-gray-600">Score</span>
          </div>
        </div>
      {/* Tags */}
      {follower.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {follower.tags.map((t,i) => <span key={i} className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">{t}</span>)}
        </div>
      )}
      {/* Interests */}
      {interests.length > 0 && (
        <div className="mb-4">
          <button className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-blue-400 transition mb-3" onClick={() => toggle('i')}>
            <span className="flex items-center gap-1"><Target size={12} /> Interests ({interests.length})</span><span className="text-[10px]">{open==='i'?<ChevronUp size={12} />:<ChevronDown size={12} />}</span>
          </button>
          {open==='i' && <div className="flex flex-wrap gap-2 animate-fade-in">{interests.map((x,i) => <span key={i} className="text-[10px] px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/10">{x}</span>)}</div>}
        </div>
      )}
      {/* Memory Facts */}
      {facts.length > 0 && (
        <div className="mb-4">
          <button className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-cyan-400 transition mb-3" onClick={() => toggle('m')}>
            <span className="flex items-center gap-1"><Database size={12} /> Memory Facts ({facts.length})</span><span className="text-[10px]">{open==='m'?<ChevronUp size={12} />:<ChevronDown size={12} />}</span>
          </button>
          {open==='m' && <div className="space-y-2 animate-fade-in max-h-40 overflow-y-auto">{facts.map((f,i) => <div key={i} className="text-xs text-gray-400 bg-white/[0.02] rounded-xl px-4 py-3 border border-white/5 leading-6"><span className="text-cyan-500 mr-2">•</span>{typeof f==='string'?f:f.content||JSON.stringify(f)}</div>)}</div>}
        </div>
      )}
      {/* Past Questions */}
      {questions.length > 0 && (
        <div>
          <button className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-yellow-400 transition mb-3" onClick={() => toggle('q')}>
            <span className="flex items-center gap-1"><HelpCircle size={12} /> Past Questions ({questions.length})</span><span className="text-[10px]">{open==='q'?<ChevronUp size={12} />:<ChevronDown size={12} />}</span>
          </button>
          {open==='q' && <div className="space-y-2 animate-fade-in max-h-32 overflow-y-auto">{questions.map((q,i) => <div key={i} className="text-xs text-gray-400 bg-yellow-500/5 rounded-xl px-4 py-3 border border-yellow-500/10 leading-6">"{typeof q==='string'?q:q.text||JSON.stringify(q)}"</div>)}</div>}
        </div>
      )}
      {/* Score bar */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] text-gray-600 mb-2">
          <span>Relationship Score</span>
          <span className="font-medium" style={{color:getScoreColor(score)}}>{score>=80?'VIP':score>=50?'Engaged':score>=30?'Casual':'New'}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{width:`${score}%`,background:`linear-gradient(90deg,${getScoreColor(score)}60,${getScoreColor(score)})`}}/>
        </div>
      </div>
      </div>
    </div>
  );
}
