"use client";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import InstitutionsCard from "./InstitutionsCard";
import { Institutions } from "@/types/filiers-tabel";
import { Separator } from "@/components/ui/separator";

export default function InstitutionsCards({
  postes,
}: {
  postes: Institutions[];
}) {
  const [RTpostes, setRTpostes] = useState<Institutions[]>(postes);

  useEffect(() => {
    // get real time updates from firebase
    const q = query(collection(db, "faculiters"), orderBy("createdAt", "desc"));
    const snapchot = onSnapshot(q, (querySnapshot) => {
      const postes: Institutions[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postes.push({
          name: data.name,
          flieres: data.flieres,
          id: doc.id,
        });
      });
      localStorage.removeItem("poste");
      setRTpostes(postes);
    });

    return () => snapchot();
  }, []);

  if (postes.length === 0) return null;

  return (
    <>
      {RTpostes.map((poste: Institutions) => (
        <div key={poste.id} className="w-full flex flex-col gap-y-4">
          {poste.flieres.length > 0 && (
            <>
              <h2 className="font-tajawal font-semibold text-lg">كلية :  {poste.name}</h2>
              <Separator className="max-w-sm" />
            </>
          )}
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
  );
}
