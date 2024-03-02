"use client";
import { NewsPoste } from "@/types/news-poste";
import NewCard from "@/components/dashboard/overview/NewCard";
import { useEffect, useState } from "react";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
  sum,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { StudentPoste } from "@/types/student-space";

export default function NewsCards({
  postes,
  isStudent,
}: {
  postes: NewsPoste[];
  isStudent?: boolean;
}) {
  const [RTpostes, setRTpostes] = useState<NewsPoste[]>(postes);

  useEffect(() => {
    // get real time updates from firebase
    const q = query(
      collection(db, isStudent ? "student-space" : "postes"),
      orderBy("createdAt", "desc")
    );
    const snapchot = onSnapshot(q, (querySnapshot) => {
      const postes: NewsPoste[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const posteData = {
          id: doc.id,
          summary: data?.summary || "",
          videoURL: data.videoURL,
          thumbnail: data.thumbnail || null,
          images: data.images || [],
          title: data.title,
          discribtion: data.discribtion,
        };
        postes.push(posteData);
      });

      console.log(`${isStudent ? "student-space" : "postes"}`, postes);
      localStorage.removeItem("poste");
      setRTpostes(postes);
    });

    return () => snapchot();
  }, []);

  if (postes.length === 0) return null;

  return (
    <>
      {RTpostes.map((poste: StudentPoste) => (
        <NewCard
          key={poste.id}
          poste={poste}
          isStudent={isStudent ? true : false}
        />
      ))}
    </>
  );
}
