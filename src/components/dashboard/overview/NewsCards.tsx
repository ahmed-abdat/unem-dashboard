'use client';
import { NewsPoste } from "@/types/news-poste";
import NewCard from "@/components/dashboard/overview/NewCard";
import { useEffect, useState } from "react";
import { DocumentData, collection, onSnapshot, orderBy, query } from "firebase/firestore";
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
          postes.push({ id: doc.id, ...doc.data() } as NewsPoste);
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
