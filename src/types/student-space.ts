

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
  
  export type PosteStudent = {
    title: string;
    discribtion: string;
    summary?: string | null;
    videoURL?: string | null;
    thumbnail: Thumbnail;
    images: ImageType[];
  }
  
    export interface StudentPoste {
      title: string;
      discribtion: string;
      summary?: string | null;
      images: imagePoste[];
      videoURL?: string | null;
      thumbnail: Thumbnail;
      id? : string;
    }
  
  
    export type StudentUpdate = {
      title: string;
      discribtion: string;
      videoURL?: string | null;
    }