import { app } from "@/config/firebase";
import { ImageType, NewsPoste, NewsUpdate, Poste, Thumbnail, imagePoste } from "@/types/news-poste";
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
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  arrayRemove,
} from "firebase/firestore/lite";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firestore = getFirestore(app);

export const getPoste = async (id: string | null) => {
  if (!id) return { poste: null, docSnap: null };
  const docRef = doc(firestore, "postes", id);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        poste: {
          id: docSnap.id,
          createdAt: data.createdAt.seconds,
          lasteUpdate: data?.lasteUpdate?.seconds || null,
          videoURL: docSnap.data().videoURL,
          thumbnail: data.thumbnail || null,
          images: data.images || [],
          title : data.title,
          discribtion : data.discribtion,

        },
        docSnap,
      };
    } else {
      console.log("No such document!");
      return { poste: null, docSnap: null };
    }
  } catch (error) {
    console.log(error);
    return { poste: null, docSnap: null };
  }
};

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

    if (postes.length === 0) return { postes: [], lastDocId: null };

    if (postes.length < numberOfPostes) {
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
}): Promise<{ otherPostes: NewsPoste[]; id: null | string }> => {
  console.log("fetchMorePostes", lastDocId);
  const numberOfPostesToFetch = 6;
  let id: string | null = lastDocId;
  if (!lastDocId) return { otherPostes: [], id: null };

  try {
    const { docSnap } = await getPoste(lastDocId);

    if (!docSnap) return { otherPostes: [], id: null };

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

const DeletePoste = async (id: string) => {
  try {
    await deleteDoc(doc(firestore, `postes/${id}`));
    console.log("Document successfully deleted");
  } catch (error) {
    console.log("Error removing document: ", error);

    console.log(error);
  }
};



export const deltePosteImages = (
  id: string | undefined,
  images: NewsPoste["images"],
  thumbnail : NewsPoste["thumbnail"] 
) => {
  console.log(thumbnail , images , 'delete poste ?');
  
  if (!id) return;
  Promise.allSettled(
    images.map(async (img) => {
      const imageRef = ref(storage, `images/${id}/` + img.name);
      return deleteObject(imageRef)
        .then(() => {
          if(thumbnail){
            deleteThumbnail(id , thumbnail, true)
          }
          DeletePoste(id);
          console.log("image deleted");
        })
        .catch((error) => {
          DeletePoste(id);
          console.log("image not deleted");
          console.log(error);
        });
    })
  );
};

// ! add poste

export const addPoste = async (poste: Poste) => {
  const { thumbnail , videoURL} = poste;
  try {
    const posteData = {
      ...poste,
      thumbnail: { url: "", name: thumbnail?.name },
      images: [],
      videoURL : videoURL ? videoURL : null,
      createdAt: serverTimestamp(),
      lasteUpdate: serverTimestamp(),
    };
    const docRef = await addDoc(collection(firestore, "postes"), posteData);
    console.log("poste added");

    // add thumbnail file image to storage
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `thumbnails/${docRef.id}/` + poste?.thumbnail?.name
    );
    if (poste?.thumbnail?.file) {
      uploadBytes(thumbnailRef, poste.thumbnail.file).then(async () => {
        const downloadURL = await getDownloadURL(thumbnailRef);
        await updateDoc(docRef, {
          thumbnail: { url: downloadURL, name: poste?.thumbnail?.name },
        });
      });
    }

    // navigate("/");
    Promise.all(
      poste.images.map((image) => {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${docRef.id}/` + image.file.name);
        uploadBytes(imageRef, image.file).then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(docRef, {
            images: arrayUnion({ url: downloadURL, name: image.file.name }),
          });
        });
      })
    )
      .then(() => {
        console.log("images added");
        return { success: true, id: docRef.id };
      })
      .catch((error) => {
        console.log(error);
        return { success: false, id: null };
      });
  } catch (error) {
    console.log(error);
    return { success: false, id: null };
  }
};


// ! update poste

export const updatePosteData = async (id : string ,posteData : NewsUpdate) => {
  try {
    await updateDoc(doc(firestore, "postes", id), posteData);
    console.log("poste updated");
  } catch (error) {
    console.log(error);
  }
};

// ? update poste images 
export const updateImages = async (id : string,notHostedImages : ImageType[]) => {
  try {
    await Promise.all(
      notHostedImages.map(async (image) => {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${id}/` + image.file.name);
        await uploadBytes(imageRef, image.file);
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(firestore, "postes", id), {
          images: arrayUnion({ url : downloadURL, name : image.file.name }),
          lasteUpdate : serverTimestamp()
        });
      })
    )
    console.log("images updated");
  } catch (error) {
    console.log(error);
  }
};

// ? remove poste images 
export const removeImage = async (id : string , removeImages : imagePoste[]) => {
  try {
    Promise.all(
      removeImages.map(async (image) => {
        await updateDoc(doc(firestore, "postes", id), {
          images: arrayRemove(image),
          lasteUpdate : serverTimestamp()
        });
      })
    )
    console.log("images removed");
  } catch (error) {
    console.error(error);
  }
}

// ? update thumbnail
export const updateThumbnail = async (id : string , thumbnail : Thumbnail) => {
  if(!thumbnail?.file) return console.error("no file");
  try {
    const storage = getStorage();
    const thumbnailRef = ref(storage, `thumbnails/${id}/` + thumbnail?.file.name);
    await uploadBytes(thumbnailRef, thumbnail?.file);
    const downloadURL = await getDownloadURL(thumbnailRef);
    await updateDoc(doc(firestore, "postes", id), {
      thumbnail: { url: downloadURL, name: thumbnail?.file.name },
      lasteUpdate : serverTimestamp()
    });
    console.log("thumbnail updated");
  } catch (error) {
    console.error(error);
  }
}

export const deleteThumbnail = async (id : string , thumbnail : Thumbnail , isDeletePoste : boolean) => {
  if(!thumbnail) return console.error("no file");
  try {
    const storage = getStorage();
    const thumbnailRef = ref(storage, `thumbnails/${id}/` + thumbnail?.name);
    await deleteObject(thumbnailRef);
    if(isDeletePoste){
      console.log('thumbnails delted delte poste');
      return
    } 
    await updateDoc(doc(firestore, "postes", id), {
      thumbnail: null,
      lasteUpdate : serverTimestamp()
    });
    console.log("thumbnail deleted");
  } catch (error) {
    console.error(error);
  }
}