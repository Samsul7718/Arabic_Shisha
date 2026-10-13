/**
 * WhatsApp Integration Utilities for Arabic Shisha
 */

// Clean and normalize phone numbers for WhatsApp wa.me links
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all characters except digits and leading +
  let cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  // If user provided a 10 digit Indian number without country code, add 91
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
};

// Format WhatsApp confirmation message for the User
export const formatUserPartyWhatsAppMessage = (booking, lang = 'en') => {
  const isArabic = lang === 'ar';
  const cardLast4 = booking.cardDetails?.cardNumberMasked
    ? booking.cardDetails.cardNumberMasked.replace(/\s+/g, '').slice(-4)
    : '4242';

  if (isArabic) {
    return (
`👑 *متجر ومجلس الشيشة العربي — تأكيد حجز حفلة الشيشة* 👑
━━━━━━━━━━━━━━━━━━━━━
مرحباً بك عزيزنا *${booking.organizerName}*،
تم تأكيد حجز حزمة حفلة الشيشة الخاصة بك بنجاح! 🎉

📋 *رقم الحجز:* ${booking.bookingCode}
✨ *الحزمة:* ${booking.packageNameAr || booking.packageNameEn} (${booking.potsCount} شيشة)
📅 *التاريخ:* ${booking.eventDate}
⏰ *الوقت:* ${booking.eventTime}
📍 *الموقع / العنوان:* ${booking.eventLocation}
👥 *عدد الضيوف التقديري:* ${booking.guestCount || 'بحسب الحزمة'}
🔥 *خادم الفحم الميداني:* ${booking.needCoalMasterAttendant ? 'نعم (متوفر)' : 'لا'}
💳 *ضمان البطاقة:* ${booking.cardDetails?.cardBrand || 'بطاقة'} منتهية بـ •••• ${cardLast4}
💰 *إجمالي التكلفة:* ${booking.currency || '₹'} ${booking.totalPrice}
━━━━━━━━━━━━━━━━━━━━━
🚚 سيصل طاقم الشيشة المتخصص قبل الموعد بـ 45-60 دقيقة لتجهيز المكان وإشعال الفحم الملكي.
📞 للاستفسارات السريعة أو النكهات الإضافية، تواصل معنا: +91 9960154761

شكراً لاختيارك الشيشة العربية الفاخرة! 💨`
    );
  }

  return (
`👑 *ARABIC SHISHA — HOOKAH PARTY CONFIRMATION* 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${booking.organizerName}*,
Your Hookah Party Catering reservation is *CONFIRMED*! 🎉

📋 *Booking Ref:* ${booking.bookingCode}
✨ *Package:* ${booking.packageNameEn} (${booking.potsCount} Hookah Pots)
📅 *Event Date:* ${booking.eventDate}
⏰ *Event Time:* ${booking.eventTime}
📍 *Location / Address:* ${booking.eventLocation}
👥 *Guests:* ${booking.guestCount || 'As per package'}
🔥 *Coal Master Attendant:* ${booking.needCoalMasterAttendant ? 'Included / Requested (Yes)' : 'No'}
💳 *Payment Card:* ${booking.cardDetails?.cardBrand || 'Card'} ending in •••• ${cardLast4}
💰 *Total Amount:* ${booking.currency || '₹'} ${booking.totalPrice}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚚 Our master shisha team will arrive 45-60 minutes prior to your event time for complete setup, coals, and flavor bar.
📞 For any queries or custom flavor changes, reply directly or call +91 9960154761.

Thank you for choosing Arabic Shisha! 💨`
  );
};

// Format WhatsApp notification message for the Admin
export const formatAdminPartyWhatsAppMessage = (booking) => {
  const cardLast4 = booking.cardDetails?.cardNumberMasked
    ? booking.cardDetails.cardNumberMasked.replace(/\s+/g, '').slice(-4)
    : '4242';

  return (
`🚨 *NEW HOOKAH PARTY BOOKING ALERT!* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A new hookah party catering reservation has been confirmed:

📋 *Booking Ref:* ${booking.bookingCode}
✨ *Package:* ${booking.packageNameEn} (${booking.potsCount} Pots)
📅 *Event Date:* ${booking.eventDate}
⏰ *Event Time:* ${booking.eventTime}
📍 *Venue Address:* ${booking.eventLocation}
👤 *Organizer:* ${booking.organizerName}
📞 *Organizer WhatsApp:* ${booking.organizerPhone}
🔥 *Coal Master Attendant:* ${booking.needCoalMasterAttendant ? 'YES (Required)' : 'NO'}
💳 *Card Guarantee:* Verified (${booking.cardDetails?.cardBrand || 'Card'} •••• ${cardLast4})
💰 *Total Quote:* ${booking.currency || '₹'} ${booking.totalPrice}
⏱️ *Booked At:* ${booking.createdAt || new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Action Required: Confirm equipment availability & assign Coal Master team.`
  );
};

