import { app } from "@/config/firebase";
import {
  ImageType,
  NewsPoste,
  NewsUpdate,
  Poste,
  Thumbnail,
  imagePoste,
} from "@/types/news-poste";
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
  where,
  setDoc,
  DocumentReference,
} from "firebase/firestore/lite";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  StudentPoste,
  PosteStudent,
  StudentUpdate,
} from "@/types/student-space";
import { any } from "zod";
import { faculiters, optionType, filieres } from "@/constant/filiers";
import { Filiers , Institutions} from "@/types/filiers-tabel";

const firestore = getFirestore(app);

export const getPoste = async (
  id: string | null,
  collectionName: string = "postes"
) => {
  if (!id) return { poste: null, docSnap: null };
  const docRef = doc(firestore, collectionName, id);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        poste: {
          id: docSnap.id,
          summary: data?.summary || "",
          videoURL: docSnap.data().videoURL,
          thumbnail: data.thumbnail || null,
          images: data.images || [],
          title: data.title,
          discribtion: data.discribtion,
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

type CollectionName = 'postes' | 'faculiters' | 'student-space';

type DataType<T> = T extends 'postes' | 'student-space' ? NewsPoste : T extends 'faculiters' ? Institutions : never;

export const fetchPostes = async <T extends CollectionName>(collectionName: T = 'postes' as T) => {
  const numberOfPostes = 10;
  try {
    const q = query(
      collection(firestore, collectionName),
      orderBy("createdAt", "desc"),
      limit(numberOfPostes)
    );
    const snapshot = await getDocs(q);
    let postes: DataType<T>[] = [];
    snapshot.forEach((doc) => {
      const postData = doc.data() as DataType<T>; // Cast doc.data() to the appropriate type
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


export const fetchMorePostes = async <T extends CollectionName>({
  lastDocId,
  collectionName = "postes" as T,
}: {
  lastDocId: string | null;
  collectionName?: T;
}): Promise<{ otherPostes: DataType<T>[]; id: null | string }> => {
  console.log("fetchMorePostes", lastDocId);
  const numberOfPostesToFetch = 6;
  let id: string | null = lastDocId;
  if (!lastDocId) return { otherPostes: [], id: null };

  try {
    const { docSnap } = await getPoste(lastDocId);

    if (!docSnap) return { otherPostes: [], id: null };

    const q = query(
      collection(firestore, collectionName),
      orderBy("createdAt", "desc"),
      startAfter(docSnap),
      limit(numberOfPostesToFetch)
    );
    const querySnapshot = await getDocs(q);
    let otherposte: DataType<T>[] = [];
    querySnapshot.forEach((doc) => {
      const posteData = doc.data() as DataType<T>;
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

const DeletePoste = async (id: string, collectionName: string = "postes") => {
  try {
    await deleteDoc(doc(firestore, `${collectionName}/${id}`));
    console.log("Document successfully deleted");
  } catch (error) {
    console.log("Error removing document: ", error);

    console.log(error);
  }
};

export const deltePosteImages = (
  id: string | undefined,
  images: NewsPoste["images"],
  thumbnail: NewsPoste["thumbnail"]
) => {
  console.log(thumbnail, images, "delete poste ?");

  if (!id) return;
  Promise.allSettled(
    images.map(async (img) => {
      const imageRef = ref(storage, `images/${id}/` + img.name);
      return deleteObject(imageRef)
        .then(() => {
          if (thumbnail) {
            deleteThumbnail(id, thumbnail, true);
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
  const { thumbnail, videoURL, summary } = poste;
  try {
    const posteData = {
      ...poste,
      thumbnail: { url: "", name: thumbnail?.name },
      images: [],
      videoURL: videoURL ? videoURL : null,
      summary: summary ? summary : null,
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

export const updatePosteData = async (id: string, posteData: NewsUpdate) => {
  try {
    await updateDoc(doc(firestore, "postes", id), posteData);
    console.log("poste updated");
  } catch (error) {
    console.log(error);
  }
};

// ? update poste images
export const updateImages = async (
  id: string,
  notHostedImages: ImageType[]
) => {
  try {
    await Promise.all(
      notHostedImages.map(async (image) => {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${id}/` + image.file.name);
        await uploadBytes(imageRef, image.file);
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(firestore, "postes", id), {
          images: arrayUnion({ url: downloadURL, name: image.file.name }),
          lasteUpdate: serverTimestamp(),
        });
      })
    );
    console.log("images updated");
  } catch (error) {
    console.log(error);
  }
};

// ? remove poste images
export const removeImage = async (id: string, removeImages: imagePoste[]) => {
  try {
    Promise.all(
      removeImages.map(async (image) => {
        await updateDoc(doc(firestore, "postes", id), {
          images: arrayRemove(image),
          lasteUpdate: serverTimestamp(),
        });
      })
    );
    console.log("images removed");
  } catch (error) {
    console.error(error);
  }
};

// ? update thumbnail
export const updateThumbnail = async (id: string, thumbnail: Thumbnail) => {
  if (!thumbnail?.file) return console.error("no file");
  try {
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `thumbnails/${id}/` + thumbnail?.file.name
    );
    await uploadBytes(thumbnailRef, thumbnail?.file);
    const downloadURL = await getDownloadURL(thumbnailRef);
    await updateDoc(doc(firestore, "postes", id), {
      thumbnail: { url: downloadURL, name: thumbnail?.file.name },
      lasteUpdate: serverTimestamp(),
    });
    console.log("thumbnail updated");
  } catch (error) {
    console.error(error);
  }
};

export const deleteThumbnail = async (
  id: string,
  thumbnail: Thumbnail,
  isDeletePoste: boolean
) => {
  if (!thumbnail) return console.error("no file");
  try {
    const storage = getStorage();
    const thumbnailRef = ref(storage, `thumbnails/${id}/` + thumbnail?.name);
    await deleteObject(thumbnailRef);
    if (isDeletePoste) {
      console.log("thumbnails delted delte poste");
      return;
    }
    await updateDoc(doc(firestore, "postes", id), {
      thumbnail: null,
      lasteUpdate: serverTimestamp(),
    });
    console.log("thumbnail deleted");
  } catch (error) {
    console.error(error);
  }
};

// ! add student poste

export const addStudentPoste = async (poste: PosteStudent) => {
  const { thumbnail, videoURL, summary } = poste;
  try {
    const posteData = {
      ...poste,
      thumbnail: { url: "", name: thumbnail?.name },
      images: [],
      videoURL: videoURL ? videoURL : null,
      summary: summary ? summary : null,
      createdAt: serverTimestamp(),
      lasteUpdate: serverTimestamp(),
    };
    const docRef = await addDoc(
      collection(firestore, "student-space"),
      posteData
    );
    console.log("poste added");

    // add thumbnail file image to storage
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `student-thumbnails/${docRef.id}/` + poste?.thumbnail?.name
    );
    if (poste?.thumbnail?.file) {
      uploadBytes(thumbnailRef, poste.thumbnail.file).then(async () => {
        const downloadURL = await getDownloadURL(thumbnailRef);
        await updateDoc(docRef, {
          thumbnail: { url: downloadURL, name: poste?.thumbnail?.name },
        });
      });
    }

    Promise.all(
      poste.images.map((image) => {
        const storage = getStorage();
        const imageRef = ref(
          storage,
          `student-images/${docRef.id}/` + image.file.name
        );
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

// ! update student poste

export const updateStudentPosteData = async (
  id: string,
  posteData: StudentUpdate
) => {
  try {
    await updateDoc(doc(firestore, "student-space", id), posteData);
    console.log("poste updated");
  } catch (error) {
    console.log(error);
  }
};

// ? update poste student images
export const updateStudentImages = async (
  id: string,
  notHostedImages: ImageType[]
) => {
  try {
    await Promise.all(
      notHostedImages.map(async (image) => {
        const storage = getStorage();
        const imageRef = ref(
          storage,
          `student-images/${id}/` + image.file.name
        );
        await uploadBytes(imageRef, image.file);
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(firestore, "student-space", id), {
          images: arrayUnion({ url: downloadURL, name: image.file.name }),
          lasteUpdate: serverTimestamp(),
        });
      })
    );
    console.log("images updated");
  } catch (error) {
    console.log(error);
  }
};

// ? remove poste student images
export const removeStudentImages = async (
  id: string,
  removeImages: imagePoste[]
) => {
  try {
    Promise.all(
      removeImages.map(async (image) => {
        await updateDoc(doc(firestore, "student-images", id), {
          images: arrayRemove(image),
          lasteUpdate: serverTimestamp(),
        });
      })
    );
    console.log("images removed");
  } catch (error) {
    console.error(error);
  }
};

// ? update thumbnail
export const updateStudentThumbnail = async (
  id: string,
  thumbnail: Thumbnail
) => {
  if (!thumbnail?.file) return console.error("no file");
  try {
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `student-thumbnails/${id}/` + thumbnail?.file.name
    );
    await uploadBytes(thumbnailRef, thumbnail?.file);
    const downloadURL = await getDownloadURL(thumbnailRef);
    await updateDoc(doc(firestore, "student-space", id), {
      thumbnail: { url: downloadURL, name: thumbnail?.file.name },
      lasteUpdate: serverTimestamp(),
    });
    console.log("thumbnail updated");
  } catch (error) {
    console.error(error);
  }
};

export const deleteStudentThumbnail = async (
  id: string,
  thumbnail: Thumbnail,
  isDeletePoste: boolean
) => {
  if (!thumbnail) return console.error("no file");
  try {
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `student-thumbnails/${id}/` + thumbnail?.name
    );
    await deleteObject(thumbnailRef);
    if (isDeletePoste) {
      console.log("student-thumbnails delted delte poste");
      return;
    }
    await updateDoc(doc(firestore, "postes", id), {
      thumbnail: null,
      lasteUpdate: serverTimestamp(),
    });
    console.log("thumbnail deleted");
  } catch (error) {
    console.error(error);
  }
};

// ! delete student poste
const DeleteStudentPoste = async (id: string) => {
  try {
    await deleteDoc(doc(firestore, `student-space/${id}`));
    console.log("Document successfully deleted student");
  } catch (error) {
    console.log("Error removing document student: ", error);

    console.log(error);
  }
};

export const delteStudentPosteImages = (
  id: string | undefined,
  images: StudentPoste["images"],
  thumbnail: StudentPoste["thumbnail"]
) => {
  console.log(thumbnail, images, "delete student poste ?");

  if (!id) return;
  Promise.allSettled(
    images.map(async (img) => {
      const imageRef = ref(storage, `student-images/${id}/` + img.name);
      return deleteObject(imageRef)
        .then(() => {
          if (thumbnail) {
            deleteThumbnail(id, thumbnail, true);
          }
          DeleteStudentPoste(id);
          console.log("image deleted");
        })
        .catch((error) => {
          DeleteStudentPoste(id);
          console.log("image not deleted");
          console.log(error);
        });
    })
  );
};

// ! check if the tabel of the speciality is exist
export const checkIfTabelExist = async (
  faculites: string,
  speciality: string
) => {
  try {
    const docRef = doc(firestore, `faculiters/${faculites}`);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.exists() , docSnap.data());
    if (docSnap.exists()) {
      const isSpecialityExiste = docSnap
        .data()
        ?.flieres.find((f: Filiers) => f.name === speciality);
      if (isSpecialityExiste) {
        return {
          isFacExiste: true,
          isSpecExiste: true,
          tabelImage: isSpecialityExiste,
        };
      } else {
        return {
          isFacExiste: true,
          isSpecExiste: false,
          tabelImage: null,
        };
      }
    } else {
      console.log("faculiter not existe please creat a new one ");
      return {
        isFacExiste: false,
        isSpecExiste: false,
        tabelImage: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      isFacExiste: false,
      isSpecExiste: false,
      tabelImage: null,
    };
  }
};

export const creatSpecialityTabel = async (
  thumbnail: Thumbnail,
  faculite: string,
  speciality: string
) => {
  const facLabel = faculiters.find((f) => f.url.slice(1) === faculite);
  console.log(facLabel);
  
  try {
    const docRef = doc(firestore, `faculiters`, faculite);
    const snapshot = await setDoc(docRef, {
      name: faculite,
      label : facLabel?.content,
      flieres: [],
      createdAt: serverTimestamp(),
    });
    console.log("poste added");

    // add thumbnail file image to storage
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `tabelstudent-image/${faculite}/` + thumbnail?.name
    );
    if (thumbnail?.file) {
      uploadBytes(thumbnailRef, thumbnail.file).then(async () => {
        const downloadURL = await getDownloadURL(thumbnailRef);
        await updateDoc(docRef, {
          flieres: arrayUnion({ url: downloadURL, name: speciality }),
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateSpecialityTabelImage = async (
  thumbnail: Thumbnail,
  docRef : DocumentReference,
  tabelData : Filiers
) => {

  try {
    // remove the old image
    await updateDoc(docRef, {
      flieres: arrayRemove(tabelData),
      createdAt: serverTimestamp(),
    });

    // add the new image
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `tabelstudent-image/${docRef.id}/` + thumbnail?.name
    );
    if (thumbnail?.file) {
      uploadBytes(thumbnailRef, thumbnail.file).then(async () => {
        const downloadURL = await getDownloadURL(thumbnailRef);
        await updateDoc(docRef, {
          flieres: arrayUnion({ url: downloadURL, name: tabelData.name }),
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const updateSpecialityTabel = async (
  thumbnail: Thumbnail,
  faculite: string,
  speciality: string
) => {
  try {
    const docRef = doc(firestore ,"faculiters" , faculite );
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const specilalityDoc = docSnap.data()?.flieres?.find((f : Filiers) => f.name === speciality);
      if(specilalityDoc?.name === speciality && specilalityDoc?.url !== thumbnail?.url){
        updateSpecialityTabelImage(thumbnail, docRef, specilalityDoc)
        return
      }
    }
    // update the faculiters 
    const storage = getStorage();
    const thumbnailRef = ref(
      storage,
      `tabelstudent-image/${faculite}/` + thumbnail?.name
    );
    if (thumbnail?.file) {
      uploadBytes(thumbnailRef, thumbnail.file).then(async () => {
        const downloadURL = await getDownloadURL(thumbnailRef);
        await updateDoc(docRef, {
          flieres: arrayUnion({ url: downloadURL, name: speciality }),
          createdAt: serverTimestamp(),
        });
      });
    }
  } catch (error) {
    console.log(error);
    
  }
};

// ! get filiere tabel
export const getFliers = async (collectionName : string , id : string , flierId : string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    const flierData = docSnap.data()?.flieres.find((f : Filiers) => f.name === flierId);
    return flierData;
  } catch (error) {
    console.log(error);
    return null
  }
}

// ! get faculiters tabel
export const getFaculiters = async (collectionName : string , id : string , flierId : string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.log(error);
    return null
  }
}


// ! delete filiere tabel
export const deleteFlitersTabel = async (collectionName : string , id : string , flierId : string) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const flierData = await getFliers(collectionName , id , flierId);
    if(flierData){
      await updateDoc(docRef, {
        flieres: arrayRemove(flierData),
        createdAt: serverTimestamp(),
      });
    }
    console.log("tabel deleted");
    
  } catch (error) {
    console.log(error);
  }
}

