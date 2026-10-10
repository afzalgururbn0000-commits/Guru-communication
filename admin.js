// ==============================================================================
// GURU COMMUNICATION - ADMIN CONTROL CENTER JAVASCRIPT
// ==============================================================================

(function() {
  // State
  let currentSession = null;
  let allProducts = [];
  let storageFiles = [];
  let currentCategoryFilter = 'all';
  let isEditing = false;
  let productToDelete = null;

  // Embedded SQL Schema for Copy button
  const SQL_SCHEMA_STRING = `-- GURU COMMUNICATION - SUPABASE DATABASE & STORAGE SCHEMA
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'machinery', 'spare_parts', 'accessories', 'services'
    subcategory TEXT,
    price NUMERIC,
    price_text TEXT,
    badge TEXT,
    description TEXT,
    specs JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert products" ON public.products;
CREATE POLICY "Admin insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update products" ON public.products;
CREATE POLICY "Admin update products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete products" ON public.products;
CREATE POLICY "Admin delete products" ON public.products FOR DELETE TO authenticated USING (true);

-- Storage bucket 'product-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated upload product images" ON storage.objects;
CREATE POLICY "Authenticated upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated update product images" ON storage.objects;
CREATE POLICY "Authenticated update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;
CREATE POLICY "Authenticated delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');
`;

  // UI Toast Helper
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
      success: 'border-emerald-500/40 bg-dark-900/95 text-emerald-300',
      error: 'border-red-500/40 bg-dark-900/95 text-red-300',
      warning: 'border-amber-500/40 bg-dark-900/95 text-amber-300',
      info: 'border-cyan-glow/40 bg-dark-900/95 text-cyan-glow'
    };

    const icons = {
      success: 'check-circle',
      error: 'alert-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs pointer-events-auto transform transition-all duration-300 opacity-0 translate-y-2 ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <div class="flex items-center gap-2.5">
        <i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 flex-shrink-0"></i>
        <span>${message}</span>
      </div>
      <button class="text-gray-400 hover:text-white">&times;</button>
    `;

    toast.querySelector('button').onclick = () => {
      toast.remove();
    };

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Refresh Lucide Icons safely
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Check Supabase connection and update badges
  async function verifyConnectionStatus() {
    const statusDot = document.getElementById('auth-status-dot');
    const statusLabel = document.getElementById('auth-status-label');
    const topBadge = document.getElementById('top-conn-badge');

    if (!window.GuruSupabase || !window.GuruSupabase.isConfigured()) {
      if (statusDot) statusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
      if (statusLabel) statusLabel.textContent = 'API Keys Needed - Click Configure API';
      if (topBadge) {
        topBadge.className = 'hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono';
        topBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Supabase Not Configured</span>';
      }
      return false;
    }

    const res = await window.GuruSupabase.checkConnection();
    if (res.success) {
      if (statusDot) statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400';
      if (statusLabel) statusLabel.textContent = 'Supabase Cloud Connected';
      if (topBadge) {
        topBadge.className = 'hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono';
        topBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>Supabase Connected</span>';
      }
      return true;
    } else {
      if (statusDot) statusDot.className = 'w-2.5 h-2.5 rounded-full bg-red-500';
      if (statusLabel) statusLabel.textContent = res.code === 'TABLE_MISSING' ? 'Tables Missing (Run SQL Schema)' : 'Connection Failed';
      if (topBadge) {
        topBadge.className = 'hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono';
        topBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-red-400"></span><span>DB Attention Required</span>';
      }
      return false;
    }
  }

  // Switch Active Tab
  function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
        btn.classList.remove('text-gray-400');
      } else {
        btn.classList.remove('active');
        btn.classList.add('text-gray-400');
      }
    });

    const sections = {
      catalog: document.getElementById('tab-section-catalog'),
      editor: document.getElementById('tab-section-editor'),
      storage: document.getElementById('tab-section-storage'),
      settings: document.getElementById('tab-section-settings')
    };

    Object.keys(sections).forEach(key => {
      if (sections[key]) {
        if (key === tabName) {
          sections[key].classList.remove('hidden');
        } else {
          sections[key].classList.add('hidden');
        }
      }
    });

    renderIcons();

    if (tabName === 'storage') {
      loadStorageGallery();
    } else if (tabName === 'catalog') {
      loadProducts();
    }
  }

  // Load and Render Products
  async function loadProducts() {
    const loadingEl = document.getElementById('products-loading');
    const emptyEl = document.getElementById('products-empty');
    const gridEl = document.getElementById('products-grid');

    if (loadingEl) loadingEl.classList.remove('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    if (gridEl) gridEl.innerHTML = '';

    try {
      const searchVal = (document.getElementById('catalog-search-input')?.value || '').trim();
      const stockVal = document.getElementById('catalog-stock-filter')?.value || 'all';

      const filters = {};
      if (currentCategoryFilter !== 'all') filters.category = currentCategoryFilter;
      if (stockVal === 'in_stock') filters.in_stock = true;
      if (stockVal === 'out_of_stock') filters.in_stock = false;
      if (searchVal) filters.search = searchVal;

      allProducts = await window.GuruSupabase.products.getAll(filters);

      // If empty and Supabase is not ready, fallback to config.js preview
      if (allProducts.length === 0 && !window.GuruSupabase.isReady()) {
        const fallbackConfig = window.GURU_CONFIG || {};
        allProducts = [
          ...(fallbackConfig.machinery || []).map((m, i) => ({ id: `demo-m-${i}`, name: m.name, category: 'machinery', subcategory: m.category, badge: m.badge, description: m.desc, specs: m.specs, image_url: m.image, in_stock: true, isDemo: true })),
          ...(fallbackConfig.spareParts || []).map((p, i) => ({ id: `demo-p-${i}`, name: p.name, category: 'spare_parts', subcategory: p.category, badge: p.badge, description: p.desc, specs: [p.category], image_url: p.img, in_stock: true, isDemo: true })),
          ...(fallbackConfig.accessories || []).map((a, i) => ({ id: `demo-a-${i}`, name: a.title, category: 'accessories', subcategory: a.category, badge: a.badge, description: a.desc, specs: [a.category], image_url: a.img, in_stock: true, isDemo: true }))
        ];
      }

      updateMetrics();

      if (loadingEl) loadingEl.classList.add('hidden');

      if (allProducts.length === 0) {
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
      }

      renderProductsGrid(allProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (emptyEl) emptyEl.classList.remove('hidden');
      showToast('Could not fetch products from database', 'error');
    }
  }

  // Update Stats & Badges
  function updateMetrics() {
    const totalCount = allProducts.length;
    const machineryCount = allProducts.filter(p => p.category === 'machinery').length;
    const sparePartsCount = allProducts.filter(p => p.category === 'spare_parts').length;
    const accessoriesCount = allProducts.filter(p => p.category === 'accessories').length;

    const elTotal = document.getElementById('stat-total');
    const elMachinery = document.getElementById('stat-machinery');
    const elSpareParts = document.getElementById('stat-spareparts');
    const elAccessories = document.getElementById('stat-accessories');
    const elBadgeCount = document.getElementById('badge-product-count');

    if (elTotal) elTotal.textContent = totalCount;
    if (elMachinery) elMachinery.textContent = machineryCount;
    if (elSpareParts) elSpareParts.textContent = sparePartsCount;
    if (elAccessories) elAccessories.textContent = accessoriesCount;
    if (elBadgeCount) elBadgeCount.textContent = totalCount;
  }

  // Render Product Cards
  function renderProductsGrid(products) {
    const gridEl = document.getElementById('products-grid');
    if (!gridEl) return;

    const categoryThemes = {
      machinery: { border: 'hover:border-orange-glow/60', badgeBg: 'bg-orange-glow text-dark-950', icon: 'cpu', textCol: 'text-orange-glow' },
      spare_parts: { border: 'hover:border-cyan-glow/60', badgeBg: 'bg-cyan-glow text-dark-950', icon: 'hard-drive', textCol: 'text-cyan-glow' },
      accessories: { border: 'hover:border-purple-glow/60', badgeBg: 'bg-purple-glow text-white', icon: 'headphones', textCol: 'text-purple-300' },
      services: { border: 'hover:border-blue-500/60', badgeBg: 'bg-blue-500 text-white', icon: 'wrench', textCol: 'text-blue-400' }
    };

    gridEl.innerHTML = products.map(item => {
      const theme = categoryThemes[item.category] || categoryThemes.machinery;
      const displayPrice = item.price ? `₹${parseFloat(item.price).toLocaleString('en-IN')}` : (item.price_text || 'Enquire on WhatsApp');
      const specsList = Array.isArray(item.specs) ? item.specs : [];

      return `
        <div class="glass-surface rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between transition-all group ${theme.border}" data-id="${item.id}">
          
          <!-- Image & Badges Header -->
          <div class="relative h-48 bg-dark-900 overflow-hidden border-b border-white/5">
            <img src="${item.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100">
            
            <!-- Category & Promo Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
              <span class="px-2.5 py-0.5 rounded-full ${theme.badgeBg} font-heading font-bold text-[10px] uppercase tracking-wider">
                ${item.subcategory || item.category}
              </span>
              ${item.badge ? `<span class="px-2 py-0.5 rounded-full bg-dark-950/80 border border-white/10 text-white font-mono text-[10px]">${item.badge}</span>` : ''}
            </div>

            <!-- In-Stock Toggle Badge -->
            <button class="toggle-stock-btn absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all ${item.in_stock ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'}" data-id="${item.id}" data-stock="${item.in_stock}" title="Click to toggle stock status">
              <span class="w-1.5 h-1.5 rounded-full ${item.in_stock ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}"></span>
              <span>${item.in_stock ? 'In Stock' : 'Out of Stock'}</span>
            </button>
          </div>

          <!-- Product Details Body -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-mono uppercase tracking-widest ${theme.textCol}">${item.category.replace('_', ' ')}</span>
                <span class="text-xs font-mono font-bold text-gray-300">${displayPrice}</span>
              </div>
              <h3 class="text-base font-heading font-bold text-white group-hover:text-cyan-glow transition-colors line-clamp-1">${item.name}</h3>
              <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">${item.description || 'No description provided.'}</p>
            </div>

            <!-- Specs Chips -->
            ${specsList.length > 0 ? `
              <div class="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                ${specsList.slice(0, 3).map(s => `
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-900 border border-white/10 text-gray-400 flex items-center gap-1">
                    <i data-lucide="check" class="w-3 h-3 text-cyan-glow"></i> ${s}
                  </span>
                `).join('')}
              </div>
            ` : ''}

            <!-- Card Actions Footer -->
            <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <button class="edit-product-btn px-3 py-1.5 rounded-xl bg-dark-900 border border-white/10 hover:border-cyan-glow/40 text-xs font-mono text-gray-300 hover:text-cyan-glow flex items-center gap-1.5 transition-all" data-id="${item.id}">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit
                </button>
                <button class="delete-product-btn p-1.5 rounded-xl bg-dark-900 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-colors" data-id="${item.id}" data-name="${encodeURIComponent(item.name)}">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <a href="https://wa.me/917051383473?text=${encodeURIComponent(`Hello Guru Communication, I want to enquire about: ${item.name}`)}" target="_blank" class="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1" title="Preview WhatsApp enquiry">
                <span>WhatsApp</span>
                <i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>

          </div>

        </div>
      `;
    }).join('');

    renderIcons();
    attachCardActionHandlers();
  }

  // Card Button Handlers (Toggle Stock, Edit, Delete)
  function attachCardActionHandlers() {
    // Toggle Stock
    document.querySelectorAll('.toggle-stock-btn').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const currentStock = btn.getAttribute('data-stock') === 'true';

        try {
          btn.innerHTML = '<span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>';
          await window.GuruSupabase.products.toggleStock(id, currentStock);
          showToast(`Stock status updated to: ${!currentStock ? 'In Stock' : 'Out of Stock'}`, 'success');
          loadProducts();
        } catch (err) {
          showToast(err.message || 'Failed to toggle stock status', 'error');
          loadProducts();
        }
      };
    });

    // Edit Product
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openProductEditor(id);
      };
    });

    // Delete Product
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const name = decodeURIComponent(btn.getAttribute('data-name') || 'Product');
        openDeleteModal(id, name);
      };
    });
  }

  // Open Product Editor in Add or Edit Mode
  function openProductEditor(productId = null) {
    const form = document.getElementById('product-form');
    if (!form) return;

    form.reset();
    document.getElementById('specs-list').innerHTML = '';
    const previewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    if (previewContainer) previewContainer.classList.add('hidden');
    if (imagePreview) imagePreview.src = '';

    const heading = document.getElementById('editor-heading');
    const saveText = document.getElementById('editor-save-text');
    const tabTitle = document.getElementById('tab-editor-title');

    if (productId) {
      isEditing = true;
      const product = allProducts.find(p => p.id === productId);
      if (!product) return;

      document.getElementById('edit-product-id').value = product.id;
      document.getElementById('prod-name').value = product.name || '';
      document.getElementById('prod-category').value = product.category || 'machinery';
      document.getElementById('prod-subcategory').value = product.subcategory || '';
      document.getElementById('prod-badge').value = product.badge || '';
      document.getElementById('prod-price').value = product.price || '';
      document.getElementById('prod-desc').value = product.description || '';
      document.getElementById('prod-stock').checked = product.in_stock !== false;
      document.getElementById('prod-sort').value = product.sort_order || 0;
      document.getElementById('prod-image-url').value = product.image_url || '';

      if (product.image_url) {
        if (imagePreview) imagePreview.src = product.image_url;
        if (previewContainer) previewContainer.classList.remove('hidden');
      }

      if (Array.isArray(product.specs)) {
        product.specs.forEach(spec => addSpecInputRow(spec));
      }

      if (heading) heading.textContent = `Edit Product: ${product.name}`;
      if (saveText) saveText.textContent = 'Update Product';
      if (tabTitle) tabTitle.textContent = 'Edit Product';
    } else {
      isEditing = false;
      document.getElementById('edit-product-id').value = '';
      if (heading) heading.textContent = 'Upload New Product';
      if (saveText) saveText.textContent = 'Save to Supabase';
      if (tabTitle) tabTitle.textContent = 'Add Product';
      addSpecInputRow(''); // Add 1 empty spec row by default
    }

    switchTab('editor');
  }

  // Dynamic Spec Input Row
  function addSpecInputRow(value = '') {
    const list = document.getElementById('specs-list');
    if (!list) return;

    const row = document.createElement('div');
    row.className = 'flex items-center gap-2 spec-row';
    row.innerHTML = `
      <input type="text" value="${value.replace(/"/g, '&quot;')}" placeholder="e.g. 800W High Efficiency Power" class="spec-input flex-1 cyber-input rounded-xl px-3 py-2 text-xs">
      <button type="button" class="remove-spec-btn p-2 rounded-xl bg-dark-900 border border-white/10 text-gray-500 hover:text-red-400">
        <i data-lucide="trash" class="w-3.5 h-3.5"></i>
      </button>
    `;

    row.querySelector('.remove-spec-btn').onclick = () => row.remove();
    list.appendChild(row);
    renderIcons();
  }

  // Save Product (Create / Update)
  async function handleSaveProduct() {
    const saveBtn = document.getElementById('editor-save-btn');
    const saveText = document.getElementById('editor-save-text');
    const nameInput = document.getElementById('prod-name');

    if (!nameInput.value.trim()) {
      showToast('Product Name is required!', 'warning');
      nameInput.focus();
      return;
    }

    const id = document.getElementById('edit-product-id').value;
    const specs = Array.from(document.querySelectorAll('.spec-input'))
      .map(input => input.value.trim())
      .filter(val => val.length > 0);

    const productPayload = {
      name: nameInput.value.trim(),
      category: document.getElementById('prod-category').value,
      subcategory: document.getElementById('prod-subcategory').value.trim(),
      badge: document.getElementById('prod-badge').value.trim(),
      price: document.getElementById('prod-price').value.trim(),
      description: document.getElementById('prod-desc').value.trim(),
      image_url: document.getElementById('prod-image-url').value.trim(),
      in_stock: document.getElementById('prod-stock').checked,
      sort_order: parseInt(document.getElementById('prod-sort').value || 0, 10),
      specs: specs
    };

    try {
      saveBtn.disabled = true;
      if (saveText) saveText.textContent = 'Saving...';

      if (id) {
        await window.GuruSupabase.products.update(id, productPayload);
        showToast('Product updated successfully in Supabase!', 'success');
      } else {
        await window.GuruSupabase.products.create(productPayload);
        showToast('New product published to Supabase!', 'success');
      }

      switchTab('catalog');
      loadProducts();
    } catch (err) {
      console.error('Save product error:', err);
      showToast(err.message || 'Error saving product', 'error');
    } finally {
      saveBtn.disabled = false;
      if (saveText) saveText.textContent = id ? 'Update Product' : 'Save to Supabase';
    }
  }

  // Delete Modal logic
  function openDeleteModal(id, name) {
    productToDelete = id;
    const modal = document.getElementById('delete-modal');
    const nameEl = document.getElementById('delete-item-name');
    if (nameEl) nameEl.textContent = `"${name}"`;
    if (modal) modal.classList.remove('hidden');
  }

  function closeDeleteModal() {
    productToDelete = null;
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.add('hidden');
  }

  async function executeDeleteProduct() {
    if (!productToDelete) return;
    const confirmBtn = document.getElementById('confirm-delete-btn');

    try {
      if (confirmBtn) confirmBtn.textContent = 'Deleting...';
      await window.GuruSupabase.products.delete(productToDelete);
      showToast('Product deleted from Supabase', 'success');
      closeDeleteModal();
      loadProducts();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      if (confirmBtn) confirmBtn.textContent = 'Delete Now';
    }
  }

  // Image Upload Handling (Drag-drop / File input)
  async function handleImageFileUpload(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'warning');
      return;
    }

    const progressBox = document.getElementById('upload-progress-box');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressPct = document.getElementById('upload-progress-pct');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    const urlInput = document.getElementById('prod-image-url');

    try {
      // Local immediate preview
      previewImg.src = URL.createObjectURL(file);
      previewContainer.classList.remove('hidden');

      if (progressBox) progressBox.classList.remove('hidden');
      if (progressBar) progressBar.style.width = '45%';
      if (progressPct) progressPct.textContent = '45%';

      // Upload to Supabase Storage
      const uploadResult = await window.GuruSupabase.storage.upload(file);

      if (progressBar) progressBar.style.width = '100%';
      if (progressPct) progressPct.textContent = '100%';

      if (urlInput) urlInput.value = uploadResult.publicUrl;
      if (previewImg) previewImg.src = uploadResult.publicUrl;

      showToast('Image uploaded to Supabase Storage bucket!', 'success');
      setTimeout(() => {
        if (progressBox) progressBox.classList.add('hidden');
      }, 1000);
    } catch (err) {
      console.error('Storage upload failed:', err);
      showToast(err.message || 'Upload to storage failed', 'error');
      if (progressBox) progressBox.classList.add('hidden');
    }
  }

  // Load Storage Gallery
  async function loadStorageGallery() {
    const loadingEl = document.getElementById('storage-loading');
    const emptyEl = document.getElementById('storage-empty');
    const gridEl = document.getElementById('storage-gallery-grid');
    const badgeEl = document.getElementById('badge-storage-count');

    if (loadingEl) loadingEl.classList.remove('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    if (gridEl) gridEl.innerHTML = '';

    try {
      storageFiles = await window.GuruSupabase.storage.list();
      if (loadingEl) loadingEl.classList.add('hidden');

      if (badgeEl) badgeEl.textContent = storageFiles.length;

      if (storageFiles.length === 0) {
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
      }

      gridEl.innerHTML = storageFiles.map(file => `
        <div class="glass-surface rounded-2xl overflow-hidden border border-white/10 group hover:border-purple-glow/50 transition-all flex flex-col justify-between">
          <div class="relative h-32 bg-dark-900 overflow-hidden">
            <img src="${file.publicUrl}" alt="${file.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
            <div class="absolute inset-0 bg-dark-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
              <button class="copy-image-url-btn p-2 rounded-lg bg-dark-900 text-cyan-glow hover:bg-cyan-glow hover:text-dark-950 transition-colors" data-url="${file.publicUrl}" title="Copy Public URL">
                <i data-lucide="copy" class="w-4 h-4"></i>
              </button>
              <button class="use-image-for-prod-btn p-2 rounded-lg bg-dark-900 text-purple-300 hover:bg-purple-glow hover:text-white transition-colors" data-url="${file.publicUrl}" title="Use this image for a product">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
              </button>
              <button class="delete-storage-file-btn p-2 rounded-lg bg-dark-900 text-red-400 hover:bg-red-600 hover:text-white transition-colors" data-name="${file.name}" title="Delete file">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
          <div class="p-2.5 bg-dark-900/60 border-t border-white/5">
            <p class="text-[10px] font-mono text-gray-300 truncate" title="${file.name}">${file.name}</p>
          </div>
        </div>
      `).join('');

      renderIcons();

      // Copy URL handler
      document.querySelectorAll('.copy-image-url-btn').forEach(btn => {
        btn.onclick = () => {
          const url = btn.getAttribute('data-url');
          navigator.clipboard.writeText(url);
          showToast('Image Public URL copied to clipboard!', 'success');
        };
      });

      // Use Image for Product
      document.querySelectorAll('.use-image-for-prod-btn').forEach(btn => {
        btn.onclick = () => {
          const url = btn.getAttribute('data-url');
          openProductEditor();
          const urlInput = document.getElementById('prod-image-url');
          const previewImg = document.getElementById('image-preview');
          const previewContainer = document.getElementById('image-preview-container');
          if (urlInput) urlInput.value = url;
          if (previewImg) previewImg.src = url;
          if (previewContainer) previewContainer.classList.remove('hidden');
          showToast('Image selected for product editor!', 'info');
        };
      });

      // Delete Storage File
      document.querySelectorAll('.delete-storage-file-btn').forEach(btn => {
        btn.onclick = async () => {
          const name = btn.getAttribute('data-name');
          if (confirm(`Permanently delete "${name}" from Supabase storage?`)) {
            try {
              await window.GuruSupabase.storage.delete(name);
              showToast('Image deleted from storage', 'success');
              loadStorageGallery();
            } catch (err) {
              showToast(err.message || 'Failed to delete file', 'error');
            }
          }
        };
      });

    } catch (err) {
      console.error('Storage list error:', err);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (emptyEl) emptyEl.classList.remove('hidden');
    }
  }

  // Open Image Picker Modal (for selecting from storage while editing product)
  async function openImagePickerModal() {
    const modal = document.getElementById('image-picker-modal');
    const grid = document.getElementById('picker-images-grid');
    if (!modal || !grid) return;

    modal.classList.remove('hidden');
    grid.innerHTML = '<div class="col-span-4 text-center py-8 text-xs text-gray-400 font-mono">Loading storage images...</div>';

    const files = await window.GuruSupabase.storage.list();
    if (files.length === 0) {
      grid.innerHTML = '<div class="col-span-4 text-center py-8 text-xs text-gray-400 font-mono">No images found in storage bucket.</div>';
      return;
    }

    grid.innerHTML = files.map(f => `
      <div class="picker-item cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-cyan-glow transition-all" data-url="${f.publicUrl}">
        <img src="${f.publicUrl}" alt="${f.name}" class="w-full h-24 object-cover">
        <p class="text-[9px] font-mono text-gray-300 p-1 truncate bg-dark-900">${f.name}</p>
      </div>
    `).join('');

    document.querySelectorAll('.picker-item').forEach(item => {
      item.onclick = () => {
        const url = item.getAttribute('data-url');
        const urlInput = document.getElementById('prod-image-url');
        const previewImg = document.getElementById('image-preview');
        const previewContainer = document.getElementById('image-preview-container');
        if (urlInput) urlInput.value = url;
        if (previewImg) previewImg.src = url;
        if (previewContainer) previewContainer.classList.remove('hidden');
        modal.classList.add('hidden');
        showToast('Image linked to product!', 'success');
      };
    });
  }

  // Seed default site products into Supabase
  async function seedDatabase() {
    const btn = document.getElementById('seed-database-action-btn');
    if (btn) btn.disabled = true;

    try {
      showToast('Seeding store products into Supabase...', 'info');
      await window.GuruSupabase.seedFromDefaultConfig();
      showToast('All default products successfully inserted into Supabase!', 'success');
      loadProducts();
    } catch (err) {
      showToast(err.message || 'Seeding failed. Ensure table exists.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // Setup Initial Event Listeners
  function initListeners() {
    // Auth Tab Switching (Login vs Register)
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const submitBtnText = document.getElementById('auth-submit-text');

    if (tabLogin && tabRegister) {
      tabLogin.onclick = () => {
        tabLogin.className = 'flex-1 py-3 text-cyan-glow border-b-2 border-cyan-glow text-center transition-all';
        tabRegister.className = 'flex-1 py-3 text-gray-400 hover:text-white border-b-2 border-transparent text-center transition-all';
        if (submitBtnText) submitBtnText.textContent = 'Sign In to Dashboard';
      };

      tabRegister.onclick = () => {
        tabRegister.className = 'flex-1 py-3 text-cyan-glow border-b-2 border-cyan-glow text-center transition-all';
        tabLogin.className = 'flex-1 py-3 text-gray-400 hover:text-white border-b-2 border-transparent text-center transition-all';
        if (submitBtnText) submitBtnText.textContent = 'Create Admin Account';
      };
    }

    // Auth Form Submission
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const errBox = document.getElementById('auth-error-box');
        const submitBtn = document.getElementById('auth-submit-btn');

        if (errBox) errBox.classList.add('hidden');
        if (submitBtn) submitBtn.disabled = true;

        try {
          try {
            await window.GuruSupabase.auth.signIn(email, password);
            showToast('Welcome back, Admin!', 'success');
          } catch (loginErr) {
            // If user doesn't exist yet in Supabase, auto-register as admin
            if (loginErr.message && (loginErr.message.toLowerCase().includes('invalid login credentials') || loginErr.status === 400)) {
              try {
                const signupRes = await window.GuruSupabase.auth.signUp(email, password);
                if (signupRes && (signupRes.user || signupRes.session)) {
                  // Try logging in with the newly created admin account
                  await window.GuruSupabase.auth.signIn(email, password);
                  showToast('Admin created and signed in successfully!', 'success');
                } else {
                  throw loginErr;
                }
              } catch (signupErr) {
                if (signupErr.message && signupErr.message.toLowerCase().includes('already registered')) {
                  throw new Error('Incorrect password for this admin account.');
                }
                throw loginErr;
              }
            } else {
              throw loginErr;
            }
          }
          checkAuthState();
        } catch (err) {
          console.error('Auth error:', err);
          if (errBox) {
            errBox.textContent = err.message || 'Authentication failed. Please check credentials.';
            errBox.classList.remove('hidden');
          }
          showToast(err.message || 'Login failed', 'error');
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      };
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = async () => {
        await window.GuruSupabase.auth.signOut();
        showToast('Signed out successfully.', 'info');
        checkAuthState();
      };
    }

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === 'editor') {
          openProductEditor();
        } else {
          switchTab(tab);
        }
      };
    });

    const quickAddBtn = document.getElementById('quick-add-btn');
    if (quickAddBtn) quickAddBtn.onclick = () => openProductEditor();

    const emptyAddBtn = document.getElementById('empty-add-btn');
    if (emptyAddBtn) emptyAddBtn.onclick = () => openProductEditor();

    const emptySeedBtn = document.getElementById('empty-seed-btn');
    if (emptySeedBtn) emptySeedBtn.onclick = seedDatabase;

    const seedDbActionBtn = document.getElementById('seed-database-action-btn');
    if (seedDbActionBtn) seedDbActionBtn.onclick = seedDatabase;

    // Category Filter Pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('.cat-pill').forEach(p => {
          p.className = 'cat-pill px-3.5 py-1.5 rounded-xl bg-dark-900 text-gray-400 hover:text-white border border-white/10 text-xs font-mono uppercase';
        });
        pill.className = 'cat-pill active px-3.5 py-1.5 rounded-xl bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40 text-xs font-mono uppercase';
        currentCategoryFilter = pill.getAttribute('data-cat');
        loadProducts();
      };
    });

    // Search & Filter
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      let debounceTimeout = null;
      searchInput.oninput = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(loadProducts, 300);
      };
    }

    const stockFilter = document.getElementById('catalog-stock-filter');
    if (stockFilter) stockFilter.onchange = loadProducts;

    const refreshBtn = document.getElementById('refresh-products-btn');
    if (refreshBtn) refreshBtn.onclick = loadProducts;

    // Spec point builder
    const addSpecBtn = document.getElementById('add-spec-btn');
    if (addSpecBtn) addSpecBtn.onclick = () => addSpecInputRow();

    // Editor Cancel & Save
    const editorCancelBtn = document.getElementById('editor-cancel-btn');
    if (editorCancelBtn) editorCancelBtn.onclick = () => switchTab('catalog');

    const editorSaveBtn = document.getElementById('editor-save-btn');
    if (editorSaveBtn) editorSaveBtn.onclick = handleSaveProduct;

    // Delete Modal
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) cancelDeleteBtn.onclick = closeDeleteModal;

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) confirmDeleteBtn.onclick = executeDeleteProduct;

    // Image Picker Modal
    const openPickerBtn = document.getElementById('open-gallery-picker-btn');
    if (openPickerBtn) openPickerBtn.onclick = openImagePickerModal;

    const closePickerBtn = document.getElementById('close-image-picker-btn');
    if (closePickerBtn) closePickerBtn.onclick = () => {
      document.getElementById('image-picker-modal')?.classList.add('hidden');
    };

    // Remove Image from form
    const removeImgBtn = document.getElementById('remove-image-btn');
    if (removeImgBtn) {
      removeImgBtn.onclick = () => {
        document.getElementById('image-preview-container')?.classList.add('hidden');
        const urlInput = document.getElementById('prod-image-url');
        if (urlInput) urlInput.value = '';
      };
    }

    // Image Drag & Drop on Editor
    const dropzone = document.getElementById('image-dropzone');
    const fileInput = document.getElementById('image-file-input');

    if (dropzone && fileInput) {
      dropzone.onclick = () => fileInput.click();

      fileInput.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
          handleImageFileUpload(e.target.files[0]);
        }
      };

      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add('border-cyan-glow', 'bg-cyan-glow/5');
      };

      dropzone.ondragleave = () => {
        dropzone.classList.remove('border-cyan-glow', 'bg-cyan-glow/5');
      };

      dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-cyan-glow', 'bg-cyan-glow/5');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleImageFileUpload(e.dataTransfer.files[0]);
        }
      };
    }

    // Direct Gallery File Upload
    const directUploadInput = document.getElementById('direct-gallery-upload-input');
    if (directUploadInput) {
      directUploadInput.onchange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          for (let file of e.target.files) {
            try {
              await window.GuruSupabase.storage.upload(file);
            } catch (err) {
              console.error(err);
            }
          }
          showToast('Uploaded images to storage bucket!', 'success');
          loadStorageGallery();
        }
      };
    }

    // Storage Quick Drop Area
    const storageQuickDrop = document.getElementById('storage-quick-drop');
    if (storageQuickDrop && directUploadInput) {
      storageQuickDrop.onclick = () => directUploadInput.click();
      storageQuickDrop.ondragover = (e) => {
        e.preventDefault();
        storageQuickDrop.classList.add('border-purple-glow', 'bg-purple-glow/10');
      };
      storageQuickDrop.ondragleave = () => {
        storageQuickDrop.classList.remove('border-purple-glow', 'bg-purple-glow/10');
      };
      storageQuickDrop.ondrop = async (e) => {
        e.preventDefault();
        storageQuickDrop.classList.remove('border-purple-glow', 'bg-purple-glow/10');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          for (let file of e.dataTransfer.files) {
            try {
              await window.GuruSupabase.storage.upload(file);
            } catch (err) {
              console.error(err);
            }
          }
          showToast('Images dropped and uploaded to bucket!', 'success');
          loadStorageGallery();
        }
      };
    }

    const refreshStorageBtn = document.getElementById('refresh-storage-btn');
    if (refreshStorageBtn) refreshStorageBtn.onclick = loadStorageGallery;

    // Settings Credentials Form
    const settingsForm = document.getElementById('settings-credentials-form');
    if (settingsForm) {
      const config = window.GURU_SUPABASE_CONFIG || {};
      document.getElementById('setting-url').value = config.url || '';
      document.getElementById('setting-anon-key').value = config.anonKey || '';
      document.getElementById('setting-bucket').value = config.bucket || 'product-images';

      settingsForm.onsubmit = async (e) => {
        e.preventDefault();
        const url = document.getElementById('setting-url').value.trim();
        const anonKey = document.getElementById('setting-anon-key').value.trim();
        const bucket = document.getElementById('setting-bucket').value.trim();

        window.GURU_SUPABASE_CONFIG.saveCredentials(url, anonKey, bucket);
        window.GuruSupabase.reinitialize();

        showToast('Testing Supabase credentials...', 'info');
        const isConnected = await verifyConnectionStatus();
        if (isConnected) {
          showToast('Supabase connection verified successfully!', 'success');
        } else {
          showToast('Credentials saved, but verification failed. Check project URL and SQL setup.', 'warning');
        }
      };

      const clearKeysBtn = document.getElementById('setting-clear-btn');
      if (clearKeysBtn) {
        clearKeysBtn.onclick = () => {
          if (confirm('Reset stored Supabase credentials?')) {
            window.GURU_SUPABASE_CONFIG.clearCredentials();
            window.GuruSupabase.reinitialize();
            document.getElementById('setting-url').value = '';
            document.getElementById('setting-anon-key').value = '';
            showToast('Credentials cleared from browser storage', 'info');
            verifyConnectionStatus();
          }
        };
      }
    }

    // Copy SQL Schema button
    const copySqlBtn = document.getElementById('copy-sql-btn');
    const sqlDisplay = document.getElementById('sql-schema-display');
    if (sqlDisplay) sqlDisplay.textContent = SQL_SCHEMA_STRING;

    if (copySqlBtn) {
      copySqlBtn.onclick = () => {
        navigator.clipboard.writeText(SQL_SCHEMA_STRING);
        showToast('Complete Supabase SQL Schema copied to clipboard!', 'success');
      };
    }

    // Open Config Shortcut on Auth Screen
    const openConfigBtn = document.getElementById('open-config-btn');
    if (openConfigBtn) {
      openConfigBtn.onclick = () => {
        document.getElementById('auth-screen')?.classList.add('hidden');
        document.getElementById('admin-app')?.classList.remove('hidden');
        switchTab('settings');
      };
    }
  }

  // Check Auth State on Init
  async function checkAuthState() {
    const authScreen = document.getElementById('auth-screen');
    const adminApp = document.getElementById('admin-app');
    const emailDisplay = document.getElementById('user-email-display');

    await verifyConnectionStatus();

    const user = await window.GuruSupabase.auth.getUser();
    currentSession = user;

    if (user) {
      if (authScreen) authScreen.classList.add('hidden');
      if (adminApp) adminApp.classList.remove('hidden');
      if (emailDisplay) emailDisplay.textContent = user.email || 'Admin';
      loadProducts();
      loadStorageGallery();
    } else {
      if (authScreen) authScreen.classList.remove('hidden');
      if (adminApp) adminApp.classList.add('hidden');
    }
  }

  // Boot Application
  async function initAdmin() {
    renderIcons();
    initListeners();
    await checkAuthState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }
})();
