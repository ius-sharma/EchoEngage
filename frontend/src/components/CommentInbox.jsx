/**
 * CommentInbox - Left sidebar with comment list
 */
import { useState } from 'react';
import { Camera, Play, Briefcase, MessageCircle, CheckCircle, Zap, Clock, Flame, Inbox as InboxIcon } from 'lucide-react';

function getPriorityBadge(priority) {
  const map = {
    high: { class: 'badge-vip', label: 'High' },
    medium: { class: 'badge-repeat', label: 'Med' },
    low: { class: 'badge-low', label: 'Low' },
  };
  return map[priority] || map.low;
}

function getPlatformIcon(platform) {
  const iconMap = {
    instagram: Camera,
    youtube: Play,
    linkedin: Briefcase,
  };
  const Icon = iconMap[platform] || MessageCircle;
  return <Icon size={14} className="opacity-70" />;
}

function getStatusIcon(status) {
  if (status === 'replied') return <CheckCircle size={14} className="text-green-400" />;
  if (status === 'processed') return <Zap size={14} className="text-yellow-400" />;
  return <Clock size={14} className="text-gray-400" />;
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
    <div className="content-card inbox-card" style={{ maxHeight: 'calc(100vh - 220px)' }}>
      {/* Header */}
      <div className="content-card-header">
        <h3>
          <InboxIcon size={16} />
          Comment Inbox
          <span className="ml-2 text-xs font-normal text-gray-500">({comments.length})</span>
        </h3>
      </div>
      
      {/* Search & Filters */}
      <div className="p-4 border-b border-white/10 inbox-header">

        {/* Search */}
        <input
          type="text"
          placeholder="Search comments..."
          className="w-full mb-3 input-text inbox-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filters */}
        <div className="inbox-filters">
          {['all', 'pending', 'processed', 'high'].map((f) => (
            <button
              key={f}
              className={filter === f ? 'filter-button active' : 'filter-button'}
              onClick={() => setFilter(f)}
            >
              {f === 'high' && <Flame size={12} />}
              {f === 'all' ? 'All' : f === 'high' ? 'Priority' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Comment List */}
      <div className="content-card-body">
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
                  <span className="text-xs">
                    {getPlatformIcon(comment.platform)}
                  </span>
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
