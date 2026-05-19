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

function ScoreRing({ score, size = 52 }) {
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
      <div className="score-ring-value" style={{ color: col, fontSize: '13px' }}>{score}</div>
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
        <div className="content-card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ marginBottom: '10px', opacity: 0.3 }}><User size={40} /></div>
            <p style={{ fontSize: '12px', color: '#475569' }}>Select a comment to view follower memory</p>
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
      <div className="memory-body">
        {/* Profile Section */}
        <div className="memory-profile">
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div className="memory-avatar">
              {follower.name?.charAt(0) || '?'}
            </div>
            {follower.is_vip && <div className="memory-vip-badge"><Crown size={10} color="white" /></div>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="memory-name">{follower.name}</div>
            <div className="memory-handle">{follower.handle || `@${follower.name?.toLowerCase().replace(/\s/g,'')}`}</div>
            <div className="memory-interactions">{follower.total_interactions || 0} interactions</div>
          </div>
          <div className="memory-score-wrap">
            <ScoreRing score={score} />
            <span className="memory-score-label">SCORE</span>
          </div>
        </div>

        {/* Tags */}
        {follower.tags?.length > 0 && (
          <div className="memory-tags">
            {follower.tags.map((t,i) => <span key={i} className="memory-tag">{t}</span>)}
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="memory-expandable-section">
            <button className="memory-expand-btn" onClick={() => toggle('i')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={13} /> Interests ({interests.length})</span>
              {open==='i'?<ChevronUp size={13} />:<ChevronDown size={13} />}
            </button>
            {open==='i' && (
              <div className="memory-expand-content">
                {interests.map((x,i) => <span key={i} className="memory-interest-tag">{x}</span>)}
              </div>
            )}
          </div>
        )}

        {/* Memory Facts */}
        {facts.length > 0 && (
          <div className="memory-expandable-section">
            <button className="memory-expand-btn" onClick={() => toggle('m')} style={{ color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Database size={13} /> Memory Facts ({facts.length})</span>
              {open==='m'?<ChevronUp size={13} />:<ChevronDown size={13} />}
            </button>
            {open==='m' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                {facts.map((f,i) => (
                  <div key={i} className="memory-fact-item">
                    <span style={{ color: '#22d3ee', marginRight: '6px' }}>•</span>
                    {typeof f==='string'?f:f.content||JSON.stringify(f)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Past Questions */}
        {questions.length > 0 && (
          <div className="memory-expandable-section">
            <button className="memory-expand-btn" onClick={() => toggle('q')} style={{ color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><HelpCircle size={13} /> Past Questions ({questions.length})</span>
              {open==='q'?<ChevronUp size={13} />:<ChevronDown size={13} />}
            </button>
            {open==='q' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                {questions.map((q,i) => (
                  <div key={i} className="memory-question-item">
                    "{typeof q==='string'?q:q.text||JSON.stringify(q)}"
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Score bar */}
        <div className="memory-score-bar-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginBottom: '8px' }}>
            <span>Relationship Score</span>
            <span style={{ fontWeight: 600, color: getScoreColor(score) }}>{score>=80?'VIP':score>=50?'Engaged':score>=30?'Casual':'New'}</span>
          </div>
          <div className="memory-progress-track">
            <div className="memory-progress-fill" style={{width:`${score}%`,background:`linear-gradient(90deg,${getScoreColor(score)}60,${getScoreColor(score)})`}}/>
          </div>
        </div>
      </div>
    </div>
  );
}
