import { app } from "@/config/firebase";
import { NewsPoste } from "@/types/news-poste";
import {
  collection,
  getFirestore,
  orderBy,
  query,
  limit,
  getDocs,
  startAfter,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore/lite";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { revalidatePath } from 'next/cache'

const firestore = getFirestore(app);

export const getPoste = async (id: string | null) => {
  if (!id) return { poste: null , docSnap: null};
  const docRef = doc(firestore, "postes", id);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = {...docSnap.data()};
      return {
        poste: {
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt.seconds,
          lasteUpdate: data?.lasteUpdate?.seconds || null,
        } as NewsPoste,
        docSnap,
      };
    } else {
      console.log("No such document!");
      return { poste: null , docSnap: null};
    }
  } catch (error) {
    console.log(error);
    return { poste: null , docSnap: null};
  }
}

export const fetchPostes = async () => {
  const numberOfPostes = 10;
  try {
    const q = query(
      collection(firestore, "postes"),
      orderBy("createdAt", "desc"),
      limit(numberOfPostes)
    );
    const snapshot = await getDocs(q);
    let postes: NewsPoste[] = [];
    snapshot.forEach((doc) => {
      const postData = doc.data() as NewsPoste; // Cast doc.data() to NewsPoste type
      postes.push({ id: doc.id, ...postData });
    });

    if (postes.length === 0 ) return { postes: [], lastDocId: null };

    if(postes.length <= numberOfPostes){
      return { postes, lastDocId: null };
    }
    
    

    const lastDocId = snapshot.docs[snapshot.docs.length - 1].id;
    return { postes, lastDocId };
  } catch (error) {
    console.log(error);
    return { postes: [], lastDocId: null };
  }
};

export const fetchMorePostes = async ({
  lastDocId,
}: {
  lastDocId: string | null;
}) : Promise<{ otherPostes: NewsPoste[], id: null | string }> => {
  console.log("fetchMorePostes", lastDocId);
  const numberOfPostesToFetch = 6;
  let id: string | null = lastDocId;
  if(!lastDocId) return { otherPostes: [], id: null };

  try {
    const { docSnap } = await getPoste(lastDocId);
    

    if(!docSnap) return { otherPostes: [], id: null };

    const q = query(
      collection(firestore, "postes"),
      orderBy("createdAt", "desc"),
      startAfter(docSnap),
      limit(numberOfPostesToFetch)
    );
    const querySnapshot = await getDocs(q);
    let otherposte: NewsPoste[] = [];
    querySnapshot.forEach((doc) => {
      const posteData = doc.data() as NewsPoste;
      otherposte.push({ id: doc.id, ...posteData });
    });

    id = querySnapshot.docs[querySnapshot.docs.length - 1]?.id;
    const docsLength = querySnapshot.size;
    if (docsLength < numberOfPostesToFetch) {
      id = null;
    }
    return { otherPostes: otherposte, id };
  } catch (error) {
    console.log(error);
    return { otherPostes: [], id: null };
  }
};


// ! delete poste
const storage = getStorage();


const DeletePoste = async (id : string) => {
  try {
    await deleteDoc(doc(firestore, `postes/${id}`));
    console.log("Document successfully deleted");
  } catch (error) {
    console.log("Error removing document: ", error);
    
    console.log(error);
  }
};


export const deltePosteImages = (id: string | undefined, images: NewsPoste['images']) => {
  if (!id) return;
  Promise.allSettled(
    images.map( async (img) => {
      const imageRef = ref(storage, `images/${id}/` + img.name);
      return deleteObject(imageRef)
        .then(() => {
          DeletePoste(id);
          console.log("image deleted");
        })
        .catch((error) => {
          console.log('image not deleted');
          
          console.log(error);
        });
    })
  );
};