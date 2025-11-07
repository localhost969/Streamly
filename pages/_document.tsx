import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <div className="pb-12">
          <Main />
        </div>
        {/* Fixed Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800/40 z-50">
          <div className="flex justify-center items-center py-2">
            <div className="text-center">
              <span className="text-gray-400 text-xs font-medium tracking-wide">
                Designed{" "}
                by{" "}
                <a 
                  href="https://t.me/DonaldDuck969" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white font-semibold hover:text-purple-400 transition-all duration-300 hover:drop-shadow-sm"
                >
                  localhost
                </a>
              </span>
            </div>
          </div>
        </footer>
        <NextScript />
      </body>
    </Html>
  );
}
