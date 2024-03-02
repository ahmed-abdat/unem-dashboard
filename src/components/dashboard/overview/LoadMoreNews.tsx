"use client";

import { fetchMorePostes } from "@/app/action";
import { NewsPoste } from "@/types/news-poste";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import CardSkeleton from "./CardSkeleton";
import NewCard from "./NewCard";

export default function LoadingMore({
  lastDocId,
  isStudent,
}: {
  lastDocId: string | null;
  isStudent?: boolean;
}) {
  const { ref, inView } = useInView();

  const [lastDocID, setlastDocID] = useState<string | null>(lastDocId);
  const [postes, setPostes] = useState<NewsPoste[]>([]);

  useEffect(() => {
    const fetchMore = async (lastDoc: string) => {
      const { otherPostes, id } = await fetchMorePostes({ lastDocId: lastDoc , collectionName : isStudent ? "student-space" : "postes"});

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
      console.log("lastDocID", lastDocID, "inView", inView, "postes", postes);
      fetchMore(lastDocID);
    }
  }, [inView, lastDocID, postes , isStudent]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
            <div
              ref={ref}
              className={cn({
                "w-full h-10": lastDocID,
                "w-0 h-0 hidden": !lastDocID,
              })}
            ></div>
      {postes.length === 0 && lastDocID ? (
        <CardSkeleton count={6} />
      ) : (
        <>
          {postes.map((poste: NewsPoste) => (
            <NewCard key={poste.id} poste={poste} />
          ))}
        </>
      )}
    </div>
  );
}
