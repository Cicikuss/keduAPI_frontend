import * as piexif from 'piexifjs';
export const dataURLtoBlob = (dataURL: string): Blob => {
    const [header, base64] = dataURL.split(';base64,');
    const binary = atob(base64);
    const length = binary.length;
    const uintArray = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      uintArray[i] = binary.charCodeAt(i);
    }

    return new Blob([uintArray], { type: header.split(':')[1] });
  };


export  const processImage = (imageData: string,author:string) => {
    try {
      return addMetadata(imageData,author);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

 export const addMetadata = (imageData: string,author:string) => {
    try {
      const exifObj = piexif.load(imageData);
      exifObj['0th'][piexif.ImageIFD.Artist] = author || 'Unknown Author';
      const exifBytes = piexif.dump(exifObj);
      const newImageData = piexif.insert(exifBytes, imageData);
      return newImageData
    } catch (error) {
      console.error('Error adding metadata:', error);
    }
  };

  export const addCatData = (imageData: string,breed:string) => {
    try {
      const exifObj = piexif.load(imageData);
      exifObj["0th"][piexif.ImageIFD.ImageDescription] = breed;
      const exifBytes = piexif.dump(exifObj);
      const newImageData = piexif.insert(exifBytes, imageData);
      return newImageData;
    } catch (error) {
      console.error('Error adding metadata:', error);
    }
  };