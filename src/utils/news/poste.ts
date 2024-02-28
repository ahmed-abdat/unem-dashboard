import { ImageType, NewsPoste, Poste } from "@/types/news-poste";

export const checkIsImagesTheSame = (
    oldImages: ImageType[] | NewsPoste["images"],
    newImages: ImageType[] | NewsPoste["images"]
  ) => {
    if (oldImages.length !== newImages.length) return false;
    const oldImagesNames = oldImages.map((image) => image.name);
    const newImagesNames = newImages.map((image) => image.name);
    return oldImagesNames.every((name) => newImagesNames.includes(name));
  };

 export const isSamePoste = (oldPoste: NewsPoste, newPoste: Poste) => {
    if (
      oldPoste.title.trim() === newPoste.title.trim() &&
      oldPoste?.summary?.trim() === newPoste?.summary?.trim() &&
      oldPoste.discribtion?.trim() === newPoste.discribtion?.trim() &&
      oldPoste?.videoURL === newPoste?.videoURL &&
      oldPoste?.thumbnail?.url === newPoste?.thumbnail?.url &&
      checkIsImagesTheSame(oldPoste.images, newPoste.images)
    ) {
      return true;
    }
    return false;
  };


export const isUpdatePoste = (oldPoste: NewsPoste, newPoste: Poste) => {
  console.log(oldPoste, newPoste);
  
    if (
        oldPoste.title.trim() !== newPoste.title.trim() ||
        oldPoste?.summary?.trim() !== newPoste?.summary?.trim() ||
        oldPoste.discribtion?.trim() !== newPoste.discribtion?.trim() ||
        oldPoste?.videoURL !== newPoste?.videoURL
    ){
        return true;
    }
    return false;
}
