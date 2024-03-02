"use client";

import { fetchMorePostes } from "@/app/action";
import { NewsPoste } from "@/types/news-poste";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import CardSkeleton from "@/components/dashboard/overview/CardSkeleton";
import InstitutionsCard from "@/components/dashboard/overview/institutions/InstitutionsCard";
import { Institutions } from "@/types/filiers-tabel";
import { Separator } from "@/components/ui/separator";

export default function LoadingMore({
  lastDocId,
}: {
  lastDocId: string | null;
}) {
  const { ref, inView } = useInView();

  const [lastDocID, setlastDocID] = useState<string | null>(lastDocId);
  const [postes, setPostes] = useState<Institutions[]>([]);

  useEffect(() => {
    const fetchMore = async (lastDoc: string) => {
      const { otherPostes, id } = await fetchMorePostes({
        lastDocId: lastDoc,
        collectionName: "faculiters",
      });

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
  }, [inView, lastDocID, postes]);

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
          {postes.map((poste: Institutions) => (
            <div key={poste.id} className="w-full flex flex-col gap-y-4">
              <h2>{poste.name}</h2>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
                {poste?.flieres.map((filiere) => (
                  <InstitutionsCard
                    key={filiere.name}
                    poste={filiere}
                    posteIde={poste.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
