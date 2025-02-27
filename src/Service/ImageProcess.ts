import * as piexif from 'piexifjs';
import { toast } from 'react-toastify';
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
      const utf8Author = new TextEncoder().encode(author || "Unknown Author");
      exifObj['0th'][piexif.ImageIFD.Artist] = utf8Author;
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

  export const convertPNGtoJPG = (file: File, reader: FileReader) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.warn("Canvas not supported",{position:"top-right"});
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const jpegUrl = canvas.toDataURL('image/jpeg', 1);
    
      reader.readAsDataURL(dataURLtoBlob(jpegUrl));

    };
    img.src = URL.createObjectURL(file);
  };



  export const compressImage = (file: File, reader: FileReader,quality:number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.warn("Canvas not supported",{position:"top-right"});
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const jpegUrl = canvas.toDataURL('image/jpeg', quality);
    
      reader.readAsDataURL(dataURLtoBlob(jpegUrl));

    };
    img.src = URL.createObjectURL(file);
    

  };