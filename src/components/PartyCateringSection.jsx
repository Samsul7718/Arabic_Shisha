import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PARTY_PACKAGES } from '../data/shishaData';
import { Sparkles, Calendar, Users, MapPin, CheckCircle, Flame, Phone } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const PartyCateringSection = () => {
  const { lang, addReservation, showToast } = useApp();

  const [selectedPackage, setSelectedPackage] = useState(PARTY_PACKAGES[1]); // Gold Sultan Party
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventLocation, setEventLocation] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');
  const [needCoalMasterAttendant, setNeedCoalMasterAttendant] = useState(true);

  const calculateTotalPartyPrice = () => {
    let price = selectedPackage.basePrice;
    if (needCoalMasterAttendant && !selectedPackage.attendantOption) {
      price += 150; // Add 150 AED for coal master attendant on smaller packs
    }
    return price;
  };

  const handleBookParty = (e) => {
    e.preventDefault();

    if (!organizerName.trim() || !organizerPhone.trim() || !eventLocation.trim()) {
      alert(lang === 'ar' ? 'الرجاء تعبئة تفاصيل الحجز، الاسم، ورقم الهاتف' : 'Please provide event location, organizer name, and phone number.');
      return;
    }

    const partyBookingCode = `PARTY-${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingDetails = {
      bookingCode: partyBookingCode,
      zone: { nameEn: selectedPackage.nameEn, nameAr: selectedPackage.nameAr },
      guests: selectedPackage.recommendedFor,
      date: eventDate,
      time: 'Event Time (As Scheduled)',
      customerName: organizerName,
      customerPhone: organizerPhone,
      specialNotes: `Location: ${eventLocation} | Pots: ${selectedPackage.potsCount} Hookahs | Attendant: ${needCoalMasterAttendant ? 'Yes' : 'No'}`
    };

    addReservation(bookingDetails);

    showToast(
      lang === 'ar'
        ? `تم حجز حزمة حفلة الشيشة بنجاح! كود الحجز: ${partyBookingCode}`
        : `Hookah Party Catering booked! Booking Ref: ${partyBookingCode}`
    );

    // Reset Form
    setOrganizerName('');
    setOrganizerPhone('');
    setEventLocation('');
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--accent-gold)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Sparkles size={16} />
          <span>{lang === 'ar' ? 'تنظيم الحفلات والمناسبات الخاصة' : 'Private Event & Party Catering'}</span>
        </div>

        <h2 className="gold-gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          {lang === 'ar' ? 'نظم حفلة شيشة فاخرة لمناسبتك' : 'Organize a Royal Hookah Party at Your Venue'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
          {lang === 'ar'
            ? 'نقدم خدمة تجهيز كاملة لحفلات المنازل، الأعراس، وأعياد الميلاد. تشمل الشيشات الفاخرة، المعسل، وطاقم متمرس لإدارة الفحم.'
            : 'Complete hookah catering for weddings, house parties, and corporate events. Includes premium pots, flavor bars, and dedicated coal masters.'}
        </p>
      </div>

      <form onSubmit={handleBookParty} className="glass-panel" style={{ padding: '1.8rem' }}>
        
        {/* Step 1: Package Selector */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={18} color="#d4af37" />
            {lang === 'ar' ? '1. اختر حزمة الحفلة المناسبة' : '1. Choose Hookah Party Catering Tier'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {PARTY_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  style={{
                    background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 13, 18, 0.6)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: isSelected ? 'var(--accent-gold)' : '#fff', marginBottom: '0.4rem' }}>
                      {lang === 'ar' ? pkg.nameAr : pkg.nameEn}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                      {lang === 'ar' ? pkg.descriptionAr : pkg.descriptionEn}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)' }}>
                      Recommended for: <strong>{pkg.recommendedFor}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.2rem' }}>
                      {formatCurrency(pkg.basePrice)}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                      {pkg.potsCount} Hookah Pots
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Event Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {lang === 'ar' ? 'تاريخ الحفلة:' : 'Event Date:'}
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {lang === 'ar' ? 'موقع ومكان الحفلة:' : 'Event Location Address:'}
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'ar' ? 'أدخل موقع الفيلا/القاعة/الاستراحة' : 'Villa, Hall, or Resort Address'}
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', background: 'rgba(11, 13, 18, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: 'var(--radius-md)', outline: 'none' }}
            />
          </div>
        </div>

        {/* Step 3: Contact & Attendant Toggle */}
        <div style={{ marginBottom: '1.8rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '1rem' }}>
            {lang === 'ar' ? '2. تفاصيل المنظم وخادم الفحم' : '2. Organizer Contact & On-Site Staff'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            <input
              type="text"
              required
              placeholder={lang === 'ar' ? 'اسم المنظم بالكامل *' : 'Organizer Name *'}
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 1rem', background: 'rgba(11, 13, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', outline: 'none' }}
            />
            <input
              type="tel"
              required
              placeholder={lang === 'ar' ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
              value={organizerPhone}
              onChange={(e) => setOrganizerPhone(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 1rem', background: 'rgba(11, 13, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', outline: 'none' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(11, 13, 18, 0.6)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                {lang === 'ar' ? 'إضافة خادم فحم متخصص للحفلة (On-Site Coal Master)' : 'Add Dedicated On-Site Hookah Attendant'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'يقوم بتبديل الفحم وتجهيز النكهات طوال فترة الحفلة' : 'Handles coal refills & fresh head setup throughout the event.'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={needCoalMasterAttendant}
              onChange={(e) => setNeedCoalMasterAttendant(e.target.checked)}
              style={{ accentColor: '#d4af37', width: '18px', height: '18px' }}
            />
          </label>
        </div>

        {/* Pricing Summary & Booking */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.2rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>
              {lang === 'ar' ? 'إجمالي تكلفة تنظيم الحفلة:' : 'Total Party Catering Quote:'}
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {formatCurrency(calculateTotalPartyPrice())}
            </span>
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #ff9f1c)',
              border: 'none',
              color: '#0b0d12',
              padding: '0.8rem 1.8rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-gold-glow)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle size={20} />
            <span>{lang === 'ar' ? 'تأكيد حجز حفلة الشيشة' : 'Book Hookah Party'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
