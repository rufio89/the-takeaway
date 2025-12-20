export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      podcasts: {
        Row: {
          id: string;
          name: string;
          host: string | null;
          url: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          host?: string | null;
          url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          host?: string | null;
          url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      digests: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          published_date: string;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          published_date?: string;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          published_date?: string;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ideas: {
        Row: {
          id: string;
          digest_id: string | null;
          podcast_id: string | null;
          category_id: string | null;
          title: string;
          summary: string;
          actionable_takeaway: string | null;
          clarity_score: number | null;
          timestamp: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          digest_id?: string | null;
          podcast_id?: string | null;
          category_id?: string | null;
          title: string;
          summary: string;
          actionable_takeaway?: string | null;
          clarity_score?: number | null;
          timestamp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          digest_id?: string | null;
          podcast_id?: string | null;
          category_id?: string | null;
          title?: string;
          summary?: string;
          actionable_takeaway?: string | null;
          clarity_score?: number | null;
          timestamp?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Podcast = Database['public']['Tables']['podcasts']['Row'];
export type Digest = Database['public']['Tables']['digests']['Row'];
export type Idea = Database['public']['Tables']['ideas']['Row'];

export interface DigestWithIdeas extends Digest {
  ideas: (Idea & {
    podcast: Podcast | null;
    category: Category | null;
  })[];
}
