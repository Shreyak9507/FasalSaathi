# 🌱 FasalSaathi

### AI-Powered Smart Agriculture Assistant for Farmers

FasalSaathi is a farmer-friendly smart agriculture platform designed to simplify agricultural decision-making by bringing soil health, farm location, weather, crop recommendations, nutrient management, fertilizer information, market prices, and crop disease detection into one simple mobile-first platform.

The goal is to help farmers make better-informed decisions without having to navigate multiple complicated platforms or sources of information.

---

## 🎯 Problem

Farmers often need to gather information from multiple sources before making decisions about what to grow, how to manage soil nutrients, and where or when to sell their produce.

Important information such as:

- Soil nutrient levels
- Soil freshness
- Weather conditions
- Suitable crops
- Required nutrients and fertilizers
- Fertilizer prices
- Nearby APMC market prices
- Crop disease information

can be difficult to access and interpret in one place.

FasalSaathi aims to simplify this process through an easy-to-use, mobile-first interface.

---

## 💡 Solution

FasalSaathi combines agricultural information and AI-assisted analysis into a single platform.

A farmer can:

1. Upload their Soil Health Card or soil testing report.
2. Automatically extract important soil and farm information.
3. Check whether the soil report is recent enough to use confidently.
4. Detect or manually enter their farm location.
5. View local weather conditions.
6. Receive crop suitability recommendations.
7. Understand which nutrients need to be replenished.
8. Receive fertilizer recommendations.
9. Compare fertilizer/product prices.
10. View recent agricultural market prices from APMC sources.
11. Take or upload a crop leaf photograph for AI-based disease detection.

---

## 🚜 Core Features

### 1. Soil Health Analysis

Farmers can upload their Soil Health Card or soil testing report.

FasalSaathi extracts relevant information such as:

- Soil nutrients
- Soil properties
- Farm information
- Location information
- Irrigation information
- Rainfall information
- Soil testing date

The extracted information is converted into a simple farmer-friendly profile.

---

### 2. Soil Freshness

The date of the soil test is used to determine how recent the available soil information is.

If the report is old, FasalSaathi warns the farmer that actual soil conditions may have changed and recommends obtaining a new soil test.

---

### 3. Farm Location

FasalSaathi supports multiple ways of identifying the farm location:

- Location extracted from the Soil Health Card
- Current GPS location
- Manual location selection

The selected location is used for localized agricultural information.

---

### 4. Weather Information

FasalSaathi provides weather information based on the selected farm location.

This information helps provide context for crop suitability and agricultural decisions.

---

### 5. AI Crop Recommendations

The platform analyzes available soil and environmental information to recommend suitable crops.

The primary recommendation is highlighted prominently, followed by other suitable alternatives.

Recommendations consider factors such as:

- Soil conditions
- Nutrient availability
- Farm conditions
- Location
- Weather
- Crop requirements

---

### 6. Nutrient & Fertilizer Recommendations

After identifying suitable crops, FasalSaathi analyzes the nutrients required by those crops.

It identifies nutrients that may need replenishment and provides fertilizer recommendations to help address those requirements.

The platform also provides relevant product and price information where available.

---

### 7. Agricultural Market Prices

FasalSaathi provides recent market-price information so farmers can understand the approximate selling prices of their crops in nearby agricultural markets.

This is intended to help farmers make more informed crop-selection and selling decisions.

---

### 8. AI Crop Disease Detection

Farmers can take a photograph of a crop leaf using their phone or upload an existing image.

The image is analyzed using an AI-based crop disease classification system.

The current prototype supports selected diseases across:

- Rice
- Wheat
- Corn
- Potato

The system provides:

- Crop identification
- Possible disease
- Confidence level
- Farmer-friendly explanation
- Recommended next steps

If the image cannot be confidently analyzed, the system asks the farmer to provide a clearer image instead of presenting an uncertain result as a definite diagnosis.

---

## 📱 Designed for Farmers

FasalSaathi is designed primarily for smartphones rather than desktop computers.

The interface focuses on:

- Simple navigation
- Large, clear actions
- Minimal technical terminology
- Mobile-friendly layouts
- Regional-language support
- Camera-based interaction
- Easy-to-understand agricultural information

The platform is designed with future expansion toward voice-based interaction and broader regional-language support in mind.

---

## 🤖 AI & Technology

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### AI

- Google Gemini for AI-assisted analysis and fallback image understanding
- Pretrained Vision Transformer for crop disease classification

### APIs & Data

- Weather data APIs
- Agricultural market/APMC price information
- Soil testing information
- Agricultural product and fertilizer price information

---

## 🔄 Overall Workflow

```text
                 Soil Health Card
                        │
                        ▼
               Soil Data Extraction
                        │
                        ▼
                Farmer/Farm Profile
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
       Farm Location             Soil Freshness
            │                       │
            └───────────┬───────────┘
                        ▼
                 Local Weather
                        │
                        ▼
               Crop Recommendations
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
     Nutrient Analysis       Market Information
            │                       │
            ▼                       ▼
      Fertilizer Advice          APMC Prices
                        
                       

              Crop Disease Detection
                        │
                        ▼
                  Crop Photograph
                        │
                        ▼
                   AI Analysis
                        │
                        ▼
               Disease + Confidence
                        │
                        ▼
              Farmer-Friendly Advice