// Format WhatsApp cancellation message for the User
export const formatUserPartyCancellationWhatsAppMessage = (booking, lang = 'en') => {
  const isArabic = lang === 'ar';
  const cardLast4 = booking.cardDetails?.cardNumberMasked
    ? booking.cardDetails.cardNumberMasked.replace(/\s+/g, '').slice(-4)
    : '4242';

  if (isArabic) {
    return (
`⚠️ *متجر ومجلس الشيشة العربي — إشعار إلغاء حجز الحفلة* ⚠️
━━━━━━━━━━━━━━━━━━━━━
عزيزنا *${booking.organizerName}*،
نود إبلاغك بأنه تم *إلغاء حجز حفلة الشيشة* رقم *${booking.bookingCode}*.

📋 *رقم الحجز:* ${booking.bookingCode}
✨ *الحزمة:* ${booking.packageNameAr || booking.packageNameEn} (${booking.potsCount} شيشة)
📅 *التاريخ المحدد:* ${booking.eventDate}
⏰ *الوقت المحدد:* ${booking.eventTime}
📍 *الموقع:* ${booking.eventLocation}
💳 *حالة ضمان البطاقة:* تم إلغاء الحجز وفك حجز البطاقة المنتهية بـ •••• ${cardLast4} دون أي رسوم.
━━━━━━━━━━━━━━━━━━━━━
إذا كان هذا الإلغاء عن طريق الخطأ أو ترغب في إعادة جدولة الموعد، يسعدنا تواصلك معنا مباشرة:
📞 خدمة العملاء / واتساب: +91 9960154761

شكراً لتفهمك! — فريق الشيشة العربية`
    );
  }

  return (
`⚠️ *ARABIC SHISHA — PARTY BOOKING CANCELLATION* ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${booking.organizerName}*,
Your Hookah Party Catering reservation *${booking.bookingCode}* scheduled for *${booking.eventDate}* at *${booking.eventTime}* has been *CANCELLED*.

📋 *Booking Ref:* ${booking.bookingCode}
✨ *Package:* ${booking.packageNameEn} (${booking.potsCount} Hookah Pots)
📅 *Scheduled Date:* ${booking.eventDate}
⏰ *Scheduled Time:* ${booking.eventTime}
📍 *Location:* ${booking.eventLocation}
💳 *Card Guarantee Status:* Released (No penalty charged to card ending in •••• ${cardLast4}).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you would like to reschedule or have any questions, feel free to reply directly or call:
📞 Contact / WhatsApp: +91 9960154761

Thank you for your understanding. — Arabic Shisha Team`
  );
};

// Format WhatsApp cancellation notification for the Admin
export const formatAdminPartyCancellationWhatsAppMessage = (booking) => {
  return (
`🚨 *HOOKAH PARTY CANCELLATION DISPATCH ALERT* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The following party booking has been *CANCELLED & DELETED* by Admin:

📋 *Booking Ref:* ${booking.bookingCode}
✨ *Package:* ${booking.packageNameEn} (${booking.potsCount} Pots)
📅 *Event Date:* ${booking.eventDate}
⏰ *Event Time:* ${booking.eventTime}
📍 *Venue Address:* ${booking.eventLocation}
👤 *Organizer:* ${booking.organizerName}
📞 *Organizer Phone:* ${booking.organizerPhone}
💰 *Quote Amount:* ${booking.currency || '₹'} ${booking.totalPrice}
💳 *Card Guarantee:* Released
⏱️ *Cancelled At:* ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Action: Hookah pots allocation and Coal Master schedule released back to inventory.`
  );
};

// Build WhatsApp Web / App URL
export const getWhatsAppUrl = (phone, message) => {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
};

// Open WhatsApp safely in new tab
export const openWhatsApp = (phone, message) => {
  const url = getWhatsAppUrl(phone, message);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return url;
};
