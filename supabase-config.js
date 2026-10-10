// ==============================================================================
// GURU COMMUNICATION - SUPABASE CLIENT CONFIGURATION
// ==============================================================================
// You can set your Supabase project credentials below, OR configure them dynamically
// directly from the Admin Portal Settings page (which persists in localStorage).
//
// 1. URL: Find in Supabase Project Settings -> API -> Project URL
// 2. ANON_KEY: Find in Supabase Project Settings -> API -> Project API Keys -> "anon" "public"
// ==============================================================================

(function() {
  const LOCAL_STORAGE_URL_KEY = 'guru_supabase_url';
  const LOCAL_STORAGE_ANON_KEY = 'guru_supabase_anon_key';
  const LOCAL_STORAGE_BUCKET_KEY = 'guru_supabase_bucket';

  // Configured Supabase Credentials for Guru Communication:
  const DEFAULT_SUPABASE_URL = "https://qpfoandwihxdojjcjgpb.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_ZJYVeC98kAhgb1aifcSXXA_NR5PRY3t";
  const DEFAULT_STORAGE_BUCKET = "product-images";

  const storedUrl = (typeof localStorage !== 'undefined') ? localStorage.getItem(LOCAL_STORAGE_URL_KEY) : null;
  const storedAnonKey = (typeof localStorage !== 'undefined') ? localStorage.getItem(LOCAL_STORAGE_ANON_KEY) : null;
  const storedBucket = (typeof localStorage !== 'undefined') ? localStorage.getItem(LOCAL_STORAGE_BUCKET_KEY) : null;

  window.GURU_SUPABASE_CONFIG = {
    url: storedUrl || DEFAULT_SUPABASE_URL,
    anonKey: storedAnonKey || DEFAULT_SUPABASE_ANON_KEY,
    bucket: storedBucket || DEFAULT_STORAGE_BUCKET,

    // Helper to persist credentials updated from Admin Portal
    saveCredentials: function(newUrl, newAnonKey, newBucket) {
      if (typeof localStorage !== 'undefined') {
        if (newUrl) localStorage.setItem(LOCAL_STORAGE_URL_KEY, newUrl.trim());
        if (newAnonKey) localStorage.setItem(LOCAL_STORAGE_ANON_KEY, newAnonKey.trim());
        if (newBucket) localStorage.setItem(LOCAL_STORAGE_BUCKET_KEY, newBucket.trim());
      }
      this.url = (newUrl || this.url).trim();
      this.anonKey = (newAnonKey || this.anonKey).trim();
      this.bucket = (newBucket || this.bucket).trim();
    },

    clearCredentials: function() {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_URL_KEY);
        localStorage.removeItem(LOCAL_STORAGE_ANON_KEY);
        localStorage.removeItem(LOCAL_STORAGE_BUCKET_KEY);
      }
      this.url = "";
      this.anonKey = "";
      this.bucket = "product-images";
    }
  };
})();
