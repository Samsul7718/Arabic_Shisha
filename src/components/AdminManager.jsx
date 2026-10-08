import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { uploadToCloudinary } from '../utils/cloudinary';
import { formatCurrency } from '../utils/helpers';
import { ProductCardImage } from './ProductCardImage';
import {
  Upload,
  Cloud,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Save,
  Link,
  RefreshCw,
  Eye,
  ShieldCheck,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminManager = () => {
  const {
    lang,
    shishaItems,
    setShishaItems,
    rentalPots,
    setRentalPots,
    cloudinaryConfig,
    setCloudinaryConfig,
    showToast,
    resetInventory
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('catalog'); // 'catalog' | 'rentals' | 'settings' | 'add'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cloudinary credentials form
  const [cloudNameInput, setCloudNameInput] = useState(cloudinaryConfig.cloudName || 'lujbdfel');
  const [presetInput, setPresetInput] = useState(cloudinaryConfig.uploadPreset || 'zioigfj8');

  // Uploading state tracking: { [itemId]: boolean }
  const [uploadingState, setUploadingState] = useState({});

  // New Item Form State
  const [newItem, setNewItem] = useState({
    nameEn: '',
    nameAr: '',
    brand: 'Russian',
    category: 'pots',
    price: '',
    stockStatus: 'in_stock',
    descriptionEn: '',
    descriptionAr: '',
    image: '',
    secondaryImage: ''
  });

  const saveCloudinarySettings = (e) => {
    e.preventDefault();
    setCloudinaryConfig({
      cloudName: cloudNameInput.trim(),
      uploadPreset: presetInput.trim()
    });
    showToast(
      lang === 'ar' ? 'تم حفظ إعدادات كلوديناري بنجاح!' : 'Cloudinary settings saved successfully!',
      'success'
    );
  };

  // Upload image to Cloudinary for a specific item (supports field 'image' or 'secondaryImage')
  const handleItemImageUpload = async (itemId, file, isRental = false, field = 'image') => {
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      showToast(
        lang === 'ar'
          ? 'يرجى ضبط اسم حساب كلوديناري والـ Upload Preset في تبويب الإعدادات أولاً!'
          : 'Please configure your Cloud Name and Upload Preset in Cloudinary Settings first!',
        'error'
      );
      setActiveAdminTab('settings');
      return;
    }

    const stateKey = `${itemId}_${field}`;
    setUploadingState((prev) => ({ ...prev, [stateKey]: true }));

    const res = await uploadToCloudinary(file, cloudinaryConfig.cloudName, cloudinaryConfig.uploadPreset);

    setUploadingState((prev) => ({ ...prev, [stateKey]: false }));

    if (res.success && res.url) {
      if (isRental) {
        setRentalPots((prev) =>
          prev.map((pot) => (pot.id === itemId ? { ...pot, [field]: res.url } : pot))
        );
      } else {
        setShishaItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, [field]: res.url } : item))
        );
      }
      showToast(
        lang === 'ar' ? 'تم رفع الصورة بنجاح إلى كلوديناري!' : 'Image uploaded to Cloudinary successfully!',
        'success'
      );
    } else {
      showToast(res.error || 'Failed to upload image', 'error');
    }
  };

  // Upload image for New Item Form
  const handleNewItemImageUpload = async (file, field = 'image') => {
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      showToast(
        lang === 'ar'
          ? 'يرجى ضبط إعدادات كلوديناري أولاً!'
          : 'Please configure Cloudinary settings first!',
        'error'
      );
      return;
    }

    const stateKey = `new_item_${field}`;
    setUploadingState((prev) => ({ ...prev, [stateKey]: true }));

    const res = await uploadToCloudinary(file, cloudinaryConfig.cloudName, cloudinaryConfig.uploadPreset);

    setUploadingState((prev) => ({ ...prev, [stateKey]: false }));

    if (res.success && res.url) {
      setNewItem((prev) => ({ ...prev, [field]: res.url }));
      showToast(
        lang === 'ar' ? 'تم رفع صورة المنتج الجديد إلى كلوديناري!' : 'New product image uploaded to Cloudinary!',
        'success'
      );
    } else {
      showToast(res.error || 'Failed to upload image', 'error');
    }
  };

  // Toggle Stock Status
  const toggleStockStatus = (itemId, isRental = false) => {
    if (isRental) {
      setRentalPots((prev) =>
        prev.map((pot) => {
          if (pot.id === itemId) {
            const nextStatus = pot.inStock === false ? true : false;
            return { ...pot, inStock: nextStatus };
          }
          return pot;
        })
      );
    } else {
      setShishaItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const statusMap = {
              in_stock: 'low_stock',
              low_stock: 'out_of_stock',
              out_of_stock: 'in_stock'
            };
            const nextStatus = statusMap[item.stockStatus] || 'in_stock';
            return { ...item, stockStatus: nextStatus };
          }
          return item;
        })
      );
    }
    showToast(lang === 'ar' ? 'تم تحديث حالة التوفر' : 'Stock availability updated', 'success');
  };

  // Update Image URL manually
  const updateImageUrl = (itemId, newUrl, isRental = false, field = 'image') => {
    if (isRental) {
      setRentalPots((prev) =>
        prev.map((pot) => (pot.id === itemId ? { ...pot, [field]: newUrl } : pot))
      );
    } else {
      setShishaItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, [field]: newUrl } : item))
      );
    }
  };

  // Delete Item
  const handleDeleteItem = (itemId, isRental = false) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت تأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this item?')) {
      if (isRental) {
        setRentalPots((prev) => prev.filter((pot) => pot.id !== itemId));
      } else {
        setShishaItems((prev) => prev.filter((item) => item.id !== itemId));
      }
      showToast(lang === 'ar' ? 'تم حذف المنتج بنجاح' : 'Item deleted', 'info');
    }
  };

  // Add Item Submit
  const handleAddNewItemSubmit = (e) => {
    e.preventDefault();
    if (!newItem.nameEn || !newItem.price) {
      showToast(lang === 'ar' ? 'يرجى إدخال اسم المنتج والسعر' : 'Please provide product name and price', 'error');
      return;
    }

    const createdItem = {
      id: `custom_${Date.now()}`,
      category: newItem.category,
      brand: newItem.brand,
      nameEn: newItem.nameEn,
      nameAr: newItem.nameAr || newItem.nameEn,
      descriptionEn: newItem.descriptionEn || 'Original premium product.',
      descriptionAr: newItem.descriptionAr || 'منتج أصلي فاخر.',
      price: parseFloat(newItem.price),
      rating: 5.0,
      stockStatus: newItem.stockStatus,
      stockQty: newItem.stockStatus === 'in_stock' ? 20 : 0,
      badge: 'New Arrival',
      image: newItem.image || 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80',
      secondaryImage: newItem.secondaryImage || 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80'
    };

    setShishaItems((prev) => [createdItem, ...prev]);
    showToast(lang === 'ar' ? 'تمت إضافة المنتج الجديد بنجاح!' : 'New product added successfully!', 'success');
    
    // Reset form
    setNewItem({
      nameEn: '',
      nameAr: '',
      brand: 'Russian',
      category: 'pots',
      price: '',
      stockStatus: 'in_stock',
      descriptionEn: '',
      descriptionAr: '',
      image: '',
      secondaryImage: ''
    });

    setActiveAdminTab('catalog');
  };

  const filteredCatalog = shishaItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAr.includes(searchQuery);
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Admin Title Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,0,0,0.4))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={26} color="var(--accent-gold)" />
              <h2 className="gold-gradient-text" style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
                {lang === 'ar' ? 'إدارة المنتجات وصور كلوديناري' : 'Cloudinary & Inventory Manager'}
              </h2>
            </div>
            <p style={{ margin: '0.3rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {lang === 'ar'
                ? 'ارفع صور المنتجات الأصلية مباشرة عبر كلوديناري، وحدّث حالة توفر المنتجات في المتجر بسهولة.'
                : 'Upload original product photos via Cloudinary & manage live stock availability effortlessly.'}
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm(lang === 'ar' ? 'هل ترغب في إعادة ضبط المنتجات إلى الوضع الافتراضي؟' : 'Reset all items to default catalog?')) {
                resetInventory();
              }
            }}
            className="btn-glass"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            <RefreshCw size={14} />
            <span>{lang === 'ar' ? 'إعادة ضبط المنتجات' : 'Reset Default Catalog'}</span>
          </button>
        </div>

        {/* Sub Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveAdminTab('catalog')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: activeAdminTab === 'catalog' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              color: activeAdminTab === 'catalog' ? '#000' : 'var(--text-main)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Package size={16} />
            <span>{lang === 'ar' ? 'منتجات المتجر' : 'Shop Products'} ({shishaItems.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('rentals')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: activeAdminTab === 'rentals' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              color: activeAdminTab === 'rentals' ? '#000' : 'var(--text-main)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Layers size={16} />
            <span>{lang === 'ar' ? 'شيشات التأجير' : 'Rental Hookah Pots'} ({rentalPots.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('add')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: activeAdminTab === 'add' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              color: activeAdminTab === 'add' ? '#000' : 'var(--text-main)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Plus size={16} />
            <span>{lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: activeAdminTab === 'settings' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
              color: activeAdminTab === 'settings' ? '#000' : 'var(--text-main)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Cloud size={16} />
            <span>{lang === 'ar' ? 'إعدادات كلوديناري' : 'Cloudinary Settings'}</span>
          </button>
        </div>
      </div>

      {/* CLOUDINARY SETTINGS TAB */}
      {activeAdminTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '1.8rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Cloud size={24} color="var(--accent-gold)" />
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
              {lang === 'ar' ? 'ربط حساب Cloudinary لرفع الصور' : 'Cloudinary API Connection Settings'}
            </h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {lang === 'ar'
              ? 'تتيح لك كلوديناري رفع صور منتجاتك الأصلية مجاناً والحصول على روابط CDN فائقة السرعة.'
              : 'Cloudinary lets you host original product images for free with instant CDN delivery.'}
          </p>

          <form onSubmit={saveCloudinarySettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Cloudinary Cloud Name *
              </label>
              <input
                type="text"
                value={cloudNameInput}
                onChange={(e) => setCloudNameInput(e.target.value)}
                placeholder="e.g. dxy821abc"
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Unsigned Upload Preset Name *
              </label>
              <input
                type="text"
                value={presetInput}
                onChange={(e) => setPresetInput(e.target.value)}
                placeholder="e.g. arabic_shisha_preset"
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              <Save size={18} />
              <span>{lang === 'ar' ? 'حفظ إعدادات كلوديناري' : 'Save Cloudinary Credentials'}</span>
            </button>
          </form>

          {/* Cloudinary Setup Help Box */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(212,175,55,0.06)',
              border: '1px dashed var(--border-gold)',
              fontSize: '0.85rem'
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem', color: 'var(--accent-gold-light)' }}>
              💡 {lang === 'ar' ? 'كيف تحصل على حساب كلوديناري مجاني خلال دقيقتين؟' : 'How to get free Cloudinary credentials in 2 mins:'}
            </h4>
            <ol style={{ margin: 0, paddingLeft: lang === 'ar' ? '0' : '1.2rem', paddingRight: lang === 'ar' ? '1.2rem' : '0', color: 'var(--text-secondary)' }}>
              <li>
                {lang === 'ar'
                  ? 'قم بإنشاء حساب مجاني على cloudinary.com'
                  : 'Sign up for a free account at cloudinary.com'}
              </li>
              <li>
                {lang === 'ar'
                  ? 'انسخ Cloud Name الخاص بك من الصفحة الرئيسية لحسابك.'
                  : 'Copy your Cloud Name from your Cloudinary Dashboard homepage.'}
              </li>
              <li>
                {lang === 'ar'
                  ? 'اذهب إلى Settings -> Upload -> Add upload preset وأختر Mode: Unsigned، ثم احفظ الاسم.'
                  : 'Go to Settings -> Upload -> Add Upload Preset, set Signing Mode to "Unsigned", and save.'}
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* SHOP PRODUCTS TAB */}
      {activeAdminTab === 'catalog' && (
        <div>
          {/* Filter Bar */}
          <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن منتج للتعديل...' : 'Search items to manage...'}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-gold)',
                color: '#fff'
              }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.8)',
                border: '1px solid var(--border-gold)',
                color: '#fff'
              }}
            >
              <option value="all">{lang === 'ar' ? 'جميع الأقسام' : 'All Categories'}</option>
              <option value="parlor">{lang === 'ar' ? 'خدمات المجلس' : 'Parlor Service'}</option>
              <option value="pots">{lang === 'ar' ? 'شيشات للبيع' : 'Hookah Pots (Sale)'}</option>
              <option value="flavors">{lang === 'ar' ? 'علب النكهات' : 'Flavor Packs'}</option>
              <option value="coals">{lang === 'ar' ? 'فحم ومستلزمات' : 'Coals & Accessories'}</option>
            </select>
          </div>

          {/* Item Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
            {filteredCatalog.map((item) => (
              <div key={item.id} className="glass-panel product-card" style={{ padding: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* Interactive Card Image Slider Preview */}
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.8rem' }}>
                  <ProductCardImage
                    primaryImage={item.image}
                    secondaryImage={item.secondaryImage}
                    alt={lang === 'ar' ? item.nameAr : item.nameEn}
                    height="140px"
                    brand={item.brand}
                    lang={lang}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {item.brand}
                      </span>

                      {/* Stock Toggle Badge */}
                      <button
                        onClick={() => toggleStockStatus(item.id, false)}
                        title={lang === 'ar' ? 'انقر لتغيير حالة توفر المنتج' : 'Click to toggle availability'}
                        style={{
                          background:
                            item.stockStatus === 'in_stock'
                              ? 'rgba(42, 157, 143, 0.2)'
                              : item.stockStatus === 'low_stock'
                              ? 'rgba(244, 162, 97, 0.2)'
                              : 'rgba(230, 57, 70, 0.2)',
                          color:
                            item.stockStatus === 'in_stock'
                              ? '#2a9d8f'
                              : item.stockStatus === 'low_stock'
                              ? '#f4a261'
                              : '#e63946',
                          border: '1px solid currentColor',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {item.stockStatus === 'in_stock' && <CheckCircle size={12} />}
                        {item.stockStatus === 'low_stock' && <AlertTriangle size={12} />}
                        {item.stockStatus === 'out_of_stock' && <XCircle size={12} />}
                        <span>
                          {item.stockStatus === 'in_stock'
                            ? lang === 'ar' ? 'متوفر' : 'In Stock'
                            : item.stockStatus === 'low_stock'
                            ? lang === 'ar' ? 'كمية قليلة' : 'Low Stock'
                            : lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                        </span>
                      </button>
                    </div>

                    <h4 style={{ margin: '0.3rem 0', fontSize: '1rem', fontWeight: 700 }}>
                      {lang === 'ar' ? item.nameAr : item.nameEn}
                    </h4>

                    <div style={{ fontWeight: 800, color: 'var(--accent-gold-light)', fontSize: '0.95rem', marginBottom: '0.6rem' }}>
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  {/* Primary & Secondary Image URLs & Upload Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    
                    {/* Main Image URL & Upload */}
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '42px' }}>Main:</span>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => updateImageUrl(item.id, e.target.value, false, 'image')}
                        placeholder="Primary image URL..."
                        style={{
                          flex: 1,
                          padding: '0.3rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text-secondary)'
                        }}
                      />
                      <label
                        title="Upload Primary Image"
                        style={{
                          background: 'rgba(212,175,55,0.2)',
                          border: '1px solid var(--border-gold)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.3rem 0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Upload size={13} color="var(--accent-gold)" />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleItemImageUpload(item.id, e.target.files[0], false, 'image');
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Secondary Image URL & Upload */}
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '42px' }}>Hover:</span>
                      <input
                        type="text"
                        value={item.secondaryImage || ''}
                        onChange={(e) => updateImageUrl(item.id, e.target.value, false, 'secondaryImage')}
                        placeholder="Secondary hover image URL..."
                        style={{
                          flex: 1,
                          padding: '0.3rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text-secondary)'
                        }}
                      />
                      <label
                        title="Upload Secondary Hover Image"
                        style={{
                          background: 'rgba(212,175,55,0.2)',
                          border: '1px solid var(--border-gold)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.3rem 0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Upload size={13} color="var(--accent-gold)" />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleItemImageUpload(item.id, e.target.files[0], false, 'secondaryImage');
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
                      <button
                        onClick={() => handleDeleteItem(item.id, false)}
                        title={lang === 'ar' ? 'حذف المنتج' : 'Delete item'}
                        style={{
                          background: 'rgba(230, 57, 70, 0.15)',
                          border: '1px solid rgba(230, 57, 70, 0.4)',
                          color: '#e63946',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Trash2 size={13} />
                        <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENTAL POTS TAB */}
      {activeAdminTab === 'rentals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {rentalPots.map((pot) => (
            <div key={pot.id} className="glass-panel product-card" style={{ padding: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Interactive Sliding Card Image Preview */}
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.8rem' }}>
                <ProductCardImage
                  primaryImage={pot.image}
                  secondaryImage={pot.secondaryImage}
                  alt={lang === 'ar' ? pot.nameAr : pot.nameEn}
                  height="140px"
                  brand={pot.brand}
                  lang={lang}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                      {pot.brand}
                    </span>

                    <button
                      onClick={() => toggleStockStatus(pot.id, true)}
                      style={{
                        background: pot.inStock !== false ? 'rgba(42, 157, 143, 0.2)' : 'rgba(230, 57, 70, 0.2)',
                        color: pot.inStock !== false ? '#2a9d8f' : '#e63946',
                        border: '1px solid currentColor',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {pot.inStock !== false ? (lang === 'ar' ? 'متاح للتأجير' : 'Available') : (lang === 'ar' ? 'محجوز/غير متاح' : 'Rented Out')}
                    </button>
                  </div>

                  <h4 style={{ margin: '0.3rem 0', fontSize: '1rem', fontWeight: 700 }}>
                    {lang === 'ar' ? pot.nameAr : pot.nameEn}
                  </h4>

                  <div style={{ fontWeight: 800, color: 'var(--accent-gold-light)', fontSize: '0.95rem', marginBottom: '0.6rem' }}>
                    {formatCurrency(pot.dailyRate)} / {lang === 'ar' ? 'يوم' : 'day'}
                  </div>
                </div>

                {/* Primary & Secondary Image URLs & Upload Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  
                  {/* Main Image URL & Upload */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '42px' }}>Main:</span>
                    <input
                      type="text"
                      value={pot.image}
                      onChange={(e) => updateImageUrl(pot.id, e.target.value, true, 'image')}
                      placeholder="Primary image URL..."
                      style={{
                        flex: 1,
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-secondary)'
                      }}
                    />
                    <label
                      title="Upload Primary Image"
                      style={{
                        background: 'rgba(212,175,55,0.2)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Upload size={13} color="var(--accent-gold)" />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleItemImageUpload(pot.id, e.target.files[0], true, 'image');
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Secondary Image URL & Upload */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '42px' }}>Hover:</span>
                    <input
                      type="text"
                      value={pot.secondaryImage || ''}
                      onChange={(e) => updateImageUrl(pot.id, e.target.value, true, 'secondaryImage')}
                      placeholder="Secondary hover image URL..."
                      style={{
                        flex: 1,
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-secondary)'
                      }}
                    />
                    <label
                      title="Upload Secondary Hover Image"
                      style={{
                        background: 'rgba(212,175,55,0.2)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Upload size={13} color="var(--accent-gold)" />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleItemImageUpload(pot.id, e.target.files[0], true, 'secondaryImage');
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
                    <button
                      onClick={() => handleDeleteItem(pot.id, true)}
                      title={lang === 'ar' ? 'حذف المنتج' : 'Delete item'}
                      style={{
                        background: 'rgba(230, 57, 70, 0.15)',
                        border: '1px solid rgba(230, 57, 70, 0.4)',
                        color: '#e63946',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Trash2 size={13} />
                      <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD NEW PRODUCT TAB */}
      {activeAdminTab === 'add' && (
        <div className="glass-panel" style={{ padding: '1.8rem', maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 1.2rem', fontSize: '1.3rem', color: 'var(--accent-gold-light)' }}>
            {lang === 'ar' ? 'إضافة منتج جديد للمتجر' : 'Add New Shisha Product'}
          </h3>

          <form onSubmit={handleAddNewItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Product Name (English) *
                </label>
                <input
                  type="text"
                  value={newItem.nameEn}
                  onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })}
                  placeholder="e.g. Russian Carbon Hookah Pot"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  اسم المنتج (بالعربية)
                </label>
                <input
                  type="text"
                  value={newItem.nameAr}
                  onChange={(e) => setNewItem({ ...newItem, nameAr: e.target.value })}
                  placeholder="مثال: شيشة روسية كربون فاخرة"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Price (AED) *
                </label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="150"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.8)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff'
                  }}
                >
                  <option value="pots">Hookah Pots (Sale)</option>
                  <option value="parlor">Parlor Lounge Service</option>
                  <option value="flavors">Flavor Packs</option>
                  <option value="coals">Charcoal & Accessories</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                  Brand
                </label>
                <input
                  type="text"
                  value={newItem.brand}
                  onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                  placeholder="Russian, Afzal, Maya..."
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff'
                  }}
                />
              </div>
            </div>

            {/* Primary Image Picker for New Item */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'الصورة الرئيسية للمنتج (Primary Image)' : 'Primary Product Image'}
              </label>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or upload image"
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff'
                  }}
                />

                <label
                  className="btn-gold"
                  style={{
                    padding: '0.65rem 1rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={16} />
                  <span>{uploadingState.new_item_image ? 'Uploading...' : 'Upload Main'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleNewItemImageUpload(e.target.files[0], 'image');
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Secondary Hover Image Picker for New Item */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'صورة التمرير والتحريك (Hover Slide Image)' : 'Secondary Hover Image (Sliding View)'}
              </label>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={newItem.secondaryImage}
                  onChange={(e) => setNewItem({ ...newItem, secondaryImage: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or upload hover image"
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff'
                  }}
                />

                <label
                  className="btn-gold"
                  style={{
                    padding: '0.65rem 1rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={16} />
                  <span>{uploadingState.new_item_secondaryImage ? 'Uploading...' : 'Upload Hover'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleNewItemImageUpload(e.target.files[0], 'secondaryImage');
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1rem' }}
            >
              <Plus size={18} />
              <span>{lang === 'ar' ? 'إضافة المنتج للمتجر الآن' : 'Publish Product to Shop'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
