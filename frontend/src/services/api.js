/**
 * EchoEngage - API Service
 * Handles all backend API calls.
 */

const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
}

export const api = {
  // Comments
  getComments: () => fetchJSON('/comments'),
  getComment: (id) => fetchJSON(`/comments/${id}`),

  // Followers
  getFollowers: () => fetchJSON('/followers'),
  getFollower: (id) => fetchJSON(`/followers/${id}`),

  // Process a comment through the agent
  processComment: (commentId) =>
    fetchJSON('/process', {
      method: 'POST',
      body: JSON.stringify({ comment_id: commentId }),
    }),

  // Approve a reply
  approveReply: (commentId) =>
    fetchJSON('/approve', {
      method: 'POST',
      body: JSON.stringify({ comment_id: commentId }),
    }),

  // Analytics
  getAnalytics: () => fetchJSON('/analytics'),

  // Creator profile
  getCreator: () => fetchJSON('/creator'),

  // Seed memories
  seedMemories: () => fetchJSON('/seed-memories', { method: 'POST' }),

  // Health check
  healthCheck: () => fetchJSON('/health'),
};
