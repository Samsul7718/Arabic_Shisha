import React, { createContext, useContext, useState, useEffect } from 'react';
import { SHISHA_ITEMS, RENTAL_POT_MODELS, PARTY_PACKAGES } from '../data/shishaData';

const AppContext = createContext();

const getDeletedIds = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
};

/**
 * Intelligent Merger:
 * Merges items defined statically in shishaData.js (SHISHA_ITEMS) with
 * custom products added dynamically from Cloudinary/Admin and saved modifications.
 * Both types of products will be preserved and displayed on the web page.
 */
export const mergeShishaItems = (codeItems = [], savedItems = [], deletedIds = new Set()) => {
  const savedItemMap = new Map();

  if (Array.isArray(savedItems)) {
    savedItems.forEach((item) => {
      if (!item || !item.id || deletedIds.has(item.id)) return;
      savedItemMap.set(item.id, item);
    });
  }

  // Items defined in shishaData.js are the master source of truth.
  // If an item is deleted from shishaData.js, it is permanently removed upon reload.
  const mergedItems = (codeItems || [])
    .filter((codeItem) => !deletedIds.has(codeItem.id))
    .map((codeItem) => {
      const savedOverride = savedItemMap.get(codeItem.id);
      if (!savedOverride) {
        return codeItem;
      }

      // Merge: keep code item base, but preserve admin modifications (images, stock, etc.)
      return {
        ...codeItem,
        image: savedOverride.customImage || (savedOverride.image && savedOverride.image !== codeItem.image)
          ? savedOverride.image
          : codeItem.image,
        secondaryImage: savedOverride.customImage || (savedOverride.secondaryImage && savedOverride.secondaryImage !== codeItem.secondaryImage)
          ? savedOverride.secondaryImage
          : codeItem.secondaryImage,
        stockStatus: savedOverride.stockStatus !== undefined ? savedOverride.stockStatus : codeItem.stockStatus,
        stockQty: savedOverride.stockQty !== undefined ? savedOverride.stockQty : codeItem.stockQty,
        customImage: savedOverride.customImage || false,
        ...(savedOverride.adminEdited ? {
          nameEn: savedOverride.nameEn || codeItem.nameEn,
          nameAr: savedOverride.nameAr || codeItem.nameAr,
          price: savedOverride.price !== undefined ? savedOverride.price : codeItem.price,
          descriptionEn: savedOverride.descriptionEn || codeItem.descriptionEn,
          descriptionAr: savedOverride.descriptionAr || codeItem.descriptionAr,
          brand: savedOverride.brand || codeItem.brand,
          category: savedOverride.category || codeItem.category,
          badge: savedOverride.badge !== undefined ? savedOverride.badge : codeItem.badge,
          adminEdited: true
        } : {})
      };
    });

  // Ensure unique IDs
  const seenIds = new Set();
  const result = [];
  for (const item of mergedItems) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      result.push(item);
    }
  }
  return result;
};

