"use client";

import { fetchMorePostes } from "@/app/action";
import { NewsPoste } from "@/types/news-poste";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import NewsCards from "./NewsCards";
import CardSkeleton from "./CardSkeleton";
import NewCard from "./NewCard";

export default function LoadingMore({
  lastDocId,
}: {
  lastDocId: string | null;
}) {
  const { ref, inView } = useInView();

  const [lastDocID, setlastDocID] = useState<string | null>(lastDocId);
  const [postes, setPostes] = useState<NewsPoste[]>([]);

  useEffect(() => {
    const fetchMore = async (lastDoc: string) => {
      const { otherPostes, id } = await fetchMorePostes({ lastDocId: lastDoc });

      if (id) {
        setlastDocID(id);
      } else {
        setlastDocID(null);
        return;
      }

      setPostes([...postes, ...otherPostes]);
      console.log(postes, otherPostes);
    };

    if (inView && lastDocID) {
      fetchMore(lastDocID);
    }
  }, [inView, lastDocID, postes]);

  return (
    <>
      <div
        ref={ref}
        className={cn({
          "w-full h-10": lastDocID,
          "w-full h-2 bg-transparent": !lastDocID,
        })}
      ></div>
      {postes.length === 0 && lastDocID ? (
        <CardSkeleton count={3} />
      ) : (
        <>
        {postes.map((poste: NewsPoste) => (
          <NewCard key={poste.id} poste={poste} />
        ))}
      </>
      )}
    </>
  );
}
