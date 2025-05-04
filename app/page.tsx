"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import LoadingAnimation from "@/app/components/LoadingAnimation";

interface Anime {
  id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
    webp: {
      large_image_url: string;
    };
  };
  score: number;
  episodes: number;
  aired: {
    from: string;
  };
  genres: Array<{
    name: string;
  }>;
}

const AnimeCard = ({ anime }: { anime: Anime }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const imageUrl =
    anime.images.jpg?.large_image_url || anime.images.webp?.large_image_url;

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-800/50 cursor-pointer"
    >
      <div className="relative h-[450px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="w-12 h-12 border-4 border-blue-500/20 rounded-full">
              <div className="w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
        )}
        <motion.img
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          src={imageUrl}
          alt={anime.title}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center p-4">
              <svg
                className="w-12 h-12 text-gray-600 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-400">Image not available</p>
            </div>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"
        >
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 mb-3"
            >
              <span className="bg-blue-900/50 px-3 py-1 rounded-full text-blue-300 text-sm font-medium">
                {new Date(anime.aired.from).getFullYear()}
              </span>
              <div className="flex items-center bg-yellow-900/50 px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-300 text-sm font-medium">
                  {anime.score.toFixed(1)}
                </span>
              </div>
            </motion.div>
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-2xl font-bold text-white mb-2 line-clamp-2"
            >
              {anime.title}
            </motion.h3>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Link
                href={`/anime/${anime.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
              >
                View Details
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<
    Array<{ name: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const lastScrollY = useRef(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: (dir: "down" | "up") => ({
      opacity: 0,
      y: dir === "down" ? 40 : -40,
      scale: 0.95,
    }),
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const popularGenres = ["Action", "Adventure", "Comedy", "Drama"];

  useEffect(() => {
    fetchGenres();
    fetchAnime();

    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setScrollDir("down");
      } else {
        setScrollDir("up");
      }
      lastScrollY.current = window.scrollY;
      setShowScrollTop(window.scrollY > 500);
      setShowSearchBar(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch("https://api.jikan.moe/v4/genres/anime");
      const data = await response.json();
      setAvailableGenres(data.data);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchAnime = async (
    search = "",
    genres: string[] = [],
    pageNum = 1,
    append = false
  ) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setIsSearching(true);

      let url = "https://api.jikan.moe/v4/top/anime";
      if (search || genres.length > 0) {
        url = "https://api.jikan.moe/v4/anime";
        const params = new URLSearchParams();
        if (search) params.append("q", search);
        if (genres.length > 0) params.append("genres", genres.join(","));
        params.append("page", pageNum.toString());
        params.append("limit", "24");
        url += `?${params.toString()}`;
      } else {
        url += `?page=${pageNum}&limit=24`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (append) {
        setAnimeList((prev) => [...prev, ...data.data]);
      } else {
        setAnimeList(data.data);
      }

      setHasMore(data.pagination.has_next_page);
      setError(null);
    } catch (err) {
      console.error("Error fetching anime:", err);
      setError("Failed to load anime. Please try again later.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  

  const loadMore = () => {
    if (!hasMore || isLoadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnime(searchQuery, selectedGenres, nextPage, true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-extrabold   bg-gradient-to-r tracking-wider  from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              dir="ltr"
            >
              {"ANIMEVERSE".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={letterVariants}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 flex flex-wrap gap-2 justify-center"
            >
              {popularGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => {}}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  {genre}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-red-500 mb-8"
            >
              <p>{error}</p>
              <button
                onClick={() =>
                  fetchAnime(searchQuery, selectedGenres, 1, false)
                }
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {loading ? (
            <LoadingAnimation />
          ) : (
            <>
              <motion.div
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {animeList.map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    custom={scrollDir}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    whileHover={{ scale: 1.045 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <AnimeCard anime={anime} />
                  </motion.div>
                ))}
              </motion.div>

              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 text-center"
                >
                  <motion.button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    whileHover={{
                      scale: 1.07,
                      background:
                        "linear-gradient(90deg, #4f46e5 0%, #9333ea 100%)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(90deg, #2563eb 0%, #9333ea 100%)",
                    }}
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                        Loading...
                      </div>
                    ) : (
                      "Load More"
                    )}
                  </motion.button>
                </motion.div>
              )}
            </>
          )}

          {/* Scroll to Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                <motion.div
                  className="relative z-10"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300"
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
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Back to Previous Page Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ delay: 0.2 }}
            onClick={() => window.history.back()}
            className="fixed bottom-8 left-8 p-4 rounded-full shadow-lg z-50 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <svg
              className="w-6 h-6 text-white relative z-10 transform group-hover:-translate-x-1 transition-transform duration-300"
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
      </div>
    </>
  );
}
