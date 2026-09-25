export interface Language {
  code: string;
  name: string; // English name
  native: string; // Native script name
  implemented: boolean;
}

export const languages: Language[] = [
  // 10 Implemented Indian Languages
  { code: 'en', name: 'English', native: 'English', implemented: true },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', implemented: true },
  { code: 'mr', name: 'Marathi', native: 'मराठी', implemented: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', implemented: true },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', implemented: true },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', implemented: true },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', implemented: true },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', implemented: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', implemented: true },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', implemented: true },

  // Other scheduled languages (upcoming)
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', implemented: false },
  { code: 'brx', name: 'Bodo', native: 'बड़ो', implemented: false },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', implemented: false },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', implemented: false },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', implemented: false },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', implemented: false },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোन्', implemented: false },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', implemented: false },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', implemented: false },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', implemented: false },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', implemented: false },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', implemented: false },
  { code: 'ur', name: 'Urdu', native: 'اردو', implemented: false }
];
