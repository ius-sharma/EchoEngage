/**
 * CommentInbox - Left sidebar with comment list
 */
import { useState } from 'react';

function getPriorityBadge(priority) {
  const map = {
    high: { class: 'badge-vip', label: 'High' },
    medium: { class: 'badge-repeat', label: 'Med' },
    low: { class: 'badge-low', label: 'Low' },
  };
  return map[priority] || map.low;
}

function getPlatformIcon(platform) {
  const map = {
    instagram: '📸',
    youtube: '▶️',
    linkedin: '💼',
  };
  return map[platform] || '💬';
}

function getStatusIcon(status) {
  if (status === 'replied') return '✅';
  if (status === 'processed') return '🤖';
  return '⏳';
}

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentInbox({ comments, selectedId, onSelect }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = comments.filter((c) => {
    if (filter === 'pending' && c.status !== 'pending') return false;
    if (filter === 'processed' && c.status === 'pending') return false;
    if (filter === 'high' && c.priority !== 'high') return false;
    if (search && !c.message.toLowerCase().includes(search.toLowerCase()) &&
        !c.follower_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="glass-card overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 220px)' }}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">
          📥 Comment Inbox
          <span className="ml-2 text-xs text-gray-500">({comments.length})</span>
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search comments..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filters */}
        <div className="flex gap-1 flex-wrap">
          {['all', 'pending', 'processed', 'high'].map((f) => (
            <button
              key={f}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                filter === f
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-white/5 text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'high' ? '🔥 Priority' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Comment List */}
      <div className="overflow-y-auto flex-1">
        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-600 text-sm">
            No comments match your filter
          </div>
        )}
        {filtered.map((comment) => (
          <div
            key={comment.id}
            className={`comment-item ${selectedId === comment.id ? 'active' : ''}`}
            onClick={() => onSelect(comment)}
          >
            <div className="flex items-start gap-3">
              <img
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${comment.follower_name.split(' ')[0]}`}
                alt={comment.follower_name}
                className="w-8 h-8 rounded-full flex-shrink-0 bg-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-200 truncate">
                    {comment.follower_name}
                  </span>
                  <span className="text-xs">{getPlatformIcon(comment.platform)}</span>
                  <span className="text-xs text-gray-600 ml-auto flex-shrink-0">
                    {getStatusIcon(comment.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {comment.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`badge ${getPriorityBadge(comment.priority).class}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                    {getPriorityBadge(comment.priority).label}
                  </span>
                  <span className="text-xs text-gray-600">{timeAgo(comment.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
