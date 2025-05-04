import { Metadata } from "next";
import AnimeDetailsClient from "./AnimeDetailsClient";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Anime Details - ${params.id}`,
  };
}

export default function AnimeDetailsPage({ params }: Props) {
  return <AnimeDetailsClient params={params} />;
}
