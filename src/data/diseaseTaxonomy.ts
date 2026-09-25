import { SupportedCrop, ViTDiseaseClass, DiseaseDetectionResult } from '@/types/disease';

export interface DiseaseClassMeta {
  crop: SupportedCrop;
  cropEmoji: string;
  condition: string;
  isHealthy: boolean;
  isInvalid: boolean;
  names: {
    en: { crop: string; condition: string };
    hi: { crop: string; condition: string };
    mr: { crop: string; condition: string };
  };
  whatWeFound: {
    en: string;
    hi: string;
    mr: string;
  };
  whatYouCanDo: {
    en: string[];
    hi: string[];
    mr: string[];
  };
}

export const DISEASE_TAXONOMY: Record<ViTDiseaseClass, DiseaseClassMeta> = {
  Corn___Common_Rust: {
    crop: 'Corn',
    cropEmoji: '🌽',
    condition: 'Common Rust',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Corn (Maize)', condition: 'Common Rust' },
      hi: { crop: 'मक्का', condition: 'कॉमन रस्ट (गेरुआ)' },
      mr: { crop: 'मका', condition: 'तांबेरा रोग (रस्ट)' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Corn Common Rust (cinnamon-brown pustules on both upper and lower leaf surfaces).',
      hi: 'पत्तियों पर मक्का कॉमन रस्ट के लक्षण दिख रहे हैं (पत्तियों के दोनों तरफ भूरे-नारंगी धब्बे)।',
      mr: 'पानांवर मक्याच्या तांबेरा रोगाची लक्षणे दिसत आहेत (पानांच्या दोन्ही बाजूंना तांबूस रंगाचे पुरळ).',
    },
    whatYouCanDo: {
      en: [
        'Inspect surrounding plants to gauge how widely the infection has spread.',
        'Avoid overhead sprinkler irrigation in late afternoon to reduce leaf wetness duration.',
        'Remove and safely dispose of heavily infected lower crop debris.',
        'Consult your local Krishi Vigyan Kendra (KVK) or agriculture officer for approved fungicide guidance if infection is widespread.'
      ],
      hi: [
        'आसपास के पौधों की जांच करें कि संक्रमण कितना फैला है।',
        'शाम के समय ऊपर से पानी देने से बचें ताकि पत्तियां रात में गीली न रहें।',
        'संक्रमित पुरानी निचली पत्तियों को खेत से निकाल दें।',
        'संक्रमण अधिक होने पर नजदीकी कृषि विज्ञान केंद्र (KVK) से सलाह लें।'
      ],
      mr: [
        'आसपासच्या झाडांची तपासणी करून रोगाचा प्रसार किती आहे ते पहा.',
        'संध्याकाळच्या वेळी तुषार सिंचन टाळा, जेणेकरून पाने जास्त वेळ ओली राहणार नाहीत.',
        'जास्त बाधित झालेली खालची पाने काढून नष्ट करा.',
        'रोग जास्त असल्यास स्थानिक कृषी विज्ञान केंद्र (KVK) किंवा कृषी सहाय्यकांचा सल्ला घ्या.'
      ],
    },
  },

  Corn___Gray_Leaf_Spot: {
    crop: 'Corn',
    cropEmoji: '🌽',
    condition: 'Gray Leaf Spot',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Corn (Maize)', condition: 'Gray Leaf Spot' },
      hi: { crop: 'मक्का', condition: 'ग्रे लीफ स्पॉट' },
      mr: { crop: 'मका', condition: 'राखाडी पानांचे ठिपके' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Corn Gray Leaf Spot (rectangular, grey-to-tan necrotic lesions restricted between leaf veins).',
      hi: 'पत्ती पर मक्का ग्रे लीफ स्पॉट के लक्षण हैं (नसों के बीच आयताकार धूसर धब्बे)।',
      mr: 'पानावर मक्याच्या राखाडी ठिपके रोगाची लक्षणे दिसत आहेत (शिरांमधील आयताकृती राखाडी चट्टे).',
    },
    whatYouCanDo: {
      en: [
        'Improve air circulation within the canopy by avoiding excessive plant density.',
        'Ensure balanced soil nutrition; avoid excessive nitrogen that promotes lush, susceptible foliage.',
        'Practice crop rotation with non-host crops like pulses or legumes in the following season.',
        'Contact your local agriculture department for recommended bio-fungicides.'
      ],
      hi: [
        'पौधों के बीच हवा का संचार बनाए रखने के लिए अत्यधिक घनी बुवाई से बचें।',
        'संतुलित उर्वरक दें, अधिक नाइट्रोजन देने से बचें।',
        'अगले सीजन में दलहनी फसलों के साथ फसल चक्र अपनाएं।',
        'उपयुक्त नियंत्रण के लिए कृषि विभाग के विशेषज्ञों से संपर्क करें।'
      ],
      mr: [
        'झाडांमध्ये हवा खेळती राहण्यासाठी जास्त दाटी टाळा.',
        'खतांचा संतुलित वापर करा; जास्त नत्र खत देणे टाळा.',
        'पुढील हंगामात डाळवर्गीय पिकांसोबत फेरपालट करा.',
        'अधिक मार्गदर्शनासाठी स्थानिक कृषी अधिकाऱ्यांशी संपर्क साधा.'
      ],
    },
  },

  Corn___Healthy: {
    crop: 'Corn',
    cropEmoji: '🌽',
    condition: 'Healthy',
    isHealthy: true,
    isInvalid: false,
    names: {
      en: { crop: 'Corn (Maize)', condition: 'Healthy Leaf' },
      hi: { crop: 'मक्का', condition: 'स्वस्थ पत्ती' },
      mr: { crop: 'मका', condition: 'निरोगी पान' },
    },
    whatWeFound: {
      en: 'Your leaf appears healthy. There are no prominent signs of Common Rust or Gray Leaf Spot.',
      hi: 'आपकी फसल की पत्ती स्वस्थ दिख रही है। किसी मुख्य बीमारी के लक्षण नहीं हैं।',
      mr: 'आपल्या पिकाचे पान निरोगी दिसत आहे. रोगाची कोणतीही लक्षणे आढळली नाहीत.',
    },
    whatYouCanDo: {
      en: [
        'Maintain balanced irrigation and nutrient replenishment according to your soil health card.',
        'Monitor leaves weekly during cloudy or high-humidity weather.'
      ],
      hi: [
        'मृदा स्वास्थ्य कार्ड के अनुसार संतुलित सिंचाई और पोषक तत्व बनाए रखें।',
        'बादल छाए रहने या नमी के मौसम में नियमित निगरानी करते रहें।'
      ],
      mr: [
        'माती आरोग्य पत्रिकेनुसार संतुलित पाणी आणि खत व्यवस्थापन चालू ठेवा.',
        'ढगाळ आणि दमट हवामानात पिकाचे नियमित निरीक्षण करा.'
      ],
    },
  },

  Potato___Early_Blight: {
    crop: 'Potato',
    cropEmoji: '🥔',
    condition: 'Early Blight',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Potato', condition: 'Early Blight' },
      hi: { crop: 'आलू', condition: 'अगेती झुलसा (Early Blight)' },
      mr: { crop: 'बटाटा', condition: 'करपा रोग (अर्ली ब्लाइट)' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Potato Early Blight (dark brown to black circular lesions with characteristic concentric target-board rings).',
      hi: 'पत्तियों पर आलू के अगेती झुलसा के लक्षण हैं (गोल भूरे धब्बे जिनमें छल्ले जैसी बनावट होती है)।',
      mr: 'पानांवर बटाट्याच्या करपा रोगाची लक्षणे दिसत आहेत (चकत्यांसारखे गोल तपकिरी ठिपके).',
    },
    whatYouCanDo: {
      en: [
        'Remove severely affected lower leaves touching the soil surface.',
        'Avoid water stress; maintain uniform soil moisture without waterlogging.',
        'Ensure adequate potassium and nitrogen nutrition to keep plants vigorous.',
        'Consult your local KVK or horticulture extension specialist for approved protective spray schedules.'
      ],
      hi: [
        'जमीन से सटी अत्यधिक प्रभावित निचली पत्तियों को तोड़कर हटा दें।',
        'फसल में नमी की कमी न होने दें; संतुलित सिंचाई बनाए रखें।',
        'पौधों की रोग प्रतिरोधक क्षमता बढ़ाने के लिए पोटाश का उचित प्रयोग करें।',
        'उचित नियंत्रण के लिए स्थानीय कृषि विशेषज्ञ या केवीके से सलाह लें।'
      ],
      mr: [
        'जमिनीला टेकलेली जास्त बाधित खालची पाने खुडून नष्ट करा.',
        'पिकाला पाण्याचा ताण पडू देऊ नका; योग्य ओलावा टिकवा.',
        'पिकाची ताकद वाढवण्यासाठी शिफारशीनुसार पोटॅश खत द्या.',
        'फवारणीच्या योग्य सल्ल्यासाठी स्थानिक कृषी विज्ञान केंद्राशी संपर्क साधा.'
      ],
    },
  },

  Potato___Late_Blight: {
    crop: 'Potato',
    cropEmoji: '🥔',
    condition: 'Late Blight',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Potato', condition: 'Late Blight' },
      hi: { crop: 'आलू', condition: 'पछेती झुलसा (Late Blight)' },
      mr: { crop: 'बटाटा', condition: 'लेट ब्लाइट (पछेती करपा)' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Potato Late Blight (water-soaked pale green to dark brown lesions that expand rapidly under cool, humid conditions).',
      hi: 'पत्तियों पर आलू के पछेती झुलसा के लक्षण हैं (पानी से भीगे जैसे गहरे धब्बे जो ठंड और नमी में तेजी से फैलते हैं)।',
      mr: 'पानांवर बटाट्याच्या पछेती करपा रोगाची लक्षणे दिसत आहेत (थंड आणि दमट हवामानात वेगाने पसरणारे काळपट डाग).',
    },
    whatYouCanDo: {
      en: [
        'Act quickly: Late blight spreads rapidly in cool, overcast weather.',
        'Avoid overhead irrigation; keep field well-drained and eliminate stagnant water.',
        'Destroy heavily infected foliage immediately to prevent tuber infection.',
        'Urgently consult your nearest Krishi Vigyan Kendra (KVK) for recommended district-specific management protocols.'
      ],
      hi: [
        'तुरंत ध्यान दें: ठंडे और नम मौसम में यह रोग बहुत तेजी से फैलता है।',
        'खेत में पानी जमा न होने दें और जल निकासी की अच्छी व्यवस्था रखें।',
        'रोगग्रस्त पौधों को तुरंत खेत से हटाकर नष्ट करें।',
        'शीघ्र नियंत्रण के लिए तुरंत नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
      ],
      mr: [
        'तात्काळ उपाययोजना करा: थंड आणि दमट हवामानात हा रोग अत्यंत वेगाने पसरतो.',
        'शेतात पाणी साचू देऊ नका; पाण्याचा योग्य निचरा करा.',
        'जास्त बाधित झाडे काढून नष्ट करा जेणेकरून बटाट्यांपर्यंत रोग पोहोचणार नाही.',
        'तातडीच्या मार्गदर्शनासाठी जवळच्या कृषी विज्ञान केंद्राशी (KVK) संपर्क साधा.'
      ],
    },
  },

  Potato___Healthy: {
    crop: 'Potato',
    cropEmoji: '🥔',
    condition: 'Healthy',
    isHealthy: true,
    isInvalid: false,
    names: {
      en: { crop: 'Potato', condition: 'Healthy Leaf' },
      hi: { crop: 'आलू', condition: 'स्वस्थ पत्ती' },
      mr: { crop: 'बटाटा', condition: 'निरोगी पान' },
    },
    whatWeFound: {
      en: 'Your leaf appears healthy with no visible signs of Early Blight or Late Blight.',
      hi: 'आलू की पत्ती स्वस्थ है। झुलसा रोग के कोई लक्षण नहीं हैं।',
      mr: 'बटाट्याचे पान निरोगी दिसत आहे. करपा रोगाची कोणतीही लक्षणे नाहीत.',
    },
    whatYouCanDo: {
      en: [
        'Maintain proper earthen hilling around potato plants to protect growing tubers.',
        'Inspect crop foliage regularly after fog or winter rain.'
      ],
      hi: [
        'कंदों को ढकने के लिए पौधों पर मिट्टी चढ़ाने (हिलिंग) का काम ठीक से करें।',
        'कोहरे या बारिश के बाद फसल की नियमित जांच करते रहें।'
      ],
      mr: [
        'बटाट्याची योग्य भर लावा जेणेकरून बटाटे उघडे पडणार नाहीत.',
        'धुके किंवा हिवाळी पावसाच्या वेळी पिकाचे नियमित निरीक्षण करा.'
      ],
    },
  },

  Rice___Brown_Spot: {
    crop: 'Rice',
    cropEmoji: '🌾',
    condition: 'Brown Spot',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Rice (Paddy)', condition: 'Brown Spot' },
      hi: { crop: 'धान (चावल)', condition: 'भूरा धब्बा (Brown Spot)' },
      mr: { crop: 'भात (धान)', condition: 'तपकिरी ठिपके (ब्राऊन स्पॉट)' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Rice Brown Spot (small, oval-to-circular brown spots with grey or whitish centers).',
      hi: 'धान की पत्ती पर भूरा धब्बा रोग के लक्षण हैं (अंडाकार भूरे धब्बे जिनके बीच का हिस्सा हल्का होता है)।',
      mr: 'भाताच्या पानावर तपकिरी ठिपके रोगाची लक्षणे दिसत आहेत (मध्यभागी राखाडी असलेले लहान गोलाकार तपकिरी डाग).',
    },
    whatYouCanDo: {
      en: [
        'Ensure proper soil nutrient balance; brown spot often indicates nitrogen, potassium, or zinc deficiency.',
        'Maintain regular field flooding without allowing soil to dry out excessively.',
        'Use certified disease-free treated seed in future crop cycles.',
        'Consult your local agriculture extension officer or KVK for soil amendment and bio-control recommendations.'
      ],
      hi: [
        'खेत में पोषक तत्वों की कमी (विशेषकर पोटाश और जिंक) की जांच करें।',
        'खेत को पूरी तरह सूखने न दें, उचित नमी बनाए रखें।',
        'अगली फसल के लिए हमेशा प्रमाणित और उपचारित बीज का प्रयोग करें।',
        'सटीक मार्गदर्शन के लिए स्थानीय कृषि अधिकारी से संपर्क करें।'
      ],
      mr: [
        'मातीत पोषक तत्वांची कमतरता (विशेषतः पोटॅश आणि जस्त) भरून काढा.',
        'शेतात पाण्याची योग्य पातळी ठेवा, जमीन जास्त सुकू देऊ नका.',
        'पुढील लागवडीसाठी प्रमाणित आणि बीजप्रक्रिया केलेले बियाणे वापरा.',
        'अधिक मार्गदर्शनासाठी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.'
      ],
    },
  },

  Rice___Leaf_Blast: {
    crop: 'Rice',
    cropEmoji: '🌾',
    condition: 'Leaf Blast',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Rice (Paddy)', condition: 'Leaf Blast' },
      hi: { crop: 'धान (चावल)', condition: 'ब्लास्ट रोग (झोंका)' },
      mr: { crop: 'भात (धान)', condition: 'करपा / ब्लास्ट रोग' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Rice Leaf Blast (spindle-shaped, diamond or eye-like lesions with grey centers and brown borders).',
      hi: 'धान की पत्ती पर ब्लास्ट (झोंका) रोग के लक्षण हैं (नाव या आंख के आकार के धब्बे जिनके किनारे भूरे होते हैं)।',
      mr: 'भाताच्या पानावर ब्लास्ट (करपा) रोगाची लक्षणे दिसत आहेत (डोळ्याच्या आकाराचे, मध्यभागी राखाडी व कडेने तपकिरी चट्टे).',
    },
    whatYouCanDo: {
      en: [
        'Avoid excessive top-dressing of chemical nitrogen fertilizer, which worsens blast intensity.',
        'Maintain a continuous shallow water layer in the paddy field to reduce plant stress.',
        'Clear weeds and wild grasses from field bunds as they can harbor the blast fungus.',
        'Contact your nearest Krishi Vigyan Kendra (KVK) for recommended bio-agents or approved spray protocols.'
      ],
      hi: [
        'यूरिया (नाइट्रोजन) की अधिक मात्रा देने से बचें, इससे रोग बढ़ता है।',
        'खेत में पानी की हल्की परत बनाए रखें ताकि पौधे तनाव में न आएं।',
        'मेड़ों पर से खरपतवार साफ करें क्योंकि फफूंद उन पर पनप सकती है।',
        'रोकथाम के लिए तुरंत स्थानीय कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
      ],
      mr: [
        'जास्त प्रमाणात नत्र (युरिया) खत देणे टाळा, कारण यामुळे रोगाची तीव्रता वाढते.',
        'खाचरामध्ये पाण्याचा योग्य थर कायम ठेवा.',
        'बांधावरील तण काढून टाका कारण बुरशी तिथे वाढू शकते.',
        'योग्य उपायांसाठी तात्काळ जवळच्या कृषी विज्ञान केंद्राचा (KVK) सल्ला घ्या.'
      ],
    },
  },

  Rice___Healthy: {
    crop: 'Rice',
    cropEmoji: '🌾',
    condition: 'Healthy',
    isHealthy: true,
    isInvalid: false,
    names: {
      en: { crop: 'Rice (Paddy)', condition: 'Healthy Leaf' },
      hi: { crop: 'धान (चावल)', condition: 'स्वस्थ पत्ती' },
      mr: { crop: 'भात (धान)', condition: 'निरोगी पान' },
    },
    whatWeFound: {
      en: 'Your leaf appears healthy with no visible symptoms of Leaf Blast or Brown Spot.',
      hi: 'धान की पत्ती स्वस्थ है। ब्लास्ट या भूरे धब्बे का कोई लक्षण नहीं दिखा।',
      mr: 'भाताचे पान निरोगी दिसत आहे. ब्लास्ट किंवा तपकिरी ठिपक्यांची कोणतीही लक्षणे नाहीत.',
    },
    whatYouCanDo: {
      en: [
        'Continue recommended water management according to your rice growth stage.',
        'Scout your field weekly, especially along shaded edges and near bunds.'
      ],
      hi: [
        'फसल की अवस्था के अनुसार उचित जल प्रबंधन जारी रखें।',
        'मेड़ों के पास और छायादार हिस्सों में समय-समय पर निरीक्षण करते रहें।'
      ],
      mr: [
        'पिकाच्या वाढीच्या टप्प्यानुसार पाण्याचे योग्य व्यवस्थापन चालू ठेवा.',
        'बांधांच्या कडेला आणि पिकात आठवड्यातून एकदा फेरफटका मारून पाहणी करा.'
      ],
    },
  },

  Wheat___Brown_Rust: {
    crop: 'Wheat',
    cropEmoji: '🌾',
    condition: 'Brown Rust',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Wheat', condition: 'Brown Rust (Leaf Rust)' },
      hi: { crop: 'गेहूं', condition: 'भूरा रतुआ (भूरा गेरुआ)' },
      mr: { crop: 'गहू', condition: 'तपकिरी तांबेरा' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Wheat Brown Rust (small, round-to-oval orange-brown pustules scattered randomly across the leaf blade).',
      hi: 'पत्तियों पर गेहूं के भूरे रतुआ (गेरुआ) के लक्षण हैं (पत्ती पर बिखरे हुए छोटे गोल नारंगी-भूरे चूर्ण जैसे दाने)।',
      mr: 'पानांवर गव्हाच्या तपकिरी तांबेरा रोगाची लक्षणे दिसत आहेत (पानांवर अनियमितपणे विखुरलेले लहान तांबूस-तपकिरी पुरळ).',
    },
    whatYouCanDo: {
      en: [
        'Monitor field spread: Rust spores spread rapidly with prevailing winds.',
        'Avoid excessive late irrigation that creates dense humidity within the canopy.',
        'Keep field borders free from wild grasses that serve as green bridges for rust.',
        'Consult your local agricultural extension officer or KVK for government-advised rust management advisories.'
      ],
      hi: [
        'खेत की निगरानी बढ़ाएं: हवा के साथ इस रोग के बीजाणु तेजी से फैलते हैं।',
        'देर से भारी सिंचाई न करें जिससे फसल में अधिक नमी न बने।',
        'खेत के किनारे उगी खरपतवार को साफ रखें।',
        'सरकारी कृषि विभाग की ताजा एडवाइजरी के अनुसार सलाह लें।'
      ],
      mr: [
        'शेताचे नियमित निरीक्षण करा, कारण वाऱ्यामुळे हा रोग वेगाने पसरू शकतो.',
        'उशिरा जास्त पाणी देणे टाळा जेणेकरून शेतात दमटपणा वाढणार नाही.',
        'बांधावरील गवत काढून टाका.',
        'कृषी विभागाच्या मार्गदर्शनानुसार योग्य उपाययोजना करा.'
      ],
    },
  },

  Wheat___Yellow_Rust: {
    crop: 'Wheat',
    cropEmoji: '🌾',
    condition: 'Yellow Rust',
    isHealthy: false,
    isInvalid: false,
    names: {
      en: { crop: 'Wheat', condition: 'Yellow Rust (Stripe Rust)' },
      hi: { crop: 'गेहूं', condition: 'पीला रतुआ (हल्दी रोग)' },
      mr: { crop: 'गहू', condition: 'पिवळा तांबेरा' },
    },
    whatWeFound: {
      en: 'Your leaf shows signs commonly associated with Wheat Yellow Rust (distinct yellow or orange stripes/lines of pustules aligned along leaf veins).',
      hi: 'पत्तियों पर गेहूं के पीले रतुआ (हल्दी रोग) के लक्षण हैं (पत्तियों की नसों के समानांतर पीली धारियों में पाउडर जैसे दाने)।',
      mr: 'पानांवर गव्हाच्या पिवळ्या तांबेरा रोगाची लक्षणे दिसत आहेत (पानांच्या शिरांना समांतर पिवळ्या रंगाच्या पट्ट्या).',
    },
    whatYouCanDo: {
      en: [
        'Take prompt action: Yellow rust thrives in cool temperatures (10-15°C) and high humidity.',
        'Do not delay scouting if yellow dust rubs off onto hands or clothing.',
        'Avoid flood irrigation during cold, overcast spells.',
        'Immediately inform your local agriculture officer or KVK for region-specific recommended bio-control or management steps.'
      ],
      hi: [
        'तुरंत ध्यान दें: पीला रतुआ ठंडे मौसम (10-15°C) और नमी में बहुत तेजी से फैलता है।',
        'यदि पत्तियों को छूने पर हाथ में पीला पाउडर लगे तो तुरंत सतर्क हो जाएं।',
        'अत्यधिक ठंड और बादलों के मौसम में भारी सिंचाई से बचें।',
        'उचित नियंत्रण के लिए तुरंत स्थानीय कृषि विस्तार अधिकारी या केवीके से संपर्क करें।'
      ],
      mr: [
        'तातडीने लक्ष द्या: थंड हवामान (१०-१५ अंश से.) आणि दमट हवेत हा रोग वेगाने वाढतो.',
        'पानांना हात लावल्यास पिवळी भुकटी हाताला लागत असल्यास तात्काळ सावध व्हा.',
        'थंडीच्या व ढगाळ वातावरणात जास्त पाणी देणे टाळा.',
        'योग्य नियंत्रणासाठी लगेचच स्थानिक कृषी अधिकारी किंवा कृषी विज्ञान केंद्राशी संपर्क साधा.'
      ],
    },
  },

  Wheat___Healthy: {
    crop: 'Wheat',
    cropEmoji: '🌾',
    condition: 'Healthy',
    isHealthy: true,
    isInvalid: false,
    names: {
      en: { crop: 'Wheat', condition: 'Healthy Leaf' },
      hi: { crop: 'गेहूं', condition: 'स्वस्थ पत्ती' },
      mr: { crop: 'गहू', condition: 'निरोगी पान' },
    },
    whatWeFound: {
      en: 'Your leaf appears healthy with no visible signs of Brown Rust or Yellow Rust.',
      hi: 'गेहूं की पत्ती स्वस्थ है। पीले या भूरे रतुआ का कोई लक्षण नहीं मिला।',
      mr: 'गव्हाचे पान निरोगी दिसत आहे. तांबेरा रोगाची कोणतीही लक्षणे नाहीत.',
    },
    whatYouCanDo: {
      en: [
        'Maintain timely light irrigations at critical growth stages (CRI, tillering, heading).',
        'Continue regular monitoring during cool and foggy periods.'
      ],
      hi: [
        'गेहूं के महत्वपूर्ण चरणों (मुकुट जड़, कल्ले फूटते समय) पर समय पर हल्की सिंचाई करें।',
        'ठंड और कोहरे वाले दिनों में खेत का नियमित निरीक्षण जारी रखें।'
      ],
      mr: [
        'पिकाच्या संवेदनशील टप्प्यांवर वेळेवर हलके पाणी द्या.',
        'थंडी आणि धुक्याच्या दिवसांत नियमित पाहणी करत राहा.'
      ],
    },
  },

  Invalid: {
    crop: 'Unknown',
    cropEmoji: '🌱',
    condition: 'Invalid',
    isHealthy: false,
    isInvalid: true,
    names: {
      en: { crop: 'Unknown', condition: 'Unrecognized / Invalid' },
      hi: { crop: 'अज्ञात', condition: 'अमान्य / अस्पष्ट' },
      mr: { crop: 'अज्ञात', condition: 'अस्पष्ट प्रतिमा' },
    },
    whatWeFound: {
      en: "We couldn't analyze this image. Please take a clear photo of a crop leaf.",
      hi: 'हम इस छवि का विश्लेषण नहीं कर सके। कृपया फसल की पत्ती की स्पष्ट फोटो लें।',
      mr: 'आम्ही या प्रतिमेचे विश्लेषण करू शकलो नाही. कृपया पिकाच्या पानाचा स्पष्ट फोटो काढा.',
    },
    whatYouCanDo: {
      en: [
        'Take a close-up photo in good daylight.',
        'Make sure the crop leaf is in focus and fills most of the frame.',
        'Avoid heavy shadows, extreme blur, or photographing non-plant objects.'
      ],
      hi: [
        'अच्छी रोशनी में पत्ती की पास से स्पष्ट फोटो लें।',
        'ध्यान रखें कि पत्ती कैमरे के फोकस में हो।',
        'ज्यादा छाया, धुंधली फोटो या पौधे के अलावा अन्य चीजों की फोटो से बचें।'
      ],
      mr: [
        'चांगल्या प्रकाशात पानाचा जवळून स्पष्ट फोटो काढा.',
        'पान कॅमेऱ्याच्या फोकसमध्ये असावे याची काळजी घ्या.',
        'जास्त सावली, अंधुक किंवा पिकाव्यतिरिक्त इतर वस्तूंचे फोटो काढणे टाळा.'
      ],
    },
  },
};

export const DEFAULT_DISCLAIMER =
  'General guidance only. Consult a local Krishi Vigyan Kendra (KVK) or agricultural extension officer for specific treatment plans.';
