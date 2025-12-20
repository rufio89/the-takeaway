import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit2, Trash2, Calendar, Lightbulb, Check, X, Loader2 } from 'lucide-react';
import type { Digest } from '../../types/database';

interface ManageDigestsProps {
  digests: Digest[];
  onUpdate: () => void;
}

export function ManageDigests({ digests, onUpdate }: ManageDigestsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    image_url: '',
    published_date: '',
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(digest: Digest) {
    setEditingId(digest.id);
    setEditForm({
      title: digest.title,
      description: digest.description || '',
      image_url: digest.image_url || '',
      published_date: digest.published_date,
      featured: digest.featured,
    });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ title: '', description: '', image_url: '', published_date: '', featured: false });
    setError(null);
  }

  async function saveEdit(digestId: string) {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('digests')
        .update({
          title: editForm.title,
          description: editForm.description || null,
          image_url: editForm.image_url || null,
          published_date: editForm.published_date,
          featured: editForm.featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', digestId);

      if (error) throw error;

      setEditingId(null);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update digest');
    } finally {
      setLoading(false);
    }
  }

  async function deleteDigest(digestId: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also delete all associated ideas.`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('digests')
        .delete()
        .eq('id', digestId);

      if (error) throw error;

      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete digest');
    } finally {
      setLoading(false);
    }
  }

  if (digests.length === 0) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No digests yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          All Digests ({digests.length})
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {digests.map((digest) => (
          <div
            key={digest.id}
            className="bg-gray-50 rounded-lg border border-gray-200 p-4"
          >
            {editingId === digest.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-500 font-normal">(Markdown supported)</span>
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={editForm.image_url}
                    onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Published Date *
                    </label>
                    <input
                      type="date"
                      value={editForm.published_date}
                      onChange={(e) => setEditForm({ ...editForm, published_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editForm.featured}
                        onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => saveEdit(digest.id)}
                    disabled={loading || !editForm.title}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {digest.title}
                      {digest.featured && (
                        <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                    </h4>
                    {digest.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{digest.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => startEdit(digest)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      title="Edit digest"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDigest(digest.id, digest.title)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete digest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(digest.published_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>ID: {digest.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
