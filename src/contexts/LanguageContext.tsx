import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const translations = {
  en: {
    welcome: "Welcome to Bharat KYC",
    selectLanguage: "Select Language",
    startKYC: "Start KYC Verification",
    chooseMethod: "Choose Verification Method",
    digilocker: "DigiLocker",
    documents: "Documents",
    faceAuth: "Face Verification",
    digilockerDesc: "Quick verification with Aadhaar",
    documentsDesc: "Upload your documents",
    faceAuthDesc: "Face verification for security",
    continue: "Continue",
    back: "Back",
    next: "Next",
    retry: "Retry",
    success: "Success!",
    kycCompleted: "KYC verification completed successfully",
    uploadDocument: "Upload Document",
    takePhoto: "Take Photo",
    verifyFace: "Verify Your Face",
    lookAtCamera: "Look at the camera and follow instructions",
    processing: "Processing...",
    aadhaarNumber: "Enter Aadhaar Number",
    enterOTP: "Enter OTP",
    reviewInfo: "Review Information",
    submit: "Submit",
    camera: "Camera",
    gallery: "Gallery"
  },
  hi: {
    welcome: "भारत केवाईसी में आपका स्वागत है",
    selectLanguage: "भाषा चुनें",
    startKYC: "केवाईसी सत्यापन शुरू करें",
    chooseMethod: "सत्यापन विधि चुनें",
    digilocker: "डिजीलॉकर",
    documents: "दस्तावेज़",
    faceAuth: "चेहरा सत्यापन",
    digilockerDesc: "आधार के साथ त्वरित सत्यापन",
    documentsDesc: "अपने दस्तावेज़ अपलोड करें",
    faceAuthDesc: "सुरक्षा के लिए चेहरा सत्यापन",
    continue: "जारी रखें",
    back: "वापस",
    next: "आगे",
    retry: "पुनः प्रयास",
    success: "सफल!",
    kycCompleted: "केवाईसी सत्यापन सफलतापूर्वक पूरा हुआ",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    takePhoto: "फोटो लें",
    verifyFace: "अपना चेहरा सत्यापित करें",
    lookAtCamera: "कैमरे की ओर देखें और निर्देशों का पालन करें",
    processing: "प्रसंस्करण...",
    aadhaarNumber: "आधार नंबर दर्ज करें",
    enterOTP: "ओटीपी दर्ज करें",
    reviewInfo: "जानकारी की समीक्षा करें",
    submit: "जमा करें",
    camera: "कैमरा",
    gallery: "गैलरी"
  },
  ta: {
    welcome: "பாரத் கேவைசி க்கு வரவேற்கிறோம்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    startKYC: "கேவைசி சரிபார்ப்பைத் தொடங்கவும்",
    chooseMethod: "சரிபார்ப்பு முறையைத் தேர்ந்தெடுக்கவும்",
    digilocker: "டிஜிலாக்கர்",
    documents: "ஆவணங்கள்",
    faceAuth: "முக சரிபார்ப்பு",
    digilockerDesc: "ஆதார் உடன் விரைவு சரிபார்ப்பு",
    documentsDesc: "உங்கள் ஆவணங்களை பதிவேற்றவும்",
    faceAuthDesc: "பாதுகாப்பிற்காக முக சரிபார்ப்பு",
    continue: "தொடரவும்",
    back: "பின்",
    next: "அடுத்து",
    retry: "மீண்டும் முயற்சிக்கவும்",
    success: "வெற்றி!",
    kycCompleted: "கேவைசி சரிபார்ப்பு வெற்றிகரமாக முடிந்தது",
    uploadDocument: "ஆவணத்தை பதிவேற்றவும்",
    takePhoto: "புகைப்படம் எடுக்கவும்",
    verifyFace: "உங்கள் முகத்தை சரிபார்க்கவும்",
    lookAtCamera: "கேமராவைப் பார்த்து வழிமுறைகளைப் பின்பற்றவும்",
    processing: "செயலாக்கம்...",
    aadhaarNumber: "ஆதார் எண்ணை உள்ளிடவும்",
    enterOTP: "ஓடிபியை உள்ளிடவும்",
    reviewInfo: "தகவலை மதிப்பாய்வு செய்யவும்",
    submit: "சமர்ப்பிக்கவும்",
    camera: "கேமரா",
    gallery: "கேலரி"
  },
  te: {
    welcome: "భారత్ కేవైసీకు స్వాగతం",
    selectLanguage: "భాషను ఎంచుకోండి",
    startKYC: "కేవైసీ ధృవీకరణను ప్రారంభించండి",
    chooseMethod: "ధృవీకరణ పద్ధతిని ఎంచుకోండి",
    digilocker: "డిజిలాకర్",
    documents: "పత్రాలు",
    faceAuth: "ముఖ ధృవీకరణ",
    digilockerDesc: "ఆధార్‌తో త్వరిత ధృవీకరణ",
    documentsDesc: "మీ పత్రాలను అప్‌లోడ్ చేయండి",
    faceAuthDesc: "భద్రత కోసం ముఖ ధృవీకరణ",
    continue: "కొనసాగించు",
    back: "వెనుకకు",
    next: "తదుపరి",
    retry: "మళ్లీ ప్రయత్నించండి",
    success: "విజయం!",
    kycCompleted: "కేవైసీ ధృవీకరణ విజయవంతంగా పూర్తయింది",
    uploadDocument: "పత్రాన్ని అప్‌లోడ్ చేయండి",
    takePhoto: "ఫోటో తీయండి",
    verifyFace: "మీ ముఖాన్ని ధృవీకరించండి",
    lookAtCamera: "కెమేరా వైపు చూడండి మరియు సూచనలను అనుసరించండి",
    processing: "ప్రాసెసింగ్...",
    aadhaarNumber: "ఆధార్ నంబర్‌ను నమోదు చేయండి",
    enterOTP: "ఓటిపిని నమోదు చేయండి",
    reviewInfo: "సమాచారాన్ని సమీక్షించండి",
    submit: "సమర్పించండి",
    camera: "కెమేరా",
    gallery: "గ్యాలరీ"
  },
  bn: {
    welcome: "ভারত কেওয়াইসিতে স্বাগতম",
    selectLanguage: "ভাষা নির্বাচন করুন",
    startKYC: "কেওয়াইসি যাচাইকরণ শুরু করুন",
    chooseMethod: "যাচাইকরণ পদ্ধতি বেছে নিন",
    digilocker: "ডিজিলকার",
    documents: "নথি",
    faceAuth: "মুখ যাচাইকরণ",
    digilockerDesc: "আধার দিয়ে দ্রুত যাচাইকরণ",
    documentsDesc: "আপনার নথি আপলোড করুন",
    faceAuthDesc: "নিরাপত্তার জন্য মুখ যাচাইকরণ",
    continue: "চালিয়ে যান",
    back: "পেছনে",
    next: "পরবর্তী",
    retry: "আবার চেষ্টা করুন",
    success: "সফল!",
    kycCompleted: "কেওয়াইসি যাচাইকরণ সফলভাবে সম্পন্ন হয়েছে",
    uploadDocument: "নথি আপলোড করুন",
    takePhoto: "ছবি তুলুন",
    verifyFace: "আপনার মুখ যাচাই করুন",
    lookAtCamera: "ক্যামেরার দিকে তাকান এবং নির্দেশাবলী অনুসরণ করুন",
    processing: "প্রক্রিয়াকরণ...",
    aadhaarNumber: "আধার নম্বর লিখুন",
    enterOTP: "ওটিপি লিখুন",
    reviewInfo: "তথ্য পর্যালোচনা করুন",
    submit: "জমা দিন",
    camera: "ক্যামেরা",
    gallery: "গ্যালারি"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};