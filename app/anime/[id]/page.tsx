"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import LoadingAnimation from "@/app/components/LoadingAnimation";

interface AnimeDetails {
  id: number;
  title: string;
  synopsis: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  episodes: number;
  status: string;
  aired: {
    from: string;
    to: string;
  };
  duration: string;
  rating: string;
  genres: Array<{
    name: string;
  }>;
  studios: Array<{
    name: string;
  }>;
  images: {
    jpg: {
      large_image_url: string;
    };
    webp: {
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
  };
}

export default function AnimeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add delay based on retry count to handle rate limiting
        if (retryCount > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, retryCount * 1000)
          );
        }

        const response = await fetch(
          `https://api.jikan.moe/v4/anime/${params.id}/full`,
          {
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Anime not found");
          } else if (response.status === 429) {
            throw new Error(
              "Too many requests. Please try again in a few seconds."
            );
          }
          throw new Error(`Failed to fetch anime details: ${response.status}`);
        }

        const data = await response.json();
        setAnime(data.data);
      } catch (err) {
        console.error("Error fetching anime details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load anime details"
        );

        // Auto retry for rate limiting
        if (retryCount < 3) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            fetchAnimeDetails();
          }, 1000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();

    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setShowScrollTop(window.scrollY > 500);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [params.id]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-800/50 max-w-md w-full text-center"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!anime) {
    return null;
  }

  const imageUrl =
    anime.images.jpg?.large_image_url || anime.images.webp?.large_image_url;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 text-white"
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-[9999]"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950 z-10" />
        <img
          src={imageUrl}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-30">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {anime.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2 bg-blue-900/50 px-4 py-2 rounded-full">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-300 font-medium">
                {anime.score.toFixed(1)}
              </span>
            </div>
            <div className="bg-gray-800/50 px-4 py-2 rounded-full">
              <span className="text-gray-300">{anime.episodes} Episodes</span>
            </div>
            <div className="bg-gray-800/50 px-4 py-2 rounded-full">
              <span className="text-gray-300">{anime.status}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-800/50"
            >
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {anime.synopsis || "No synopsis available."}
              </p>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-800/50">
                <h3 className="text-sm text-gray-400 mb-1">Rank</h3>
                <p className="text-xl font-bold">#{anime.rank || "N/A"}</p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-800/50">
                <h3 className="text-sm text-gray-400 mb-1">Popularity</h3>
                <p className="text-xl font-bold">
                  #{anime.popularity || "N/A"}
                </p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-800/50">
                <h3 className="text-sm text-gray-400 mb-1">Members</h3>
                <p className="text-xl font-bold">
                  {anime.members?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-800/50">
                <h3 className="text-sm text-gray-400 mb-1">Favorites</h3>
                <p className="text-xl font-bold">
                  {anime.favorites?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-800/50">
                <h3 className="text-sm text-gray-400 mb-1">Duration</h3>
                <p className="text-xl font-bold">{anime.duration || "N/A"}</p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-800/50">
                <h3 className="text-sm text-gray-400 mb-1">Rating</h3>
                <p className="text-xl font-bold">{anime.rating || "N/A"}</p>
              </div>
            </motion.div>

            {/* Genres */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold mb-4">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre.name}
                    className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Studios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold mb-4">Studios</h2>
              <div className="flex flex-wrap gap-2">
                {anime.studios.map((studio) => (
                  <span
                    key={studio.name}
                    className="bg-purple-900/50 text-purple-300 px-4 py-2 rounded-full"
                  >
                    {studio.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Trailer */}
            {anime.trailer?.youtube_id && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                    title="Anime Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8"
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-800/50">
                <img
                  src={imageUrl}
                  alt={anime.title}
                  className="w-full h-auto"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Aired</h3>
                      <p className="text-gray-300">
                        {new Date(anime.aired.from).toLocaleDateString()} to{" "}
                        {anime.aired.to
                          ? new Date(anime.aired.to).toLocaleDateString()
                          : "?"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Status</h3>
                      <p className="text-gray-300">{anime.status}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Episodes</h3>
                      <p className="text-gray-300">{anime.episodes}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Duration</h3>
                      <p className="text-gray-300">{anime.duration}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400 mb-1">Rating</h3>
                      <p className="text-gray-300">{anime.rating}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-300 z-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Back to Previous Page Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => window.history.back()}
        className="fixed bottom-8 left-8 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors duration-300 z-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </motion.button>
    </div>
  );
}
