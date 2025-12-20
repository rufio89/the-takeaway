import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CreateDigestForm } from '../components/admin/CreateDigestForm';
import { CreateIdeaForm } from '../components/admin/CreateIdeaForm';
import { ManageDigests } from '../components/admin/ManageDigests';
import { ProcessTranscriptForm } from '../components/admin/ProcessTranscriptForm';
import { BookOpen, Lightbulb, List, Sparkles } from 'lucide-react';
import type { Digest, Podcast, Category } from '../types/database';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'idea' | 'transcript'>('create');
  const [digests, setDigests] = useState<Digest[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [digestsRes, podcastsRes, categoriesRes] = await Promise.all([
      supabase.from('digests').select('*').order('created_at', { ascending: false }),
      supabase.from('podcasts').select('*').order('name'),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (digestsRes.data) setDigests(digestsRes.data);
    if (podcastsRes.data) setPodcasts(podcastsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Create and manage digests and ideas</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'create'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Create Digest</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <List className="w-5 h-5" />
                <span>Manage Digests</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('idea')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'idea'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5" />
                <span>Add Idea</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'transcript'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Process Transcript</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'create' ? (
            <CreateDigestForm onSuccess={fetchData} />
          ) : activeTab === 'manage' ? (
            <ManageDigests digests={digests} onUpdate={fetchData} />
          ) : activeTab === 'idea' ? (
            <CreateIdeaForm
              digests={digests}
              podcasts={podcasts}
              categories={categories}
              onSuccess={fetchData}
            />
          ) : (
            <ProcessTranscriptForm podcasts={podcasts} onSuccess={fetchData} />
          )}
        </div>
      </div>
    </div>
  );
}
