// ==============================================================================
// GURU COMMUNICATION - SUPABASE CLIENT & API SERVICE
// ==============================================================================
// Provides unified Auth, Database (CRUD), Storage (Upload/List/Delete), and fallback.
// Compatible with browser vanilla JS and Supabase JS v2 CDN.
// ==============================================================================

(function() {
  let supabaseInstance = null;

  const GuruSupabase = {
    // 1. Initialize or retrieve client instance
    getClient: function() {
      if (supabaseInstance) return supabaseInstance;

      const config = window.GURU_SUPABASE_CONFIG || {};
      const url = config.url ? config.url.trim() : '';
      const key = config.anonKey ? config.anonKey.trim() : '';

      if (!url || !key) {
        return null;
      }

      if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
        console.warn('GuruSupabase: Supabase JS library (@supabase/supabase-js) is not loaded.');
        return null;
      }

      try {
        supabaseInstance = window.supabase.createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        return supabaseInstance;
      } catch (err) {
        console.error('GuruSupabase: Failed to initialize Supabase client:', err);
        return null;
      }
    },

    // Reset client (e.g. after updating credentials in Admin Settings)
    reinitialize: function() {
      supabaseInstance = null;
      return this.getClient();
    },

    isConfigured: function() {
      const config = window.GURU_SUPABASE_CONFIG || {};
      return !!(config.url && config.anonKey);
    },

    isReady: function() {
      return this.isConfigured() && this.getClient() !== null;
    },

    // 2. Health & Connection Check
    checkConnection: async function() {
      const client = this.getClient();
      if (!client) {
        return { success: false, message: 'Supabase URL or Anon Key is missing. Please configure them in Settings.' };
      }

      try {
        // Query products or check health
        const { data, error } = await client.from('products').select('id').limit(1);
        if (error) {
          // If table doesn't exist yet
          if (error.code === '42P01') {
            return {
              success: false,
              code: 'TABLE_MISSING',
              message: 'Connected to Supabase, but "products" table not found. Please run the SQL schema in Supabase SQL Editor.'
            };
          }
          return { success: false, code: error.code, message: error.message };
        }
        return { success: true, message: 'Connected successfully to Supabase!' };
      } catch (err) {
        return { success: false, message: err.message || 'Connection test failed.' };
      }
    },

    // 3. Supabase Authentication Methods
    auth: {
      async signIn(email, password) {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not initialized. Configure your credentials in Settings.');
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });
        if (error) throw error;
        return data;
      },

      async signUp(email, password) {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not initialized.');
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password: password
        });
        if (error) throw error;
        return data;
      },

      async signOut() {
        const client = GuruSupabase.getClient();
        if (!client) return;
        const { error } = await client.auth.signOut();
        if (error) throw error;
      },

      async getSession() {
        const client = GuruSupabase.getClient();
        if (!client) return null;
        const { data, error } = await client.auth.getSession();
        if (error) return null;
        return data.session;
      },

      async getUser() {
        const client = GuruSupabase.getClient();
        if (!client) return null;
        const { data, error } = await client.auth.getUser();
        if (error) return null;
        return data.user;
      },

      onAuthStateChange(callback) {
        const client = GuruSupabase.getClient();
        if (!client) return null;
        return client.auth.onAuthStateChange(callback);
      }
    },

    // 4. Products Catalog Database CRUD Methods
    products: {
      async getAll(filters = {}) {
        const client = GuruSupabase.getClient();
        if (!client) return [];

        try {
          let query = client
            .from('products')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

          if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
          }

          if (typeof filters.in_stock === 'boolean') {
            query = query.eq('in_stock', filters.in_stock);
          }

          if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
          }

          const { data, error } = await query;
          if (error) {
            console.error('GuruSupabase: Error fetching products:', error);
            return [];
          }
          return data || [];
        } catch (err) {
          console.error('GuruSupabase: Exception fetching products:', err);
          return [];
        }
      },

      async getById(id) {
        const client = GuruSupabase.getClient();
        if (!client) return null;
        const { data, error } = await client.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
      },

      async create(product) {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not configured.');

        const cleanProduct = {
          name: product.name,
          category: product.category || 'machinery',
          subcategory: product.subcategory || '',
          price: product.price ? parseFloat(product.price) : null,
          price_text: product.price_text || '',
          badge: product.badge || '',
          description: product.description || '',
          specs: Array.isArray(product.specs) ? product.specs : [],
          image_url: product.image_url || '',
          in_stock: product.in_stock !== false,
          sort_order: parseInt(product.sort_order || 0, 10)
        };

        const { data, error } = await client.from('products').insert([cleanProduct]).select().single();
        if (error) throw error;
        return data;
      },

      async update(id, product) {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not configured.');

        const cleanProduct = {
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price !== undefined && product.price !== '' ? parseFloat(product.price) : null,
          price_text: product.price_text,
          badge: product.badge,
          description: product.description,
          specs: Array.isArray(product.specs) ? product.specs : [],
          image_url: product.image_url,
          in_stock: product.in_stock !== false,
          sort_order: parseInt(product.sort_order || 0, 10),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await client.from('products').update(cleanProduct).eq('id', id).select().single();
        if (error) throw error;
        return data;
      },

      async delete(id) {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not configured.');
        const { error } = await client.from('products').delete().eq('id', id);
        if (error) throw error;
        return true;
      },

      async toggleStock(id, currentStatus) {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not configured.');
        const { data, error } = await client
          .from('products')
          .update({ in_stock: !currentStatus, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },

    // 5. Supabase Storage Image Management
    storage: {
      getBucketName() {
        const config = window.GURU_SUPABASE_CONFIG || {};
        return config.bucket || 'product-images';
      },

      // Upload file directly to Supabase Storage
      async upload(file, customName = '') {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not configured.');

        const bucket = this.getBucketName();
        const extension = file.name.split('.').pop() || 'jpg';
        const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        const timestamp = Date.now();
        const fileName = customName ? `${customName}.${extension}` : `${timestamp}_${cleanBaseName}.${extension}`;

        const { data, error } = await client.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) throw error;

        // Retrieve public URL
        const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(fileName);
        return {
          fileName: fileName,
          path: data.path,
          publicUrl: publicUrlData.publicUrl
        };
      },

      // List all images in the storage bucket
      async list(limit = 100) {
        const client = GuruSupabase.getClient();
        if (!client) return [];

        const bucket = this.getBucketName();
        try {
          const { data, error } = await client.storage
            .from(bucket)
            .list('', {
              limit: limit,
              offset: 0,
              sortBy: { column: 'created_at', order: 'desc' }
            });

          if (error) {
            console.warn('GuruSupabase: Could not list storage items:', error);
            return [];
          }

          // Generate public URL for each file
          return (data || []).map(file => {
            const { data: urlData } = client.storage.from(bucket).getPublicUrl(file.name);
            return {
              ...file,
              publicUrl: urlData.publicUrl
            };
          });
        } catch (err) {
          console.warn('GuruSupabase: Storage list exception:', err);
          return [];
        }
      },

      // Delete an image from storage
      async delete(fileName) {
        const client = GuruSupabase.getClient();
        if (!client) throw new Error('Supabase client not configured.');

        const bucket = this.getBucketName();
        const { data, error } = await client.storage.from(bucket).remove([fileName]);
        if (error) throw error;
        return data;
      }
    },

    // 6. Database Seeder Utility: Imports default site catalog into Supabase with 1 click
    async seedFromDefaultConfig() {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client not configured.');

      const config = window.GURU_CONFIG || {};
      const itemsToInsert = [];

      // Add Machinery
      if (Array.isArray(config.machinery)) {
        config.machinery.forEach((m, idx) => {
          itemsToInsert.push({
            name: m.name,
            category: 'machinery',
            subcategory: m.category || 'OCA Machinery',
            badge: m.badge || '',
            description: m.desc || '',
            specs: m.specs || [],
            image_url: m.image || '',
            in_stock: true,
            sort_order: idx + 1
          });
        });
      }

      // Add Spare Parts
      if (Array.isArray(config.spareParts)) {
        config.spareParts.forEach((p, idx) => {
          itemsToInsert.push({
            name: p.name,
            category: 'spare_parts',
            subcategory: p.category || 'Parts',
            badge: p.badge || '',
            description: p.desc || '',
            specs: [p.category || 'Genuine Part', p.badge || 'Tested Quality'],
            image_url: p.img || '',
            in_stock: true,
            sort_order: 10 + idx
          });
        });
      }

      // Add Accessories
      if (Array.isArray(config.accessories)) {
        config.accessories.forEach((a, idx) => {
          itemsToInsert.push({
            name: a.title,
            category: 'accessories',
            subcategory: a.category || 'Gear',
            badge: a.badge || '',
            description: a.desc || '',
            specs: [a.category || 'Premium Accessory', a.badge || 'Fast Dispatch'],
            image_url: a.img || '',
            in_stock: true,
            sort_order: 20 + idx
          });
        });
      }

      if (itemsToInsert.length === 0) {
        throw new Error('No items found in config.js to seed.');
      }

      const { data, error } = await client.from('products').insert(itemsToInsert).select();
      if (error) throw error;
      return data;
    }
  };

  window.GuruSupabase = GuruSupabase;
})();
