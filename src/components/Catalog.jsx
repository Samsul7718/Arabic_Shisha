import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SHISHA_ITEMS, SHISHA_CATEGORIES, BRANDS_LIST } from '../data/shishaData';
import { Search, Filter, Star, CheckCircle, AlertTriangle, XCircle, Plus, Info, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const Catalog = () => {
  const {
    lang,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    inStockOnly,
    setInStockOnly,
    setSelectedItemDetail
  } = useApp();

  const [selectedBrand, setSelectedBrand] = useState('All Brands');

  // Filtering Logic
  const filteredItems = SHISHA_ITEMS.filter((item) => {
    // Search Query Filter
    const matchesSearch =
      searchQuery === '' ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameAr.includes(searchQuery) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Filter
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // Brand Filter
    const matchesBrand = selectedBrand === 'All Brands' || item.brand === selectedBrand;

    // Stock Filter
    const matchesStock = !inStockOnly || item.stockStatus !== 'out_of_stock';

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Search & Brand Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lang === 'ar' ? 'auto' : '1rem', right: lang === 'ar' ? '1rem' : 'auto' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن ماركة (روسية، أفضال، الفاخر) أو منتج...' : 'Search brand (Russian, Afzal, Maya, Al-Fakher)...'}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                paddingLeft: lang === 'ar' ? '1rem' : '2.8rem',
                paddingRight: lang === 'ar' ? '2.8rem' : '1rem',
                background: 'rgba(11, 13, 18, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Brand Filter Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tag size={16} color="var(--accent-gold)" />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{
                background: 'rgba(11, 13, 18, 0.8)',
                border: '1px solid var(--border-gold)',
                color: 'var(--text-primary)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {BRANDS_LIST.map((b) => (
                <option key={b} value={b}>
                  {b === 'All Brands' ? (lang === 'ar' ? 'جميع الماركات' : 'All Brands') : b}
                </option>
              ))}
            </select>
          </div>

          {/* In Stock Only Switch */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none', color: 'var(--accent-gold-light)', fontWeight: 600, fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#d4af37', cursor: 'pointer' }}
            />
            <span>{lang === 'ar' ? 'متوفر بالمخزن فقط' : 'In Stock Only'}</span>
          </label>

        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
          {SHISHA_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: isCatActive ? 'linear-gradient(135deg, #d4af37, #ff9f1c)' : 'rgba(255,255,255,0.05)',
                  border: isCatActive ? 'none' : '1px solid var(--border-subtle)',
                  color: isCatActive ? '#0b0d12' : 'var(--text-secondary)',
                  padding: '0.45rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontWeight: isCatActive ? 700 : 500,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {lang === 'ar' ? cat.nameAr : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Products & Parlor Items */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Info size={40} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
          <h3>{lang === 'ar' ? 'لم نجد أي منتج يطابق خيارات البحث' : 'No products found matching your filter.'}</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {lang === 'ar' ? 'جرب اختيار ماركة أخرى أو إلغاء تفعيل تصفية المخزن' : 'Try selecting another brand or disabling the "In Stock Only" toggle.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item) => {
            const isOutOfStock = item.stockStatus === 'out_of_stock';
            const isLowStock = item.stockStatus === 'low_stock';

            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  opacity: isOutOfStock ? 0.7 : 1,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Product Image & Badge Overlay */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isOutOfStock ? 'grayscale(80%)' : 'none' }}
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(19, 23, 34, 0.95), transparent)' }} />
                  
                  {/* Brand Tag Top Left */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--accent-gold-light)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {item.brand}
                  </span>

                  {/* Stock Status Indicator Pill */}
                  <div style={{ position: 'absolute', bottom: '10px', left: '12px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {isOutOfStock && (
                      <span style={{ background: 'rgba(230, 57, 70, 0.9)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <XCircle size={14} /> {lang === 'ar' ? 'نفدت الكمية' : 'Out of Stock'}
                      </span>
                    )}
                    {isLowStock && (
                      <span style={{ background: 'rgba(255, 159, 28, 0.9)', color: '#000', fontSize: '0.75rem', fontWeight: 800, padding: '3px 9px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={14} /> {lang === 'ar' ? `متبقي ${item.stockQty} فقط` : `Low Stock (${item.stockQty} left)`}
                      </span>
                    )}
                    {item.stockStatus === 'in_stock' && (
                      <span style={{ background: 'rgba(42, 157, 143, 0.9)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={14} /> {lang === 'ar' ? 'متوفر بالمخزن' : 'In Stock'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {lang === 'ar' ? item.nameAr : item.nameEn}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#ffb703', fontSize: '0.85rem', fontWeight: 700 }}>
                        <Star size={14} fill="#ffb703" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '38px', lineHeight: '1.4' }}>
                      {lang === 'ar' ? item.descriptionAr : item.descriptionEn}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => setSelectedItemDetail(item)}
                      style={{
                        background: isOutOfStock ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #d4af37, #ff9f1c)',
                        color: isOutOfStock ? 'var(--text-muted)' : '#0b0d12',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        boxShadow: isOutOfStock ? 'none' : 'var(--shadow-gold-glow)'
                      }}
                    >
                      <Plus size={16} />
                      <span>{isOutOfStock ? (lang === 'ar' ? 'غير متوفر' : 'Out of Stock') : (lang === 'ar' ? 'إضافة للشراء' : 'Add to Cart')}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
