
import { NewsPoste } from "@/types/news-poste";
import NewCard from "@/components/dashboard/overview/NewCard";

export default async function NewsCards({ postes }: { postes: NewsPoste[] }) {
  if (postes.length === 0) return null;

  return (
    <>
      {postes.map((poste: NewsPoste) => (
        <NewCard key={poste.id} poste={poste} />
      ))}
    </>
  );
}
