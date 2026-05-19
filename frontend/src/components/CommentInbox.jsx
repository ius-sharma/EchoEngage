/**
 * CommentInbox - Left sidebar with comment list
 */
import { useState } from 'react';
import { Camera, Play, Briefcase, MessageCircle, CheckCircle, Zap, Clock, Flame, Inbox as InboxIcon, Search } from 'lucide-react';

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
      <div className="inbox-header">

        {/* Search */}
        <div className="inbox-search-wrap">
          <input
            type="text"
            placeholder="Search comments or names..."
            className="w-full inbox-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="inbox-search-action" aria-label="Search comments">
            <Search className="h-5 w-5" />
          </button>
        </div>

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
      <div className="inbox-comment-list">
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
                className="w-9 h-9 rounded-full flex-shrink-0 bg-white/10 border border-white/10 shadow-sm"
              />

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-100 truncate">
                        {comment.follower_name}
                      </span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1 shrink-0">
                        {getPlatformIcon(comment.platform)}
                        <span className="truncate">{comment.platform}</span>
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-2">
                      <span>{comment.follower_handle || '@user'}</span>
                      <span className="text-gray-700">•</span>
                      <span className="flex items-center gap-1">{getStatusIcon(comment.status)}<span className="capitalize">{comment.status}</span></span>
                    </div>
                  </div>

                  <span className={`badge ${getPriorityBadge(comment.priority).class}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                    {getPriorityBadge(comment.priority).label}
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 leading-5 max-w-[95%]">
                  {comment.message}
                </p>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] text-gray-500">{timeAgo(comment.timestamp)}</span>
                  <span className="text-[11px] text-gray-500">Tap to open</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
