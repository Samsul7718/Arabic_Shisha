import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PARTY_PACKAGES } from '../data/shishaData';
import {
  Sparkles,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Flame,
  Phone,
  CreditCard,
  ShieldCheck,
  Lock,
  ExternalLink,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { ProductCardImage } from './ProductCardImage';
import confetti from 'canvas-confetti';
import {
  formatUserPartyWhatsAppMessage,
  formatAdminPartyWhatsAppMessage,
  openWhatsApp,
  getWhatsAppUrl
} from '../utils/whatsapp';

export const PartyCateringSection = () => {
  const {
    lang,
    addPartyBooking,
    showToast,
    partyBookings,
    adminWhatsAppPhone,
    setActiveTab,
    setAdminSubTab
  } = useApp();

  const [selectedPackage, setSelectedPackage] = useState(PARTY_PACKAGES[1]); // Gold Sultan Party
  const [eventDate, setEventDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [eventTime, setEventTime] = useState('08:00 PM');
  const [eventLocation, setEventLocation] = useState('');
  const [guestCount, setGuestCount] = useState(PARTY_PACKAGES[1].recommendedFor);
  const [organizerName, setOrganizerName] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');
  const [needCoalMasterAttendant, setNeedCoalMasterAttendant] = useState(true);

  // Required Card Details for Party Booking
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Confirmation Modal State
  const [confirmedBookingModal, setConfirmedBookingModal] = useState(null);

  // Preset Time Slots for Quick Selection
  const timePresets = ['06:00 PM', '07:30 PM', '08:00 PM', '09:30 PM', '10:30 PM', '11:00 PM'];

  const calculateTotalPartyPrice = () => {
    let price = selectedPackage.basePrice;
    if (needCoalMasterAttendant && !selectedPackage.attendantOption) {
      price += 1000; // Add 150 for coal master attendant on smaller packs
    }
    return price;
  };

  // Format Card Number with 4-digit spacing
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry with MM/YY
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  // Detect Card Brand for Visual Feedback
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'Mastercard';
    if (clean.startsWith('3')) return 'Amex';
    return 'Credit / Debit Card';
  };

  const handleBookParty = (e) => {
    e.preventDefault();

    // 1. Basic Details Validation
    if (!organizerName.trim() || !organizerPhone.trim() || !eventLocation.trim()) {
      showToast(
        lang === 'ar'
          ? 'الرجاء تعبئة تفاصيل الحجز، الاسم، ورقم الهاتف'
          : 'Please provide event location, organizer name, and phone number.',
        'error'
      );
      return;
    }

    if (!eventDate || !eventTime) {
      showToast(
        lang === 'ar' ? 'يرجى تحديد تاريخ ووقت الحفلة' : 'Please select event date and start time.',
        'error'
      );
      return;
    }

    // 2. Required Card Validation
    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      showToast(
        lang === 'ar'
          ? 'يرجى إدخال رقم بطاقة صحيح (16 رقماً) لتأكيد الحجز'
          : 'Please enter a valid 16-digit card number to guarantee your party booking.',
        'error'
      );
      return;
    }

    if (!cardExpiry.trim() || cardExpiry.length < 4) {
      showToast(
        lang === 'ar' ? 'يرجى إدخال تاريخ انتهاء البطاقة (MM/YY)' : 'Please enter card expiry date (MM/YY).',
        'error'
      );
      return;
    }

    if (!cardCvv.trim() || cardCvv.length < 3) {
      showToast(
        lang === 'ar' ? 'يرجى إدخال رمز الأمان CVV' : 'Please enter card CVV code.',
        'error'
      );
      return;
    }

    const partyBookingCode = `PARTY-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalPrice = calculateTotalPartyPrice();
    const last4 = cleanCard.slice(-4);
    const detectedBrand = getCardBrand();

    const newBooking = {
      id: `party_${Date.now()}`,
      bookingCode: partyBookingCode,
      packageId: selectedPackage.id,
      packageNameEn: selectedPackage.nameEn,
      packageNameAr: selectedPackage.nameAr,
      potsCount: selectedPackage.potsCount,
      eventDate,
      eventTime,
      eventLocation: eventLocation.trim(),
      guestCount: guestCount || selectedPackage.recommendedFor,
      organizerName: organizerName.trim(),
      organizerPhone: organizerPhone.trim(),
      needCoalMasterAttendant,
      cardDetails: {
        cardholderName: (cardholderName || organizerName).trim(),
        cardNumberMasked: `•••• •••• •••• ${last4}`,
        cardBrand: detectedBrand,
        expiry: cardExpiry
      },
      totalPrice,
      currency: '₹',
      status: 'Confirmed',
      createdAt: new Date().toLocaleString()
    };

    // Save to AppContext & localStorage
    addPartyBooking(newBooking);

    // Celebratory Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    // Requirement 1: User should get the party confirmation message with date and time in WhatsApp
    const userMessage = formatUserPartyWhatsAppMessage(newBooking, lang);
    openWhatsApp(newBooking.organizerPhone, userMessage);

    // Show booking receipt modal with action buttons
    setConfirmedBookingModal(newBooking);

    showToast(
      lang === 'ar'
        ? `تم حجز حفلة الشيشة بنجاح! كود الحجز: ${partyBookingCode}`
        : `Hookah Party catering reserved! Booking Ref: ${partyBookingCode}`,
      'success'
    );

    // Reset Form
    setOrganizerName('');
    setOrganizerPhone('');
    setEventLocation('');
    setCardNumber('');
    setCardholderName('');
    setCardExpiry('');
    setCardCvv('');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3.5rem' }}>

      {/* Top Banner & Quick Navigation */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center', position: 'relative' }}>

        {/* Admin Quick Jump Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.8rem' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setAdminSubTab('parties');
            }}
            className="btn-glass"
            style={{
              fontSize: '0.82rem',
              padding: '0.45rem 0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-gold-light)'
            }}
          >
            <Eye size={15} color="#d4af37" />
            <span>{lang === 'ar' ? `لوحة الإدارة: عرض كل حجوزات الحفلات (${partyBookings.length})` : `Admin: View All Party Bookings (${partyBookings.length})`}</span>
          </button>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--accent-gold)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.8rem' }}>
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'تنظيم الحفلات والمناسبات الخاصة' : 'Private Event & Party Catering'}</span>
        </div>

        <h2 className="gold-gradient-text" style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          {lang === 'ar' ? 'نظم حفلة شيشة فاخرة لمناسبتك' : 'Royal Hookah Party Catering at Your Venue'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
          {lang === 'ar'
            ? 'خدمة شيشة متكاملة للمنازل والفلل والأعراس. تشمل الشيشات الفاخرة، طاقم إدارة الفحم، وتأكيد فوري عبر الواتساب مع التاريخ والوقت.'
            : 'Complete VIP hookah catering for villas, parties, weddings, and resorts. Includes premium pots, flavor bars, dedicated coal masters, and instant WhatsApp booking notifications.'}
        </p>
      </div>

      <form onSubmit={handleBookParty} className="glass-panel" style={{ padding: '2rem' }}>

        {/* Step 1: Package Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-gold-light)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={18} color="#d4af37" />
              {lang === 'ar' ? '1. اختر حزمة الحفلة المطلوبة (Required Package Card)' : '1. Choose Hookah Party Catering Tier (Required Card)'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', background: 'rgba(212,175,55,0.1)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
              {selectedPackage.potsCount} Hookah Pots Selected
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
            {PARTY_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setGuestCount(pkg.recommendedFor);
                  }}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.22), rgba(255, 159, 28, 0.12))' : 'rgba(11, 13, 18, 0.65)',
                    border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? 'var(--shadow-gold-glow)' : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: lang === 'ar' ? 'auto' : '10px',
                      left: lang === 'ar' ? '10px' : 'auto',
                      background: 'var(--accent-gold)',
                      color: '#000',
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <CheckCircle size={12} />
                      <span>{lang === 'ar' ? 'المحددة' : 'Selected'}</span>
                    </div>
                  )}

                  <ProductCardImage
                    primaryImage={pkg.image}
                    secondaryImage={pkg.secondaryImage}
                    alt={lang === 'ar' ? pkg.nameAr : pkg.nameEn}
                    height="140px"
                    brand={`${pkg.potsCount} Pots`}
                    lang={lang}
                  />

                  <div style={{ padding: '1.2rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isSelected ? 'var(--accent-gold)' : '#fff', marginBottom: '0.4rem' }}>
                      {lang === 'ar' ? pkg.nameAr : pkg.nameEn}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                      {lang === 'ar' ? pkg.descriptionAr : pkg.descriptionEn}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={14} />
                      <span>{lang === 'ar' ? `مناسبة لـ: ${pkg.recommendedFor}` : `Recommended: ${pkg.recommendedFor}`}</span>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '0.7rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.25rem' }}>
                        {formatCurrency(pkg.basePrice)}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
                        {pkg.potsCount} Hookah Pots
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Date, Time & Venue */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="#d4af37" />
            {lang === 'ar' ? '2. موعد ومكان الحفلة (Date & Time Required)' : '2. Event Date, Time & Venue (Date & Time Required)'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>

            {/* Event Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
                {lang === 'ar' ? 'تاريخ الحفلة *' : 'Party Event Date *'}
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(11, 13, 18, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Event Time */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '5px' }} />
                {lang === 'ar' ? 'وقت بدء الحفلة *' : 'Party Start Time *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 08:00 PM"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(11, 13, 18, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Estimated Guests */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                <Users size={14} style={{ display: 'inline', marginRight: '5px' }} />
                {lang === 'ar' ? 'عدد الضيوف المتوقع:' : 'Guest Count:'}
              </label>
              <input
                type="text"
                placeholder={selectedPackage.recommendedFor}
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(11, 13, 18, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* Quick Time Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {lang === 'ar' ? 'أوقات سريعة شائعة:' : 'Popular times:'}
            </span>
            {timePresets.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setEventTime(t)}
                style={{
                  background: eventTime === t ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                  color: eventTime === t ? '#000' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Venue Location Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '5px' }} />
              {lang === 'ar' ? 'موقع وعنوان الحفلة بالكامل *' : 'Event Location / Venue Address *'}
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'ar' ? 'عنوان الفيلا، القاعة، الاستراحة، أو المنتجع بالتفصيل' : 'e.g. Palm Jumeirah Villa 42 / Grand Hall 7, Mumbai or Pune'}
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(11, 13, 18, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {/* Step 3: Organizer Contact & Staff */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} color="#d4af37" />
            {lang === 'ar' ? '3. بيانات المنظم وخادم الفحم' : '3. Organizer Contact & Staffing'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'اسم المنظم *' : 'Organizer Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'ar' ? 'أدخل اسمك بالكامل' : 'e.g. John Doe / Tariq Al-Hashmi'}
                value={organizerName}
                onChange={(e) => {
                  setOrganizerName(e.target.value);
                  if (!cardholderName) setCardholderName(e.target.value);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(11, 13, 18, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'رقم الواتساب لاستلام التأكيد *' : 'WhatsApp Phone (For Confirmation) *'}
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 9960154761 or 9876543210"
                value={organizerPhone}
                onChange={(e) => setOrganizerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(11, 13, 18, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#25D366', marginTop: '4px', display: 'block' }}>
                ✓ {lang === 'ar' ? 'سيتم إرسال رسالة التأكيد بالتاريخ والوقت مباشرة عبر هذا الرقم في الواتساب' : 'Party confirmation message with date and time will be sent to this WhatsApp'}
              </span>
            </div>
          </div>

          {/* Coal Master Attendant Toggle */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(11, 13, 18, 0.75)',
            padding: '1rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-gold)' }}>
                {lang === 'ar' ? 'إضافة خادم فحم متخصص للحفلة (On-Site Coal Master)' : 'Add Dedicated On-Site Hookah Attendant / Coal Master'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'يقوم بإشعال وتبديل الفحم وتجهيز النكهات طوال فترة الحفلة' : 'Staff handles continuous coal replenishment & fresh flavor heads during the party.'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={needCoalMasterAttendant}
              onChange={(e) => setNeedCoalMasterAttendant(e.target.checked)}
              style={{ accentColor: '#d4af37', width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Step 4: REQUIRED CARD FOR PARTY */}
        <div style={{
          marginBottom: '2rem',
          padding: '1.4rem',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(11, 13, 18, 0.8))',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-gold)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-gold-light)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="#d4af37" />
              {lang === 'ar' ? '4. بطاقة ضمان وتأكيد الحجز المطلوبة (Required Card for Party)' : '4. Required Payment & Guarantee Card for Party'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#2a9d8f' }}>
              <Lock size={14} />
              <span>256-bit Secure TLS Guarantee</span>
            </div>
          </div>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
            {lang === 'ar'
              ? 'مطلوب إدخال بيانات البطاقة لحجز موعد الحفلة وتأمين معدات الشيشة والكوادر الميدانية.'
              : 'A valid card is required to lock your party date, reserve hookah pots equipment, and confirm catering crew.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

            {/* Card Number */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'رقم البطاقة المطلوب (16 رقم) *' : 'Card Number (Required) *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="4532 8920 1122 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(11, 13, 18, 0.9)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '1rem',
                    letterSpacing: '1px'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: lang === 'ar' ? 'auto' : '12px',
                  left: lang === 'ar' ? '12px' : 'auto',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold)'
                }}>
                  {getCardBrand()}
                </span>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'اسم حامل البطاقة *' : 'Cardholder Name *'}
              </label>
              <input
                type="text"
                required
                placeholder="Name as on card"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(11, 13, 18, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'تاريخ الانتهاء (MM/YY) *' : 'Expiry Date (MM/YY) *'}
              </label>
              <input
                type="text"
                required
                placeholder="12/28"
                value={cardExpiry}
                onChange={handleExpiryChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(11, 13, 18, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* CVV */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                {lang === 'ar' ? 'رمز الأمان (CVV) *' : 'CVV Security Code *'}
              </label>
              <input
                type="password"
                required
                maxLength={4}
                placeholder="•••"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(11, 13, 18, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={15} color="var(--accent-gold)" />
            <span>{lang === 'ar' ? 'بيانات البطاقة مشفرة بالكامل ولا يتم تخزين أرقام الـ CVV لأمانك المطلق.' : 'Card information is securely processed and masked for your security.'}</span>
          </div>
        </div>

        {/* Pricing Summary & "Book Hookah Party" Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block' }}>
              {lang === 'ar' ? 'إجمالي تكلفة تنظيم الحفلة:' : 'Total Hookah Party Quote:'}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {formatCurrency(calculateTotalPartyPrice())}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({selectedPackage.potsCount} Pots • {eventDate} @ {eventTime})
              </span>
            </div>
          </div>

          <button
            type="submit"
            id="book-hookah-party-btn"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
              border: 'none',
              color: '#0b0d12',
              padding: '0.85rem 2.2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-gold-glow)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              transition: 'transform 0.2s ease'
            }}
          >
            <CheckCircle size={22} />
            <span>{lang === 'ar' ? 'تأكيد حجز حفلة الشيشة' : 'Book Hookah Party'}</span>
          </button>
        </div>

      </form>

      {/* CONFIRMATION MODAL WITH WHATSAPP CONFIRMATIONS */}
      {confirmedBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 10, 0.88)',
          backdropFilter: 'blur(10px)',
          zIndex: 1100,
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
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>

            {/* Header Badge */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.35)',
                marginBottom: '0.8rem'
              }}>
                <CheckCircle size={36} color="#fff" />
              </div>
              <h3 className="gold-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.3rem' }}>
                {lang === 'ar' ? 'تم تأكيد حجز حفلة الشيشة!' : 'Hookah Party Reserved Successfully!'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                {lang === 'ar' ? 'تم تسجيل وتوثيق طلب الحفلة وإرسال الإشعارات المطلوبة' : 'Your booking details and WhatsApp notifications are ready.'}
              </p>
            </div>

            {/* Booking Summary Card */}
            <div style={{ background: 'rgba(11, 13, 18, 0.85)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', marginBottom: '1.5rem' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'رمز الحجز:' : 'Booking Ref:'}
                </span>
                <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.1rem' }}>
                  {confirmedBookingModal.bookingCode}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.88rem', marginBottom: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                    {lang === 'ar' ? 'حزمة الحفلة:' : 'Party Tier:'}
                  </span>
                  <strong style={{ color: '#fff' }}>{lang === 'ar' ? confirmedBookingModal.packageNameAr : confirmedBookingModal.packageNameEn}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                    {lang === 'ar' ? 'عدد الشيشات:' : 'Pots Count:'}
                  </span>
                  <strong style={{ color: '#fff' }}>{confirmedBookingModal.potsCount} Hookahs</strong>
                </div>

                {/* HIGHLIGHTED DATE & TIME */}
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--accent-gold)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {lang === 'ar' ? 'تاريخ الحفلة:' : 'Event Date:'}
                  </span>
                  <strong style={{ color: '#fff' }}>{confirmedBookingModal.eventDate}</strong>
                </div>
                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--accent-gold)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {lang === 'ar' ? 'وقت الحفلة:' : 'Event Time:'}
                  </span>
                  <strong style={{ color: '#fff' }}>{confirmedBookingModal.eventTime}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>
                  {lang === 'ar' ? 'الموقع / العنوان:' : 'Venue Address:'}
                </span>
                <span style={{ color: '#fff' }}>{confirmedBookingModal.eventLocation}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'ضمان البطاقة:' : 'Card Guarantee:'} {confirmedBookingModal.cardDetails?.cardBrand} ({confirmedBookingModal.cardDetails?.cardNumberMasked})
                </span>
                <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.2rem' }}>
                  {formatCurrency(confirmedBookingModal.totalPrice)}
                </span>
              </div>
            </div>

            {/* ACTION NOTIFICATIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>

              {/* REQUIREMENT 1: User WhatsApp Confirmation Button */}
              <a
                href={getWhatsAppUrl(confirmedBookingModal.organizerPhone, formatUserPartyWhatsAppMessage(confirmedBookingModal, lang))}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#ffffff',
                  padding: '0.85rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Send size={18} />
                  <span>
                    {lang === 'ar'
                      ? `1. تأكيد الواتساب للعميل (${confirmedBookingModal.organizerPhone})`
                      : `1. Open User WhatsApp Confirmation (${confirmedBookingModal.organizerPhone})`}
                  </span>
                </div>
                <ExternalLink size={16} />
              </a>

              {/* REQUIREMENT 3: Admin WhatsApp Notification Button */}
              <a
                href={getWhatsAppUrl(adminWhatsAppPhone, formatAdminPartyWhatsAppMessage(confirmedBookingModal))}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(255, 159, 28, 0.2))',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--accent-gold-light)',
                  padding: '0.85rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={18} color="var(--accent-gold)" />
                  <span>
                    {lang === 'ar'
                      ? `3. إشعار الواتساب للإدارة (+${adminWhatsAppPhone})`
                      : `3. Send WhatsApp Notification to Admin (+${adminWhatsAppPhone})`}
                  </span>
                </div>
                <ExternalLink size={16} />
              </a>

              {/* REQUIREMENT 2: Admin Show All Booking Party List Button */}
              <button
                type="button"
                onClick={() => {
                  setConfirmedBookingModal(null);
                  setActiveTab('admin');
                  setAdminSubTab('parties');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  padding: '0.8rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  fontSize: '0.92rem'
                }}
              >
                <Eye size={16} color="var(--accent-gold)" />
                <span>{lang === 'ar' ? '2. الذهاب لقائمة حجوزات الحفلات في الإدارة' : '2. Admin: View All Party Bookings List'}</span>
              </button>

            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setConfirmedBookingModal(null)}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.65rem',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontSize: '0.88rem'
              }}
            >
              {lang === 'ar' ? 'إغلاق النافذة' : 'Close Window'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
