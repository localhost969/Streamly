import { useState } from "react";
import SeriesPlayer from "./SeriesPlayer";

interface VideoPlayerProps {
  imdbId: string;
  contentType?: string; // 'movie' or 'series'
}

export default function VideoPlayer({ imdbId, contentType = "movie" }: VideoPlayerProps) {
  const isSeries = contentType === "series" || contentType === "tvSeries";

  if (isSeries) {
    return <SeriesPlayer imdbId={imdbId} />;
  }

  const movieSrc = `${process.env.NEXT_PUBLIC_VIDSRC_DOMAIN}/embed/movie?imdb=${imdbId}`;

  return (
    <section className="bg-gradient-to-b from-gray-950 to-black text-white font-sans">
      <div className="pt-16 pb-8 sm:pt-20 sm:pb-10 lg:pt-0">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-6">
          <div className="flex-1">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black/60 max-w-4xl mx-auto">
              <iframe
                key={imdbId}
                src={movieSrc}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title="Movie Player"
              />

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,rgba(0,0,0,0.5))]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/30 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}

