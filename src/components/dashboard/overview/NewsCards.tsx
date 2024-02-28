'use client';
import { NewsPoste } from "@/types/news-poste";
import NewCard from "@/components/dashboard/overview/NewCard";
import { useEffect, useState } from "react";
import { DocumentData, collection, onSnapshot, orderBy, query, sum } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function NewsCards({ postes }: { postes: NewsPoste[] }) {

  const [ RTpostes , setRTpostes] = useState<NewsPoste[]>(postes);
  
    useEffect(() => {
      // get real time updates from firebase 
      const q = query(
        collection(db, "postes"),
        orderBy("createdAt", "desc")
      );
      const snapchot = onSnapshot(q, (querySnapshot) => {
        const postes : NewsPoste[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const posteData = {
              id: doc.id,
              summary: data?.summary || "",
              videoURL: data.videoURL,
              thumbnail: data.thumbnail || null,
              images: data.images || [],
              title : data.title,
              discribtion : data.discribtion,
            };
          postes.push(posteData);
        });
  
        console.log("postes", postes);
        localStorage.removeItem("poste");
        setRTpostes(postes);
      
      });
      
      return () => snapchot();
        
        
    }, []);

  if (postes.length === 0) return null;

  return (
    <>
      {RTpostes.map((poste: NewsPoste) => (
        <NewCard key={poste.id} poste={poste} />
      ))}
    </>
  );
}
