import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currency: string;
  currencySymbol: string;
  convertPrice: (usdPrice: number) => number;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'StayEase',
    'nav.home': 'Home',
    'nav.hotels': 'Hotels',
    'nav.bookings': 'My Bookings',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    'nav.profile': 'Profile',
    'hero.title': 'Find Your Perfect Stay',
    'hero.subtitle': 'Search and book hotels at the best prices',
    'search.location': 'Location',
    'search.checkin': 'Check-in',
    'search.checkout': 'Check-out',
    'search.guests': 'Guests',
    'search.search': 'Search',
    'search.priceRange': 'Price Range',
    'hotel.perNight': '/night',
    'hotel.book': 'Book Now',
    'hotel.details': 'View Details',
    'hotel.rating': 'Rating',
    'hotel.amenities': 'Amenities',
    'booking.title': 'Book Your Stay',
    'booking.dates': 'Select Dates',
    'booking.guests': 'Number of Guests',
    'booking.total': 'Total',
    'booking.confirm': 'Confirm Booking',
    'booking.success': 'Booking Confirmed!',
    'booking.history': 'Booking History',
    'payment.title': 'Payment',
    'payment.full': 'Full Payment',
    'payment.advance': 'Advance Payment (30%)',
    'payment.pay': 'Pay Now',
    'payment.success': 'Payment Successful!',
    'payment.method': 'Payment Method',
    'payment.card': 'Credit/Debit Card',
    'invoice.title': 'Invoice',
    'invoice.download': 'Download Invoice',
    'invoice.print': 'Print Invoice',
    'invoice.date': 'Invoice Date',
    'invoice.bookingId': 'Booking ID',
    'invoice.amount': 'Amount Paid',
    'admin.title': 'Admin Dashboard',
    'admin.users': 'Users',
    'admin.bookings': 'Bookings',
    'admin.payments': 'Payments',
    'admin.login': 'Admin Login',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.nights': 'nights',
  },
  ne: {
    'app.name': 'StayEase',
    'nav.home': 'गृहपृष्ठ',
    'nav.hotels': 'होटलहरू',
    'nav.bookings': 'मेरा बुकिङहरू',
    'nav.login': 'लगइन',
    'nav.register': 'दर्ता',
    'nav.logout': 'लगआउट',
    'nav.admin': 'एड्मिन',
    'nav.profile': 'प्रोफाइल',
    'hero.title': 'तपाईंको उत्तम बसाइ खोज्नुहोस्',
    'hero.subtitle': 'उत्तम मूल्यमा होटलहरू खोज्नुहोस् र बुक गर्नुहोस्',
    'search.location': 'स्थान',
    'search.checkin': 'चेक-इन',
    'search.checkout': 'चेक-आउट',
    'search.guests': 'पाहुनाहरू',
    'search.search': 'खोज्नुहोस्',
    'search.priceRange': 'मूल्य दायरा',
    'hotel.perNight': '/रात',
    'hotel.book': 'अहिले बुक गर्नुहोस्',
    'hotel.details': 'विवरण हेर्नुहोस्',
    'hotel.rating': 'रेटिङ',
    'hotel.amenities': 'सुविधाहरू',
    'booking.title': 'तपाईंको बसाइ बुक गर्नुहोस्',
    'booking.dates': 'मिति छान्नुहोस्',
    'booking.guests': 'पाहुनाहरूको संख्या',
    'booking.total': 'जम्मा',
    'booking.confirm': 'बुकिङ पुष्टि गर्नुहोस्',
    'booking.success': 'बुकिङ पुष्टि भयो!',
    'booking.history': 'बुकिङ इतिहास',
    'payment.title': 'भुक्तानी',
    'payment.full': 'पूर्ण भुक्तानी',
    'payment.advance': 'अग्रिम भुक्तानी (३०%)',
    'payment.pay': 'अहिले भुक्तानी गर्नुहोस्',
    'payment.success': 'भुक्तानी सफल भयो!',
    'payment.method': 'भुक्तानी विधि',
    'payment.card': 'क्रेडिट/डेबिट कार्ड',
    'invoice.title': 'बिल',
    'invoice.download': 'बिल डाउनलोड गर्नुहोस्',
    'invoice.print': 'बिल प्रिन्ट गर्नुहोस्',
    'invoice.date': 'बिल मिति',
    'invoice.bookingId': 'बुकिङ आईडी',
    'invoice.amount': 'भुक्तानी रकम',
    'admin.title': 'एड्मिन ड्यासबोर्ड',
    'admin.users': 'प्रयोगकर्ताहरू',
    'admin.bookings': 'बुकिङहरू',
    'admin.payments': 'भुक्तानीहरू',
    'admin.login': 'एड्मिन लगइन',
    'auth.login': 'लगइन',
    'auth.register': 'दर्ता गर्नुहोस्',
    'auth.email': 'इमेल',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूरा नाम',
    'auth.phone': 'फोन नम्बर',
    'auth.noAccount': 'खाता छैन?',
    'auth.hasAccount': 'पहिले नै खाता छ?',
    'common.loading': 'लोड हुँदैछ...',
    'common.error': 'त्रुटि भयो',
    'common.save': 'सुरक्षित गर्नुहोस्',
    'common.cancel': 'रद्द गर्नुहोस्',
    'common.back': 'पछाडि',
    'common.nights': 'रातहरू',
  },
};

const NPR_RATE = 133.5; // approximate USD to NPR

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const currency = language === 'en' ? 'USD' : 'NPR';
  const currencySymbol = language === 'en' ? '$' : 'Rs';

  const convertPrice = (usdPrice: number): number => {
    if (language === 'ne') {
      return Math.round(usdPrice * NPR_RATE);
    }
    return usdPrice;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currency, currencySymbol, convertPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
