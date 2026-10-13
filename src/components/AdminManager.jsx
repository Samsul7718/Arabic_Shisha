import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { uploadToCloudinary } from '../utils/cloudinary';
import { formatCurrency } from '../utils/helpers';
import { ProductCardImage } from './ProductCardImage';
import {
  formatUserPartyWhatsAppMessage,
  formatAdminPartyWhatsAppMessage,
  formatUserPartyCancellationWhatsAppMessage,
  formatAdminPartyCancellationWhatsAppMessage,
  openWhatsApp,
  getWhatsAppUrl
} from '../utils/whatsapp';
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
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Phone,
  CreditCard,
  Send,
  ExternalLink,
  Filter
} from 'lucide-react';

export const AdminManager = () => {
  const {
    lang,
    shishaItems,
    setShishaItems,
    rentalPots,
    setRentalPots,
    partyPackages,
    updatePartyPackagePrice,
    updatePartyBookingAmount,
    cloudinaryConfig,
    setCloudinaryConfig,
    showToast,
    resetInventory,
    partyBookings,
    updatePartyBookingStatus,
    deletePartyBooking,
    adminWhatsAppPhone,
    setAdminWhatsAppPhone,
    adminSubTab,
    setAdminSubTab
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState(adminSubTab || 'parties'); // 'parties' | 'catalog' | 'rentals' | 'settings' | 'add'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Party Bookings filter state
  const [partySearchQuery, setPartySearchQuery] = useState('');
  const [partyStatusFilter, setPartyStatusFilter] = useState('all');
  const [adminPhoneInput, setAdminPhoneInput] = useState(adminWhatsAppPhone);

  // States for modifying party card amount
  const [editingBookingCode, setEditingBookingCode] = useState(null);
  const [editingAmountInput, setEditingAmountInput] = useState('');
  const [packagePricesDraft, setPackagePricesDraft] = useState({});

  // State for Party Cancellation & WhatsApp Notification Modal
  const [partyToCancelModal, setPartyToCancelModal] = useState(null);

  const handlePackagePriceChange = (pkgId, val) => {
    setPackagePricesDraft((prev) => ({ ...prev, [pkgId]: val }));
  };

  const handleSavePackagePrice = (pkgId) => {
    const val = packagePricesDraft[pkgId];
    if (val !== undefined && val !== '') {
      updatePartyPackagePrice(pkgId, val);
    }
  };

  useEffect(() => {
    if (adminSubTab) {
      setActiveAdminTab(adminSubTab);
    }
  }, [adminSubTab]);

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
          {/* REQUIREMENT 2: Admin clicks this button to show all booking party list */}
          <button
            id="admin-party-bookings-tab-btn"
            onClick={() => {
              setActiveAdminTab('parties');
              setAdminSubTab('parties');
            }}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              background: activeAdminTab === 'parties' ? 'linear-gradient(135deg, #d4af37, #ff9f1c)' : 'rgba(255,255,255,0.05)',
              color: activeAdminTab === 'parties' ? '#000' : 'var(--text-main)',
              fontWeight: 800,
              border: activeAdminTab === 'parties' ? 'none' : '1px solid var(--border-gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: activeAdminTab === 'parties' ? 'var(--shadow-gold-glow)' : 'none'
            }}
          >
            <Sparkles size={16} color={activeAdminTab === 'parties' ? '#000' : 'var(--accent-gold)'} />
            <span>{lang === 'ar' ? 'حجوزات الحفلات' : 'Party Bookings'}</span>
            <span style={{
              background: activeAdminTab === 'parties' ? '#000' : 'var(--accent-gold)',
              color: activeAdminTab === 'parties' ? 'var(--accent-gold)' : '#000',
              padding: '1px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              {partyBookings.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveAdminTab('catalog');
              setAdminSubTab('catalog');
            }}
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
            onClick={() => {
              setActiveAdminTab('rentals');
              setAdminSubTab('rentals');
            }}
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
            onClick={() => {
              setActiveAdminTab('add');
              setAdminSubTab('add');
            }}
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
            onClick={() => {
              setActiveAdminTab('settings');
              setAdminSubTab('settings');
            }}
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
            <span>{lang === 'ar' ? 'إعدادات كلوديناري والواتساب' : 'Cloudinary & WhatsApp Settings'}</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENT 2: ALL BOOKING PARTY LIST (PARTY ROSTER VIEW) */}
      {activeAdminTab === 'parties' && (
        <div>
          {/* Top Banner with Stats & Admin Alert */}
          <div className="glass-panel" style={{ padding: '1.8rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(0,0,0,0.5))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={24} color="var(--accent-gold)" />
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                    {lang === 'ar' ? 'سجل وحجوزات حفلات الشيشة الميدانية' : 'Party Catering Bookings Roster'}
                  </h3>
                </div>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  {lang === 'ar'
                    ? 'عرض كافة الحفلات المحجوزة، تفاصيل البطاقات الضامنة، وإرسال إشعارات وتأكيدات الواتساب المباشرة.'
                    : 'Manage all booked hookah parties, inspect required card guarantees, and trigger instant WhatsApp dispatch.'}
                </p>
              </div>

              {/* REQUIREMENT 3: Roster Alert to Admin WhatsApp */}
              <button
                type="button"
                id="admin-whatsapp-roster-alert-btn"
                onClick={() => {
                  const summary = `🚨 *ARABIC SHISHA — ACTIVE PARTY ROSTER ALERT* 🚨\nTotal Active Bookings: ${partyBookings.length}\n` +
                    partyBookings.slice(0, 5).map(b => `• ${b.bookingCode}: ${b.packageNameEn} on ${b.eventDate} @ ${b.eventTime} (${b.organizerName} - ${b.organizerPhone})`).join('\n') +
                    `\n\nAdmin Notification dispatched to: +${adminWhatsAppPhone}`;
                  openWhatsApp(adminWhatsAppPhone, summary);
                }}
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.65rem 1.3rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                }}
              >
                <Send size={16} />
                <span>{lang === 'ar' ? `إرسال كشف الحفلات لواتساب الإدارة (+${adminWhatsAppPhone})` : `Send Full Roster to Admin WhatsApp (+${adminWhatsAppPhone})`}</span>
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(11, 13, 18, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                  {lang === 'ar' ? 'إجمالي الحفلات المحجوزة' : 'Total Party Bookings'}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {partyBookings.length}
                </span>
              </div>

              <div style={{ background: 'rgba(11, 13, 18, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                  {lang === 'ar' ? 'قيمة الحجوزات الإجمالية' : 'Total Catering Value'}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {formatCurrency(partyBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0))}
                </span>
              </div>

              <div style={{ background: 'rgba(11, 13, 18, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                  {lang === 'ar' ? 'مجموع الشيشات المطلوبة' : 'Hookah Pots Needed'}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ff9f1c' }}>
                  {partyBookings.reduce((sum, b) => sum + (b.potsCount || 0), 0)} Pots
                </span>
              </div>

              <div style={{ background: 'rgba(11, 13, 18, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                  {lang === 'ar' ? 'الحفلات المؤكدة' : 'Confirmed Active'}
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2a9d8f' }}>
                  {partyBookings.filter(b => b.status === 'Confirmed').length}
                </span>
              </div>
            </div>
          </div>

          {/* PARTY PACKAGE CARD AMOUNTS / PRICING TIERS MANAGER */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(11, 13, 18, 0.75)', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--accent-gold)" />
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  {lang === 'ar' ? 'تعديل أسعار كروت حزم الحفلات (Party Package Card Amounts)' : 'Modify Party Package Card Amounts & Tiers'}
                </h4>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'تعديل السعر هنا يحدّث أسعار الحزم في قسم تنظيم الحفلات تلقائياً' : 'Changing amounts here updates the party cards in the catering section immediately'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {(partyPackages || []).map((pkg) => {
                const currentDraft = packagePricesDraft[pkg.id] !== undefined ? packagePricesDraft[pkg.id] : pkg.basePrice;
                const hasChanged = String(currentDraft) !== String(pkg.basePrice);

                return (
                  <div
                    key={pkg.id}
                    style={{
                      background: 'rgba(19, 23, 34, 0.9)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.8rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.98rem', marginBottom: '0.2rem' }}>
                        {lang === 'ar' ? pkg.nameAr : pkg.nameEn}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {pkg.potsCount} Pots • {pkg.recommendedFor}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.1rem' }}>₹</span>
                      <input
                        type="number"
                        value={currentDraft}
                        onChange={(e) => handlePackagePriceChange(pkg.id, e.target.value)}
                        placeholder="Card Amount"
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.75rem',
                          background: 'rgba(0,0,0,0.6)',
                          border: '1px solid var(--border-gold)',
                          borderRadius: 'var(--radius-sm)',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSavePackagePrice(pkg.id)}
                        disabled={!hasChanged}
                        style={{
                          background: hasChanged ? 'linear-gradient(135deg, #d4af37, #ff9f1c)' : 'rgba(255,255,255,0.08)',
                          color: hasChanged ? '#000' : 'var(--text-muted)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.55rem 1rem',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: hasChanged ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Save size={14} />
                        <span>{lang === 'ar' ? 'حفظ' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-panel" style={{ padding: '1rem 1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.8rem', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث باسم المنظم، رمز الحجز، الهاتف، أو الموقع...' : 'Search by organizer, ref code, phone, or venue location...'}
                value={partySearchQuery}
                onChange={(e) => setPartySearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(11, 13, 18, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Status Pills Filter */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['all', 'Confirmed', 'In Preparation', 'Dispatched', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setPartyStatusFilter(st)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-subtle)',
                    background: partyStatusFilter === st ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                    color: partyStatusFilter === st ? '#000' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {st === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : st}
                </button>
              ))}
            </div>
          </div>

          {/* Party Bookings Roster Cards */}
          {partyBookings.filter((b) => {
            const q = partySearchQuery.toLowerCase().trim();
            const matchesSearch =
              !q ||
              b.organizerName?.toLowerCase().includes(q) ||
              b.bookingCode?.toLowerCase().includes(q) ||
              b.organizerPhone?.includes(q) ||
              b.eventLocation?.toLowerCase().includes(q) ||
              b.eventDate?.includes(q);
            const matchesStatus = partyStatusFilter === 'all' || b.status === partyStatusFilter;
            return matchesSearch && matchesStatus;
          }).length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Calendar size={48} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                {lang === 'ar' ? 'لا توجد حجوزات حفلات تطابق البحث' : 'No Party Bookings Found'}
              </h4>
              <p style={{ fontSize: '0.88rem' }}>
                {lang === 'ar' ? 'جرب تغيير فلاتر البحث أو تأكيد حجز حفلة جديدة من قسم تنظيم الحفلات.' : 'Try adjusting search query or book a new party from the Party Catering section.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {partyBookings
                .filter((b) => {
                  const q = partySearchQuery.toLowerCase().trim();
                  const matchesSearch =
                    !q ||
                    b.organizerName?.toLowerCase().includes(q) ||
                    b.bookingCode?.toLowerCase().includes(q) ||
                    b.organizerPhone?.includes(q) ||
                    b.eventLocation?.toLowerCase().includes(q) ||
                    b.eventDate?.includes(q);
                  const matchesStatus = partyStatusFilter === 'all' || b.status === partyStatusFilter;
                  return matchesSearch && matchesStatus;
                })
                .map((b) => (
                  <div
                    key={b.bookingCode || b.id}
                    className="glass-panel"
                    style={{
                      padding: '1.5rem',
                      border: '1px solid var(--border-gold)',
                      background: 'rgba(19, 23, 34, 0.85)',
                      position: 'relative'
                    }}
                  >
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
                          color: '#000',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem'
                        }}>
                          {b.bookingCode}
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#fff' }}>
                          {lang === 'ar' ? b.packageNameAr || b.packageNameEn : b.packageNameEn}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {/* Status Dropdown */}
                        <select
                          value={b.status || 'Confirmed'}
                          onChange={(e) => updatePartyBookingStatus(b.bookingCode, e.target.value)}
                          style={{
                            background:
                              b.status === 'Confirmed' ? 'rgba(42, 157, 143, 0.25)' :
                              b.status === 'In Preparation' ? 'rgba(255, 159, 28, 0.25)' :
                              b.status === 'Dispatched' ? 'rgba(69, 123, 157, 0.25)' :
                              b.status === 'Completed' ? 'rgba(106, 5, 114, 0.25)' : 'rgba(230, 57, 70, 0.25)',
                            border: '1px solid var(--border-subtle)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Confirmed" style={{ background: '#131722', color: '#fff' }}>Confirmed</option>
                          <option value="In Preparation" style={{ background: '#131722', color: '#fff' }}>In Preparation</option>
                          <option value="Dispatched" style={{ background: '#131722', color: '#fff' }}>Dispatched</option>
                          <option value="Completed" style={{ background: '#131722', color: '#fff' }}>Completed</option>
                          <option value="Cancelled" style={{ background: '#131722', color: '#fff' }}>Cancelled</option>
                        </select>

                        {/* Total Price with Interactive Admin Amount Editor */}
                        {editingBookingCode === b.bookingCode ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-gold)' }}>
                            <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.9rem' }}>₹</span>
                            <input
                              type="number"
                              value={editingAmountInput}
                              onChange={(e) => setEditingAmountInput(e.target.value)}
                              placeholder="Amount"
                              autoFocus
                              style={{
                                width: '85px',
                                padding: '3px 6px',
                                background: '#0b0d12',
                                border: '1px solid var(--border-gold)',
                                borderRadius: '4px',
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                outline: 'none'
                              }}
                            />
                            <button
                              type="button"
                              title={lang === 'ar' ? 'حفظ المبلغ المعدل' : 'Save Modified Amount'}
                              onClick={() => {
                                updatePartyBookingAmount(b.bookingCode, editingAmountInput);
                                setEditingBookingCode(null);
                              }}
                              style={{
                                background: 'linear-gradient(135deg, #2a9d8f, #21867a)',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '4px',
                                padding: '4px 7px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              type="button"
                              title={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                              onClick={() => setEditingBookingCode(null)}
                              style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: '#adb5bd',
                                borderRadius: '4px',
                                padding: '4px 7px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                              {formatCurrency(b.totalPrice)}
                            </span>
                            <button
                              type="button"
                              title={lang === 'ar' ? 'تعديل مبلغ الحجز' : 'Modify party card amount'}
                              onClick={() => {
                                setEditingBookingCode(b.bookingCode);
                                setEditingAmountInput(b.totalPrice);
                              }}
                              style={{
                                background: 'rgba(212, 175, 55, 0.15)',
                                border: '1px solid var(--border-gold)',
                                color: 'var(--accent-gold-light)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '3px 8px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Edit size={12} color="var(--accent-gold)" />
                              <span>{lang === 'ar' ? 'تعديل المبلغ' : 'Modify Amount'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem', fontSize: '0.88rem' }}>
                      
                      {/* Event Date & Time (Highlighted) */}
                      <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={14} />
                          <span>{lang === 'ar' ? 'تاريخ ووقت الحفلة:' : 'Event Date & Time:'}</span>
                        </div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                          {b.eventDate}
                        </div>
                        <div style={{ color: 'var(--accent-gold-light)', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                          <Clock size={13} />
                          <span>{b.eventTime}</span>
                        </div>
                      </div>

                      {/* Venue Location Address */}
                      <div style={{ background: 'rgba(11, 13, 18, 0.6)', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={14} />
                          <span>{lang === 'ar' ? 'الموقع / العنوان:' : 'Venue Address:'}</span>
                        </div>
                        <div style={{ color: '#fff', fontWeight: 600 }}>
                          {b.eventLocation}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {b.potsCount} Hookah Pots • {b.guestCount || 'Standard group'}
                        </div>
                      </div>

                      {/* Organizer Contact */}
                      <div style={{ background: 'rgba(11, 13, 18, 0.6)', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Users size={14} />
                          <span>{lang === 'ar' ? 'بيانات المنظم:' : 'Organizer:'}</span>
                        </div>
                        <div style={{ color: '#fff', fontWeight: 700 }}>
                          {b.organizerName}
                        </div>
                        <div style={{ color: '#25D366', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '3px' }}>
                          <Phone size={13} />
                          <span>{b.organizerPhone}</span>
                        </div>
                      </div>

                      {/* Required Card Guarantee Info */}
                      <div style={{ background: 'rgba(11, 13, 18, 0.6)', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CreditCard size={14} />
                          <span>{lang === 'ar' ? 'بطاقة الضمان المطلوبة:' : 'Required Card Guarantee:'}</span>
                        </div>
                        <div style={{ color: '#fff', fontWeight: 700 }}>
                          {b.cardDetails?.cardBrand || 'Card'} {b.cardDetails?.cardNumberMasked || '•••• 4242'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                          Exp: {b.cardDetails?.expiry || '12/28'} • {b.needCoalMasterAttendant ? '🔥 Attendant: Yes' : 'Attendant: No'}
                        </div>
                      </div>

                    </div>

                    {/* Card Actions Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {lang === 'ar' ? 'سُجل في:' : 'Booked on:'} {b.createdAt || 'Recent'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {/* 1. Open Customer WhatsApp Confirmation */}
                        <a
                          href={getWhatsAppUrl(b.organizerPhone, formatUserPartyWhatsAppMessage(b, lang))}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'linear-gradient(135deg, #25D366, #128C7E)',
                            color: '#fff',
                            textDecoration: 'none',
                            padding: '0.45rem 0.9rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Send size={13} />
                          <span>{lang === 'ar' ? 'واتساب العميل' : 'WhatsApp Customer'}</span>
                          <ExternalLink size={12} />
                        </a>

                        {/* 3. Send WhatsApp Alert to Admin */}
                        <a
                          href={getWhatsAppUrl(adminWhatsAppPhone, formatAdminPartyWhatsAppMessage(b))}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'rgba(212, 175, 55, 0.15)',
                            border: '1px solid var(--border-gold)',
                            color: 'var(--accent-gold-light)',
                            textDecoration: 'none',
                            padding: '0.45rem 0.9rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <ShieldCheck size={14} color="var(--accent-gold)" />
                          <span>{lang === 'ar' ? 'إشعار واتساب الإدارة' : 'Notify Admin WhatsApp'}</span>
                          <ExternalLink size={12} />
                        </a>

                        {/* Cancel / Delete Booking Button */}
                        <button
                          type="button"
                          title={lang === 'ar' ? 'إلغاء وحذف الحجز مع إشعار الطرفين عبر الواتساب' : 'Cancel & delete party booking with WhatsApp notifications for both'}
                          onClick={() => setPartyToCancelModal(b)}
                          style={{
                            background: 'rgba(230, 57, 70, 0.15)',
                            border: '1px solid rgba(230, 57, 70, 0.3)',
                            color: '#e63946',
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>{lang === 'ar' ? 'إلغاء / حذف' : 'Cancel / Delete'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* PARTY CANCELLATION & WHATSAPP NOTIFICATION MODAL */}
      {partyToCancelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 10, 0.88)',
          backdropFilter: 'blur(10px)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '2rem',
            position: 'relative',
            boxShadow: 'var(--shadow-card)',
            maxHeight: '92vh',
            overflowY: 'auto',
            border: '1px solid rgba(230, 57, 70, 0.4)'
          }}>
            {/* Header with Alert Icon */}
            <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.25), rgba(230, 57, 70, 0.1))',
                border: '2px solid #e63946',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.8rem',
                boxShadow: '0 0 20px rgba(230, 57, 70, 0.3)'
              }}>
                <AlertTriangle size={34} color="#e63946" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem', color: '#fff' }}>
                {lang === 'ar' ? 'إلغاء حجز الحفلة وإشعار الطرفين عبر الواتساب' : 'Cancel Party Booking & Notify Both via WhatsApp'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {lang === 'ar'
                  ? 'عند تأكيد الإلغاء، سيتم فك حجز معدات الشيشة وإرسال إشعار الإلغاء الرسمي لكل من العميل والإدارة عبر الواتساب.'
                  : 'Canceling will release hookah pots inventory and send official WhatsApp cancellation notices to both customer and admin.'}
              </p>
            </div>

            {/* Booking Details Summary */}
            <div style={{ background: 'rgba(11, 13, 18, 0.85)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.05rem' }}>
                  {partyToCancelModal.bookingCode}
                </span>
                <span style={{ fontWeight: 800, color: '#e63946', fontSize: '0.85rem', background: 'rgba(230,57,70,0.15)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                  {lang === 'ar' ? 'سيتم الإلغاء' : 'Will be Cancelled'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>{lang === 'ar' ? 'الحزمة:' : 'Package:'}</span>
                  <strong style={{ color: '#fff' }}>{lang === 'ar' ? partyToCancelModal.packageNameAr : partyToCancelModal.packageNameEn}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>{lang === 'ar' ? 'عدد الشيشات:' : 'Pots:'}</span>
                  <strong style={{ color: '#fff' }}>{partyToCancelModal.potsCount} Pots</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>{lang === 'ar' ? 'الموعد المحدد:' : 'Scheduled Date & Time:'}</span>
                  <strong style={{ color: 'var(--accent-gold)' }}>{partyToCancelModal.eventDate} @ {partyToCancelModal.eventTime}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>{lang === 'ar' ? 'المنظم:' : 'Organizer:'}</span>
                  <strong style={{ color: '#fff' }}>{partyToCancelModal.organizerName}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{partyToCancelModal.eventLocation}</span>
                <span style={{ color: '#2a9d8f', fontWeight: 600 }}>Card Guarantee Released • ₹0 Charged</span>
              </div>
            </div>

            {/* TWO DIRECT WHATSAPP BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.4rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.1rem' }}>
                {lang === 'ar' ? 'روابط إشعارات الواتساب المباشرة للطرفين:' : 'Direct WhatsApp Cancellation Links (Both Parties):'}
              </div>

              {/* 1. Customer WhatsApp Cancellation */}
              <a
                href={getWhatsAppUrl(partyToCancelModal.organizerPhone, formatUserPartyCancellationWhatsAppMessage(partyToCancelModal, lang))}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#ffffff',
                  padding: '0.8rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 3px 12px rgba(37, 211, 102, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={16} />
                  <span>{lang === 'ar' ? `1. إشعار العميل بالإلغاء عبر واتساب (${partyToCancelModal.organizerPhone})` : `1. Send Cancellation WhatsApp to Customer (${partyToCancelModal.organizerPhone})`}</span>
                </div>
                <ExternalLink size={14} />
              </a>

              {/* 2. Admin WhatsApp Cancellation */}
              <a
                href={getWhatsAppUrl(adminWhatsAppPhone, formatAdminPartyCancellationWhatsAppMessage(partyToCancelModal))}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--accent-gold-light)',
                  padding: '0.8rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="var(--accent-gold)" />
                  <span>{lang === 'ar' ? `2. إشعار الإدارة بالإلغاء عبر واتساب (+${adminWhatsAppPhone})` : `2. Send Cancellation WhatsApp to Admin (+${adminWhatsAppPhone})`}</span>
                </div>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* ACTION CONFIRMATION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                type="button"
                id="confirm-cancel-and-notify-both-btn"
                onClick={() => {
                  // 1. Open customer WhatsApp cancellation message
                  openWhatsApp(partyToCancelModal.organizerPhone, formatUserPartyCancellationWhatsAppMessage(partyToCancelModal, lang));
                  // 2. Open admin WhatsApp cancellation dispatch
                  try {
                    openWhatsApp(adminWhatsAppPhone, formatAdminPartyCancellationWhatsAppMessage(partyToCancelModal));
                  } catch (e) {
                    console.warn('Admin whatsapp popup blocked or failed', e);
                  }
                  // 3. Delete / remove booking from roster
                  deletePartyBooking(partyToCancelModal.bookingCode);
                  // 4. Feedback
                  showToast(
                    lang === 'ar'
                      ? `تم إلغاء وحذف الحجز ${partyToCancelModal.bookingCode} وإرسال إشعار الواتساب للطرفين`
                      : `Booking ${partyToCancelModal.bookingCode} canceled! WhatsApp notifications sent to both customer and admin.`,
                    'info'
                  );
                  setPartyToCancelModal(null);
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #e63946, #b02a37)',
                  border: 'none',
                  color: '#fff',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(230, 57, 70, 0.35)'
                }}
              >
                <Trash2 size={16} />
                <span>{lang === 'ar' ? 'تأكيد الإلغاء والحذف وإرسال واتساب للطرفين' : 'Confirm Cancellation & Remove (Notify Both)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  // Mark as Cancelled in the roster rather than deleting completely
                  openWhatsApp(partyToCancelModal.organizerPhone, formatUserPartyCancellationWhatsAppMessage(partyToCancelModal, lang));
                  try {
                    openWhatsApp(adminWhatsAppPhone, formatAdminPartyCancellationWhatsAppMessage(partyToCancelModal));
                  } catch (e) {
                    console.warn('Admin whatsapp popup blocked or failed', e);
                  }
                  updatePartyBookingStatus(partyToCancelModal.bookingCode, 'Cancelled');
                  showToast(
                    lang === 'ar'
                      ? `تم تعيين الحجز ${partyToCancelModal.bookingCode} كملغى وإرسال إشعار الواتساب للطرفين`
                      : `Booking ${partyToCancelModal.bookingCode} marked as Cancelled & both parties notified via WhatsApp!`,
                    'info'
                  );
                  setPartyToCancelModal(null);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  padding: '0.7rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <span>{lang === 'ar' ? 'إلغاء الحجز مع الاحتفاظ به كـ "ملغى" في السجل' : 'Mark as "Cancelled" (Keep in Roster Records)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPartyToCancelModal(null)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  marginTop: '0.2rem'
                }}
              >
                {lang === 'ar' ? 'تراجع / الإبقاء على الحجز' : 'Keep Booking (Abort)'}
              </button>
            </div>

          </div>
        </div>
      )}

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

          {/* Admin WhatsApp Phone Notification Setup */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Phone size={18} color="#25D366" />
              <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>
                {lang === 'ar' ? 'رقم هاتف الواتساب لإشعارات الإدارة' : 'Admin WhatsApp Notification Phone'}
              </h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {lang === 'ar'
                ? 'الرقم الذي يستلم إشعارات وتنبيهات حجز حفلات الشيشة فوراً مع تفاصيل المنظمين والبطاقات وتاريخ ووقت الحفلة.'
                : 'The admin phone number that receives instant WhatsApp party catering alerts, organizer contacts, card guarantee statuses, and schedule details.'}
            </p>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <input
                type="tel"
                value={adminPhoneInput}
                onChange={(e) => setAdminPhoneInput(e.target.value)}
                placeholder="e.g. 919960154761"
                style={{
                  flex: 1,
                  minWidth: '220px',
                  padding: '0.7rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const cleaned = adminPhoneInput.replace(/[^\d+]/g, '');
                  setAdminWhatsAppPhone(cleaned);
                  showToast(
                    lang === 'ar' ? 'تم حفظ رقم هاتف الإدارة بنجاح!' : 'Admin WhatsApp phone saved successfully!',
                    'success'
                  );
                }}
                className="btn-gold"
                style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
              >
                <Save size={16} />
                <span>{lang === 'ar' ? 'حفظ رقم الإدارة' : 'Save Admin Phone'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const msg = `🔔 *ARABIC SHISHA TEST NOTIFICATION*\nWhatsApp notifications configured successfully for Admin (+${adminPhoneInput}). Ready to receive new party catering bookings!`;
                  openWhatsApp(adminPhoneInput, msg);
                }}
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.7rem 1.2rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Send size={15} />
                <span>{lang === 'ar' ? 'اختبار الإشعار' : 'Test Alert'}</span>
              </button>
            </div>
          </div>

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
