import Image from "next/image";

interface AnimeCardProps {
  title: string;
  imageUrl: string;
  releaseDate: string;
  score: number;
}

export default function AnimeCard({
  title,
  imageUrl,
  releaseDate,
  score,
}: AnimeCardProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "Unkown!";
  const formattedScore = score ? score.toFixed(1) : "N/A";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-100">
      <div className="relative h-[400px]">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={title || "Anime poster"}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.jpg";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">
          {title || "Unkown !"}
        </h3>
        <div className="flex justify-between items-center text-sm text-gray-300">
          <span>{year}</span>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-yellow-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{formattedScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
