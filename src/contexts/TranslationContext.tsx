import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface TranslationContextType {
  language: Language;
  toggleLanguage: () => void;
  translate: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.createAccount': 'Create Account',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.welcome': 'Welcome to YourMannMitra',
    'auth.subtitle': 'Your Mental Wellness Companion',
    
    // Dashboard
    'dashboard.goodMorning': 'Good morning',
    'dashboard.namaste': 'नमस्ते! How can we support you today?',
    'dashboard.streak': 'Streak: 7 days 🔥',
    'dashboard.quickMood': 'Quick Mood Check',
    'dashboard.emergency': 'Need Immediate Support?',
    'dashboard.helpline': 'India\'s National Mental Health Helpline is available 24/7',
    'dashboard.kiranCall': 'Call KIRAN: 1800-599-0019',
    
    // Features
    'features.aiCompanion': 'AI Companion',
    'features.aiCompanionDesc': 'Chat with your wellness buddy',
    'features.moodTracker': 'Mood Check-in',
    'features.moodTrackerDesc': 'How are you feeling today?',
    'features.wellnessHub': 'Wellness Hub',
    'features.wellnessHubDesc': 'Guided meditations & videos',
    'features.bookCounselor': 'Book Counselor',
    'features.bookCounselorDesc': 'Professional support available',
    'features.peerSupport': 'Peer Support',
    'features.peerSupportDesc': 'Anonymous community chat',
    'features.dailyJournal': 'Daily Journal',
    'features.dailyJournalDesc': 'Reflect and express yourself',
    'features.myProgress': 'My Progress',
    'features.myProgressDesc': 'Track your wellness journey',
    'features.mindfulGames': 'Mindful Games',
    'features.mindfulGamesDesc': 'Relaxing interactive activities',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.logout': 'Logout',
    'common.translate': 'हिंदी',
  },
  hi: {
    // Auth
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूरा नाम',
    'auth.createAccount': 'खाता बनाएं',
    'auth.alreadyAccount': 'पहले से खाता है?',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.welcome': 'YourMannMitra में आपका स्वागत है',
    'auth.subtitle': 'आपका मानसिक कल्याण साथी',
    
    // Dashboard
    'dashboard.goodMorning': 'सुप्रभात',
    'dashboard.namaste': 'नमस्ते! आज हम आपकी कैसे सहायता कर सकते हैं?',
    'dashboard.streak': 'लगातार: 7 दिन 🔥',
    'dashboard.quickMood': 'त्वरित मूड जांच',
    'dashboard.emergency': 'तत्काल सहायता चाहिए?',
    'dashboard.helpline': 'भारत की राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन 24/7 उपलब्ध है',
    'dashboard.kiranCall': 'KIRAN कॉल करें: 1800-599-0019',
    
    // Features
    'features.aiCompanion': 'AI साथी',
    'features.aiCompanionDesc': 'अपने कल्याण मित्र से बात करें',
    'features.moodTracker': 'मूड चेक-इन',
    'features.moodTrackerDesc': 'आज आप कैसा महसूस कर रहे हैं?',
    'features.wellnessHub': 'कल्याण केंद्र',
    'features.wellnessHubDesc': 'निर्देशित ध्यान और वीडियो',
    'features.bookCounselor': 'परामर्शदाता बुक करें',
    'features.bookCounselorDesc': 'पेशेवर सहायता उपलब्ध',
    'features.peerSupport': 'साथी सहायता',
    'features.peerSupportDesc': 'गुमनाम समुदायिक चैट',
    'features.dailyJournal': 'दैनिक डायरी',
    'features.dailyJournalDesc': 'चिंतन करें और खुद को व्यक्त करें',
    'features.myProgress': 'मेरी प्रगति',
    'features.myProgressDesc': 'अपने कल्याण यात्रा को ट्रैक करें',
    'features.mindfulGames': 'मन की शांति के खेल',
    'features.mindfulGamesDesc': 'आराम देने वाली इंटरैक्टिव गतिविधियां',
    
    // Common
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.back': 'वापस',
    'common.logout': 'लॉगआउट',
    'common.translate': 'English',
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const translate = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <TranslationContext.Provider
      value={{
        language,
        toggleLanguage,
        translate,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}