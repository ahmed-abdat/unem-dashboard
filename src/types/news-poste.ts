import { Timestamp } from "firebase/firestore";

interface image {
  url: string;
  name: string;
}

export interface NewsPoste {
  title: string;
  description: string;
  images: image[];
  createdAt: Timestamp;
  lasteUpdate : Timestamp;
  id? : string;
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
  videURL: string;
  thumbnail: Thumbnail;
  images: ImageType[];
}
