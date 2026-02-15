import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vsrzqhwbrsgjajxctvcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcnpxaHdicnNnamFqeGN0dmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTMyOTksImV4cCI6MjA4MTgyOTI5OX0.6kDzCPcH-btsAfpb_q6qhdpmA65RhnH1smCix6OFFac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Image URLs for digests
const digestImages = {
  'State of AI in 2026': 'https://images.unsplash.com/photo-1677442d019bed47410dd91ea69d8bff?auto=format&fit=crop&w=600&q=80',
  'Curate People: Building World-Class Teams': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
  'Simplify Your Life in 2026': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
};

async function updateImages() {
  try {
    console.log('🖼️  Updating digest images...\n');

    for (const [title, imageUrl] of Object.entries(digestImages)) {
      const { data, error } = await supabase
        .from('digests')
        .update({ image_url: imageUrl })
        .eq('title', title)
        .select();

      if (error) {
        console.error(`❌ Failed to update ${title}:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`✓ Updated "${title}"`);
      } else {
        console.log(`⚠️  No digest found with title "${title}"`);
      }
    }

    console.log('\n✓ All digest images updated!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateImages();
