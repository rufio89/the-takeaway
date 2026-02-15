import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vsrzqhwbrsgjajxctvcz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcnpxaHdicnNnamFqeGN0dmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNTMyOTksImV4cCI6MjA4MTgyOTI5OX0.6kDzCPcH-btsAfpb_q6qhdpmA65RhnH1smCix6OFFac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanup() {
  try {
    console.log('🧹 Checking for duplicates...\n');

    // Find all "State of AI in 2026" digests
    const { data: duplicates, error: fetchError } = await supabase
      .from('digests')
      .select('id, created_at')
      .eq('title', 'State of AI in 2026');

    if (fetchError) throw fetchError;

    if (duplicates.length > 1) {
      console.log(`Found ${duplicates.length} "State of AI in 2026" digests`);
      
      // Sort by created_at, keep the newest one, delete the oldest
      duplicates.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const toDelete = duplicates.slice(0, -1); // All but the last one
      
      for (const digest of toDelete) {
        console.log(`Deleting digest ${digest.id} (created ${digest.created_at})`);
        const { error: deleteError } = await supabase
          .from('digests')
          .delete()
          .eq('id', digest.id);
        
        if (deleteError) throw deleteError;
      }
      
      console.log(`\n✓ Deleted ${toDelete.length} duplicate digest(s)`);
    } else {
      console.log('✓ No duplicates found');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanup();
