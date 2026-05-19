/**
 * Sidebar - Left navigation menu
 */
import { useState } from 'react';
import { BarChart3, Inbox, Users, Brain, GitBranch, TrendingUp, ChevronLeft, ChevronRight, BookOpen, MessageCircle } from 'lucide-react';

export default function Sidebar({ activeView, onViewChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview & metrics',
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: Inbox,
      description: 'Comments & replies',
    },
    {
      id: 'followers',
      label: 'Followers',
      icon: Users,
      description: 'Follower profiles',
    },
    {
      id: 'memory',
      label: 'Memory Bank',
      icon: Brain,
      description: 'Conversation history',
    },
    {
      id: 'routing',
      label: 'Routing Audit',
      icon: GitBranch,
      description: 'Model decisions',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Performance data',
    },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Collapse Toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
              title={isCollapsed ? item.label : ''}
            >
              <span className="sidebar-icon">
                <IconComponent size={20} />
              </span>
              {!isCollapsed && (
                <div className="sidebar-label">
                  <div className="item-title">{item.label}</div>
                  <div className="item-description">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="footer-item">
            <span className="footer-icon">
              <BookOpen size={18} />
            </span>
            <div>
              <div className="footer-label">Documentation</div>
              <div className="footer-desc">View guides</div>
            </div>
          </div>
          <div className="footer-item">
            <span className="footer-icon">
              <MessageCircle size={18} />
            </span>
            <div>
              <div className="footer-label">Support</div>
              <div className="footer-desc">Get help</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
