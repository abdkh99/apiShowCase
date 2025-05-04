const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

export interface Anime {
  id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  aired: {
    from: string;
  };
  score: number;
}

export async function getPopularAnime(): Promise<Anime[]> {
  try {
    console.log("Fetching popular anime...");
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?limit=20`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("Invalid API response format:", data);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching popular anime:", error);
    return [];
  }
}
