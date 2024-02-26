import { Timestamp } from "firebase/firestore";

export interface imagePoste {
  url: string;
  name: string;
}


export type ImageType = {
  name: string;
  url: string;
  file: File;
}
export type Thumbnail = {
  name: string;
  url: string;
  file: File;
} | null; 

export type Poste = {
  title: string;
  discribtion: string;
  videoURL?: string | null;
  thumbnail: Thumbnail;
  images: ImageType[];
}

  export interface NewsPoste {
    title: string;
    discribtion: string;
    images: imagePoste[];
    videoURL?: string | null;
    thumbnail: Thumbnail;
    createdAt: Timestamp;
    lasteUpdate : Timestamp;
    id? : string;
  }


  export type NewsUpdate = {
    title: string;
    discribtion: string;
    videoURL?: string | null;
  }