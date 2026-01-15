# Streamly

A Movies & Series streaming website built with Next.js , IMDB api , OMDB API and VIDSRC API, 

## Home Page
<img width="1366" height="768" alt="1" src="https://github.com/user-attachments/assets/b4c32ee2-33c2-445d-8575-8a719734f14a" />

## Movies Page
<img width="1360" height="626" alt="m1" src="https://github.com/user-attachments/assets/ee2809c1-13c4-4276-908c-71b49482363f" />

<img width="1359" height="625" alt="m2" src="https://github.com/user-attachments/assets/f0fbc9bd-dc08-4e3e-8047-530cc5113fdd" />

## Series Page
<img width="1360" height="627" alt="s1" src="https://github.com/user-attachments/assets/656a6f55-6536-43f5-94e8-07a27b080e6b" />
<img width="1359" height="626" alt="s2" src="https://github.com/user-attachments/assets/38f1d4ba-97c1-441a-823a-43d8e5c826ad" />
<img width="1358" height="627" alt="s3" src="https://github.com/user-attachments/assets/d3a0e106-abdd-4b5c-89de-2021c5cf8f37" />



## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/localhost969/Streamly.git
   cd Streamly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Open`.env` file in the root directory and add your OMDB API key:
   ```
   NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
STREAMLY_MAIN/
├── components/
│   ├── HeroSection.tsx
│   ├── MobileHeroSection.tsx
│   ├── MovieInfo.tsx
│   ├── RecentList.tsx
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── SeriesPlayer.tsx
│   ├── TopBar.tsx
│   └── VideoPlayer.tsx
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   └── watch/
│       └── [id].tsx
├── public/
├── styles/
│   └── globals.css
├── utils/
│   └── logger.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
``` 