export const mergeRentalPots = (codePots = [], savedPots = [], deletedIds = new Set()) => {
  const savedPotMap = new Map();

  if (Array.isArray(savedPots)) {
    savedPots.forEach((pot) => {
      if (!pot || !pot.id || deletedIds.has(pot.id)) return;
      savedPotMap.set(pot.id, pot);
    });
  }

  const mergedCodePots = (codePots || [])
    .filter((codePot) => !deletedIds.has(codePot.id))
    .map((codePot) => {
      const savedOverride = savedPotMap.get(codePot.id);
      if (!savedOverride) return codePot;

      return {
        ...codePot,
        image: savedOverride.customImage || (savedOverride.image && savedOverride.image !== codePot.image)
          ? savedOverride.image
          : codePot.image,
        secondaryImage: savedOverride.customImage || (savedOverride.secondaryImage && savedOverride.secondaryImage !== codePot.secondaryImage)
          ? savedOverride.secondaryImage
          : codePot.secondaryImage,
        inStock: savedOverride.inStock !== undefined ? savedOverride.inStock : codePot.inStock,
        customImage: savedOverride.customImage || false,
        ...(savedOverride.adminEdited ? {
          nameEn: savedOverride.nameEn || codePot.nameEn,
          nameAr: savedOverride.nameAr || codePot.nameAr,
          brand: savedOverride.brand || codePot.brand,
          dailyRate: savedOverride.dailyRate !== undefined ? savedOverride.dailyRate : codePot.dailyRate,
          deposit: savedOverride.deposit !== undefined ? savedOverride.deposit : codePot.deposit,
          descriptionEn: savedOverride.descriptionEn || codePot.descriptionEn,
          descriptionAr: savedOverride.descriptionAr || codePot.descriptionAr,
          adminEdited: true
        } : {})
      };
    });

  const seenIds = new Set();
  const result = [];
  for (const pot of mergedCodePots) {
    if (!seenIds.has(pot.id)) {
      seenIds.add(pot.id);
      result.push(pot);
    }
  }
  return result;
};

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // 'en' | 'ar'
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'rental' | 'party' | 'blender' | 'orders' | 'admin'
  
  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('all');

  // Dynamic Product & Image Inventory State (Dual-Source: shishaData.js + Cloudinary/Admin)
  const [shishaItems, setShishaItems] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem('arabic_shisha_items');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse arabic_shisha_items from localStorage:', e);
    }
    const deletedIds = getDeletedIds('arabic_shisha_deleted_items');
    return mergeShishaItems(SHISHA_ITEMS, saved, deletedIds);
  });

  const [rentalPots, setRentalPots] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem('arabic_shisha_rentals');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse arabic_shisha_rentals from localStorage:', e);
    }
    const deletedIds = getDeletedIds('arabic_shisha_deleted_rentals');
    return mergeRentalPots(RENTAL_POT_MODELS, saved, deletedIds);
  });

  // Dynamic Party Packages & Pricing State (persisted in localStorage)
  const [partyPackages, setPartyPackages] = useState(() => {
    const saved = localStorage.getItem('arabic_shisha_party_packages');
    return saved ? JSON.parse(saved) : PARTY_PACKAGES;
  });

  // Cloudinary Settings State
  const [cloudinaryConfig, setCloudinaryConfig] = useState(() => {
    const saved = localStorage.getItem('cloudinary_config');
    return saved ? JSON.parse(saved) : { cloudName: 'lujbdfel', uploadPreset: 'zioigfj8' };
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  
  // Demo Initial Party Bookings
  const INITIAL_PARTY_BOOKINGS = [
    {
      id: 'party_sample_1',
      bookingCode: 'PARTY-4821',
      packageId: 'party_gold',
      packageNameEn: 'Gold Sultan Party Catering (6 Pots)',
      packageNameAr: 'حفلة السلطان الذهبية (6 شيشة)',
      potsCount: 6,
      eventDate: '2026-10-18',
      eventTime: '08:00 PM',
      eventLocation: 'Palm View Villa 42, Beachfront Resort',
      guestCount: '15 - 30 Guests',
      organizerName: 'Zayd Al-Hashmi',
      organizerPhone: '+919960154761',
      needCoalMasterAttendant: true,
      cardDetails: {
        cardholderName: 'Zayd Al-Hashmi',
        cardNumberMasked: '•••• •••• •••• 4242',
        cardBrand: 'Visa',
        expiry: '09/28'
      },
      totalPrice: 590,
      currency: '₹',
      status: 'Confirmed',
      createdAt: '2026-10-13 19:40'
    },
    {
      id: 'party_sample_2',
      bookingCode: 'PARTY-7392',
      packageId: 'party_vip',
      packageNameEn: 'VIP Diamond Mega Celebration (12 Pots)',
      packageNameAr: 'احتفال الألماس الملكي (12 شيشة)',
      potsCount: 12,
      eventDate: '2026-10-22',
      eventTime: '07:30 PM',
      eventLocation: 'Grand Ballroom, Royal Horizon Hall',
      guestCount: '30 - 80 Guests',
      organizerName: 'Rohan Mehra',
      organizerPhone: '+919820123456',
      needCoalMasterAttendant: true,
      cardDetails: {
        cardholderName: 'Rohan Mehra',
        cardNumberMasked: '•••• •••• •••• 8821',
        cardBrand: 'Mastercard',
        expiry: '11/27'
      },
      totalPrice: 1150,
      currency: '₹',
      status: 'In Preparation',
      createdAt: '2026-10-12 14:15'
    }
  ];

  // Cart & Orders State
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('arabic_shisha_reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [partyBookings, setPartyBookings] = useState(() => {
    const saved = localStorage.getItem('arabic_shisha_party_bookings');
    return saved ? JSON.parse(saved) : INITIAL_PARTY_BOOKINGS;
  });

  // Admin WhatsApp Contact Config & Subtab Navigation
  const [adminWhatsAppPhone, setAdminWhatsAppPhone] = useState(() => {
    const saved = localStorage.getItem('arabic_shisha_admin_phone');
    return saved || '919960154761';
  });
  const [adminSubTab, setAdminSubTab] = useState('catalog'); // 'catalog' | 'rentals' | 'parties' | 'settings' | 'add'
  
  // Toast Notification System
  const [toast, setToast] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('arabic_shisha_items', JSON.stringify(shishaItems));
  }, [shishaItems]);

  useEffect(() => {
    localStorage.setItem('arabic_shisha_rentals', JSON.stringify(rentalPots));
  }, [rentalPots]);

  useEffect(() => {
    localStorage.setItem('cloudinary_config', JSON.stringify(cloudinaryConfig));
  }, [cloudinaryConfig]);

  useEffect(() => {
    localStorage.setItem('arabic_shisha_party_packages', JSON.stringify(partyPackages));
  }, [partyPackages]);

  useEffect(() => {
    localStorage.setItem('arabic_shisha_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('arabic_shisha_party_bookings', JSON.stringify(partyBookings));
  }, [partyBookings]);

  useEffect(() => {
    localStorage.setItem('arabic_shisha_admin_phone', adminWhatsAppPhone);
  }, [adminWhatsAppPhone]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  // Synchronize when SHISHA_ITEMS from shishaData.js is modified or added
  useEffect(() => {
    const deletedIds = getDeletedIds('arabic_shisha_deleted_items');
    setShishaItems((current) => mergeShishaItems(SHISHA_ITEMS, current, deletedIds));
  }, [SHISHA_ITEMS]);

  // Synchronize when RENTAL_POT_MODELS from shishaData.js is modified or added
  useEffect(() => {
    const deletedIds = getDeletedIds('arabic_shisha_deleted_rentals');
    setRentalPots((current) => mergeRentalPots(RENTAL_POT_MODELS, current, deletedIds));
  }, [RENTAL_POT_MODELS]);

  const deleteProduct = (itemId, isRental = false) => {
    if (isRental) {
      setRentalPots((prev) => prev.filter((p) => p.id !== itemId));
      try {
        const deletedSet = getDeletedIds('arabic_shisha_deleted_rentals');
        deletedSet.add(itemId);
        localStorage.setItem('arabic_shisha_deleted_rentals', JSON.stringify([...deletedSet]));
      } catch (e) {
        console.error('Failed to save deleted rental id:', e);
      }
    } else {
      setShishaItems((prev) => prev.filter((item) => item.id !== itemId));
      try {
        const deletedSet = getDeletedIds('arabic_shisha_deleted_items');
        deletedSet.add(itemId);
        localStorage.setItem('arabic_shisha_deleted_items', JSON.stringify([...deletedSet]));
      } catch (e) {
        console.error('Failed to save deleted product id:', e);
      }
    }
    showToast(lang === 'ar' ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully', 'info');
  };

  const resetInventory = () => {
    localStorage.removeItem('arabic_shisha_items');
    localStorage.removeItem('arabic_shisha_rentals');
    localStorage.removeItem('arabic_shisha_party_packages');
    localStorage.removeItem('arabic_shisha_deleted_items');
    localStorage.removeItem('arabic_shisha_deleted_rentals');
    setShishaItems(SHISHA_ITEMS);
    setRentalPots(RENTAL_POT_MODELS);
    setPartyPackages(PARTY_PACKAGES);
    showToast(lang === 'ar' ? 'تمت إعادة ضبط المنتجات والحزم بنجاح' : 'Inventory & party tiers reset to default', 'info');
  };

  const addToCart = (item, options = {}) => {
    const cartItemId = options.customId || `${item.id}-${options.bowlId || 'std'}-${options.baseId || 'std'}`;
    
    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) => (i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          ...item,
          cartItemId,
          qty: 1,
          selectedOptions: options
        }
      ];
    });

    const msg = lang === 'ar' 
      ? `تمت إضافة "${lang === 'ar' ? item.nameAr : item.nameEn}" إلى الطلب`
      : `Added "${item.nameEn}" to your order`;
    showToast(msg);
    setIsCartOpen(true);
  };

  const updateCartQty = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const addReservation = (bookingDetails) => {
    setReservations((prev) => [bookingDetails, ...prev]);
    showToast(
      lang === 'ar' 
        ? `تم حجز الطاولة بنجاح! رقم الحجز: ${bookingDetails.bookingCode}` 
        : `Table reserved! Booking Ref: ${bookingDetails.bookingCode}`
    );
  };

  const addPartyBooking = (newBooking) => {
    setPartyBookings((prev) => [newBooking, ...prev]);
    // Also save in general reservations for consistency
    setReservations((prev) => [newBooking, ...prev]);
  };

  const updatePartyBookingStatus = (bookingCode, status) => {
    setPartyBookings((prev) =>
      prev.map((b) => (b.bookingCode === bookingCode ? { ...b, status } : b))
    );
    showToast(
      lang === 'ar' ? `تم تحديث حالة الحجز إلى: ${status}` : `Booking status updated to: ${status}`,
      'success'
    );
  };

  const updatePartyBookingAmount = (bookingCode, newAmount) => {
    const parsedAmount = parseFloat(newAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) return false;
    setPartyBookings((prev) =>
      prev.map((b) => (b.bookingCode === bookingCode ? { ...b, totalPrice: parsedAmount } : b))
    );
    showToast(
      lang === 'ar' ? `تم تعديل مبلغ حجز الحفلة إلى ${parsedAmount}` : `Party booking card amount updated to ₹${parsedAmount}`,
      'success'
    );
    return true;
  };

  const updatePartyPackagePrice = (packageId, newPrice) => {
    const parsedPrice = parseFloat(newPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return false;
    setPartyPackages((prev) =>
      prev.map((pkg) => (pkg.id === packageId ? { ...pkg, basePrice: parsedPrice } : pkg))
    );
    showToast(
      lang === 'ar' ? `تم تحديث سعر بطاقة الحزمة إلى ${parsedPrice}` : `Party package card amount updated to ₹${parsedPrice}`,
      'success'
    );
    return true;
  };

  const deletePartyBooking = (bookingCode) => {
    setPartyBookings((prev) => prev.filter((b) => b.bookingCode !== bookingCode));
    showToast(
      lang === 'ar' ? 'تم حذف الحجز بنجاح' : 'Party booking removed',
      'info'
    );
  };

  const createOrder = (paymentMethod) => {
    const newOrder = {
      orderId: `ASL-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      totalAmount: cart.reduce((acc, item) => acc + item.price * item.qty, 0) + 15,
      paymentMethod,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      statusStep: 1
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveTab('orders');

    showToast(
      lang === 'ar' ? `تم استلام الطلب! رقم الطلب ${newOrder.orderId}` : `Order placed! Order ID: ${newOrder.orderId}`
    );
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotalCartPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        activeTab,
        setActiveTab,
        adminSubTab,
        setAdminSubTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        inStockOnly,
        setInStockOnly,
        selectedProfile,
        setSelectedProfile,
        shishaItems,
        setShishaItems,
        rentalPots,
        setRentalPots,
        partyPackages,
        setPartyPackages,
        updatePartyPackagePrice,
        updatePartyBookingAmount,
        cloudinaryConfig,
        setCloudinaryConfig,
        resetInventory,
        deleteProduct,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedItemDetail,
        setSelectedItemDetail,
        reservations,
        addReservation,
        partyBookings,
        setPartyBookings,
        addPartyBooking,
        updatePartyBookingStatus,
        deletePartyBooking,
        adminWhatsAppPhone,
        setAdminWhatsAppPhone,
        orders,
        createOrder,
        totalCartCount,
        subtotalCartPrice,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
