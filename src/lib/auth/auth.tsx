import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth"
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

export const SignOute = async () => {
    try {
     await signOut(auth); 
    } catch (error) {
        
    }
}

export function useUser (){
    const [user , setUser] = useState<DocumentData | null>(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => setUser(user));
    }, []);

    return user ;
}