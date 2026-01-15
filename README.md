# Streamly

A Movies & Series streaming website built with Next.js , IMDB api , OMDB API and VIDSRC API, 

<img width="1366" height="768" alt="1" src="https://github.com/user-attachments/assets/b4c32ee2-33c2-445d-8575-8a719734f14a" />
<img width="1366" height="768" alt="2" src="https://github.com/user-attachments/assets/9f95e241-5932-499c-ae4b-eeb168c0e2c6" />
<img width="1366" height="768" alt="3" src="https://github.com/user-attachments/assets/074f7f51-4e00-4ba2-8a0f-96d7183974d8" />



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
