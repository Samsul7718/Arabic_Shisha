import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, XCircle, Star, Plus } from 'lucide-react';
import { ProductCardImage } from './ProductCardImage';

export const ItemDetailModal = () => {
  const { lang, selectedItemDetail, setSelectedItemDetail, addToCart, adminWhatsAppPhone } = useApp();

  if (!selectedItemDetail) return null;

  const isOutOfStock = selectedItemDetail.stockStatus === 'out_of_stock';

  const handleConfirmAddToCart = () => {
    addToCart(selectedItemDetail);
    setSelectedItemDetail(null);
  };

  return (
    <div
      onClick={() => setSelectedItemDetail(null)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '1.5rem',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(212, 175, 55, 0.15)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedItemDetail(null)}
          title={lang === 'ar' ? 'إغلاق' : 'Close'}
          style={{
            position: 'absolute',
            top: '1rem',
            right: lang === 'ar' ? 'auto' : '1rem',
            left: lang === 'ar' ? '1rem' : 'auto',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#fff',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(230, 57, 70, 0.8)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={18} />
        </button>

        {/* Big Product Image with Prominent Available Logo */}
        <div
          style={{
            width: '100%',
            height: '350px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {/* Prominent Available / Stock Status Logo */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: lang === 'ar' ? 'auto' : '14px',
              right: lang === 'ar' ? '14px' : 'auto',
              zIndex: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: isOutOfStock
                ? 'rgba(230, 57, 70, 0.92)'
                : 'rgba(11, 15, 23, 0.88)',
              border: isOutOfStock ? '1.5px solid #e63946' : '1.5px solid #22c55e',
              boxShadow: isOutOfStock
                ? '0 0 16px rgba(230, 57, 70, 0.5)'
                : '0 0 18px rgba(34, 197, 94, 0.45)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: isOutOfStock ? '#ffffff' : '#22c55e',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            {isOutOfStock ? (
              <>
                <XCircle size={17} color="#ffffff" strokeWidth={2.5} />
                <span>{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</span>
              </>
            ) : (
              <>
                <CheckCircle size={17} color="#22c55e" strokeWidth={2.5} />
                <span>{lang === 'ar' ? 'متوفر' : 'Available'}</span>
              </>
            )}
          </div>

          <ProductCardImage
            primaryImage={selectedItemDetail.image}
            secondaryImage={selectedItemDetail.secondaryImage}
            alt={lang === 'ar' ? selectedItemDetail.nameAr : selectedItemDetail.nameEn}
            height="350px"
            objectFit="contain"
            lang={lang}
          />
        </div>

        {/* Product Meta Tags & Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {selectedItemDetail.brand && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold-light)',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid var(--border-gold)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {selectedItemDetail.brand}
              </span>
            )}
            {selectedItemDetail.profile && selectedItemDetail.profile !== 'Hardware' && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#2ec4b6',
                  background: 'rgba(46, 196, 182, 0.15)',
                  border: '1px solid rgba(46, 196, 182, 0.3)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {selectedItemDetail.profile}
              </span>
            )}
            {selectedItemDetail.strength && selectedItemDetail.strength !== 'N/A' && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {selectedItemDetail.strength}
              </span>
            )}
            {selectedItemDetail.badge && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#ff9f1c',
                  background: 'rgba(255, 159, 28, 0.12)',
                  border: '1px solid rgba(255, 159, 28, 0.3)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {selectedItemDetail.badge}
              </span>
            )}
          </div>

          {selectedItemDetail.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ffb703', fontSize: '0.9rem', fontWeight: 700 }}>
              <Star size={16} fill="#ffb703" />
              <span>{selectedItemDetail.rating}</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.6rem 0', lineHeight: 1.3 }}>
          {lang === 'ar' ? selectedItemDetail.nameAr : selectedItemDetail.nameEn}
        </h2>

        {/* Product Description */}
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
          {lang === 'ar' ? selectedItemDetail.descriptionAr : selectedItemDetail.descriptionEn}
        </p>

        {/* Footer Actions (No price, clean buttons) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.8rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap'
        }}>
          {/* Status Indicator */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            {isOutOfStock ? (
              <span style={{ color: '#e63946', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <XCircle size={18} color="#e63946" />
                <span>{lang === 'ar' ? 'غير متوفر حالياً' : 'Currently Unavailable'}</span>
              </span>
            ) : (
              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={18} color="#22c55e" />
                <span>{lang === 'ar' ? 'متوفر للطلب' : 'Available for Order'}</span>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* WhatsApp Direct Order / Inquiry */}
            <a
              href={`https://wa.me/${adminWhatsAppPhone || '919960154761'}?text=${encodeURIComponent(
                lang === 'ar'
                  ? `مرحباً، أود الاستفسار والطلب لمنتج:\n${selectedItemDetail.nameAr}\nالماركة: ${selectedItemDetail.brand || 'أصلي'}`
                  : `Hello! I would like to enquire and order:\n${selectedItemDetail.nameEn}\nBrand: ${selectedItemDetail.brand || 'Original'}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title={lang === 'ar' ? 'طلب عبر واتساب' : 'Order via WhatsApp'}
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: '#ffffff',
                padding: '0.6rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 700,
                fontSize: '0.86rem',
                boxShadow: '0 2px 10px rgba(37, 211, 102, 0.35)',
                transition: 'transform 0.2s ease'
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.333 5.004L2 22l5.133-1.343a9.963 9.963 0 0 0 4.876 1.28h.005c5.505 0 9.989-4.477 9.99-9.984A9.957 9.957 0 0 0 18.995 5.1 9.957 9.957 0 0 0 12.012 2zm.005 16.347h-.004a8.28 8.28 0 0 1-4.225-1.157l-.303-.18-3.138.823.837-3.06-.197-.314a8.277 8.277 0 0 1-1.27-4.475c.002-4.57 3.717-8.283 8.29-8.283 2.213.001 4.293.863 5.857 2.43 1.564 1.566 2.423 3.647 2.422 5.86-.002 4.571-3.718 8.284-8.29 8.284zm4.542-6.208c-.249-.124-1.474-.727-1.703-.81-.229-.083-.395-.124-.561.124-.166.248-.644.81-.789.975-.145.166-.29.186-.539.062-.249-.124-1.053-.388-2.006-1.238-.742-.661-1.243-1.478-1.388-1.727-.145-.248-.016-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.248.249-.415.083-.166.042-.311-.021-.435-.062-.124-.561-1.349-.769-1.847-.202-.486-.407-.42-.561-.428l-.478-.009c-.166 0-.435.062-.663.311-.229.248-.871.851-.871 2.075 0 1.224.891 2.406 1.015 2.572.124.166 1.753 2.677 4.248 3.754.593.256 1.057.409 1.418.524.596.19 1.138.163 1.566.099.478-.072 1.474-.602 1.681-1.183.207-.58.207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z"/>
              </svg>
              <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </a>

            {/* Add to Order Button */}
            <button
              onClick={handleConfirmAddToCart}
              disabled={isOutOfStock}
              style={{
                background: isOutOfStock
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #d4af37, #ff9f1c)',
                color: isOutOfStock ? 'var(--text-muted)' : '#0b0d12',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                boxShadow: isOutOfStock ? 'none' : 'var(--shadow-gold-glow)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.88rem'
              }}
            >
              <Plus size={16} />
              <span>{lang === 'ar' ? 'إضافة للطلب' : 'Add to Order'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
