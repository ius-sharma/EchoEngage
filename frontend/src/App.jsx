import { useState, useEffect } from 'react';
import MetricsBar from './components/MetricsBar';
import CommentInbox from './components/CommentInbox';
import CommentDetail from './components/CommentDetail';
import FollowerMemoryCard from './components/FollowerMemoryCard';
import RoutingAudit from './components/RoutingAudit';
import { api } from './services/api';
import './App.css';

function App() {
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [agentResult, setAgentResult] = useState(null);
  const [followerData, setFollowerData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [commentsRes, analyticsRes] = await Promise.all([
        api.getComments(),
        api.getAnalytics(),
      ]);
      setComments(commentsRes.comments);
      setAnalytics(analyticsRes);
      setError(null);
    } catch (err) {
      setError('Failed to connect to backend. Make sure the server is running on port 8000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedMemories() {
    try {
      await api.seedMemories();
      setSeeded(true);
    } catch (err) {
      console.error('Seed error:', err);
    }
  }

  async function handleSelectComment(comment) {
    setSelectedComment(comment);
    setAgentResult(comment.agent_response || null);

    // Load follower data
    try {
      const data = await api.getFollower(comment.follower_id);
      setFollowerData(data);
    } catch (err) {
      console.error('Follower load error:', err);
    }
  }

  async function handleProcessComment() {
    if (!selectedComment || processing) return;

    setProcessing(true);
    try {
      const response = await api.processComment(selectedComment.id);
      setAgentResult(response.result);

      // Update comment in list
      setComments((prev) =>
        prev.map((c) =>
          c.id === selectedComment.id
            ? { ...c, status: 'processed', agent_response: response.result }
            : c
        )
      );

      // Refresh analytics
      const analyticsRes = await api.getAnalytics();
      setAnalytics(analyticsRes);

      // Refresh follower data
      const followerRes = await api.getFollower(selectedComment.follower_id);
      setFollowerData(followerRes);
    } catch (err) {
      console.error('Process error:', err);
      setError(`Failed to process: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  }

  async function handleApproveReply() {
    if (!selectedComment || !agentResult) return;

    try {
      await api.approveReply(selectedComment.id);
      setAgentResult((prev) => ({ ...prev, approved: true }));

      // Update comment in list
      setComments((prev) =>
        prev.map((c) =>
          c.id === selectedComment.id ? { ...c, status: 'replied' } : c
        )
      );

      // Refresh analytics
      const analyticsRes = await api.getAnalytics();
      setAnalytics(analyticsRes);
    } catch (err) {
      console.error('Approve error:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: 40, height: 40 }}></div>
          <p className="text-gray-400">Loading EchoEngage...</p>
        </div>
      </div>
    );
  }

  if (error && comments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-card p-8 max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button className="btn-primary" onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
            E
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">EchoEngage</h1>
            <p className="text-xs text-gray-500">Creator Relationship Memory Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!seeded && (
            <button className="btn-secondary text-xs" onClick={handleSeedMemories}>
              🌱 Seed Memories
            </button>
          )}
          {seeded && (
            <span className="text-xs text-green-400">✅ Memories seeded</span>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <MetricsBar analytics={analytics} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        {/* Left: Comment Inbox */}
        <div className="lg:col-span-3">
          <CommentInbox
            comments={comments}
            selectedId={selectedComment?.id}
            onSelect={handleSelectComment}
          />
        </div>

        {/* Center: Comment Detail + Reply */}
        <div className="lg:col-span-5">
          <CommentDetail
            comment={selectedComment}
            result={agentResult}
            processing={processing}
            onProcess={handleProcessComment}
            onApprove={handleApproveReply}
          />
        </div>

        {/* Right: Memory + Routing */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <FollowerMemoryCard
            follower={followerData?.follower}
            memory={followerData?.memory}
          />
          <RoutingAudit
            decision={agentResult?.routing_decision}
            analytics={analytics?.routing}
          />
        </div>
      </div>

      {/* Error toast */}
      {error && comments.length > 0 && (
        <div className="fixed bottom-4 right-4 glass-card p-4 text-sm text-red-400 border-red-500/30 animate-fade-in max-w-sm">
          {error}
          <button className="ml-2 text-gray-500 hover:text-white" onClick={() => setError(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
