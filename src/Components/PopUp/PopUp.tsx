import React, { ChangeEvent, useState } from 'react';
import './PopUp.css';
import { getCatBreed, getToken, tokenIsValid, uploadImage } from '../../Service/KeduService';
import heic2any from 'heic2any';
import { addCatData, compressImage, convertPNGtoJPG, dataURLtoBlob, processImage } from '../../Service/ImageProcess';
import catImage from '../../Assets/maxwell-maxwell-spin.gif'
import { toast } from 'react-toastify';
import Turnstile from '../Turnstile/Turnstile';

interface EditProp {
  isOpen: boolean;
  onClose: () => void;
  image: string | ArrayBuffer | null;
  file: File | undefined;
}

const PopUp: React.FC<EditProp> = ({ isOpen, onClose, image, file }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [antiZohan,setAntiZohan] =useState<boolean>(false);
  
  
  if (!isOpen) return null;
  if (loading) {
    return (
      <>
        <div className="popup-overlay" onClick={onClose} />
        <div className="popup-inner">
          <img src={catImage} alt="" />
        </div>
      </>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOnSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!file) {
      alert("No file selected");
      return;
    }
    setLoading(true);
   

    try {
      let outputFile:string|undefined;
      const maxsize = 3072;
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
         outputFile =  processImage(reader.result as string,formData.author);
        }
      };
      

      if (file.type === 'image/heic') {
        const result = (await heic2any({ blob: file, toType: 'image/jpeg' })) as Blob;
        reader.readAsDataURL(result);
      } else if (file.type === 'image/png') {
        convertPNGtoJPG(file, reader);
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        reader.readAsDataURL(file);
      } else {
        toast.warn("Not supported file type",{position:"top-right"});
        setLoading(false);
      }
      const token = await getToken();
      const form = new FormData();
      
      if(file.size/1024 > maxsize){
        const quality = maxsize / (file.size/1024);
        compressImage(file,reader,quality);
        
      }


      
      form.append('data',dataURLtoBlob(outputFile!),"miyav.jpg");
     
     
      const response = await getCatBreed(token,form); 
      form.delete('data');
      const outputFile2 = addCatData(outputFile!,response.labelName);
      
      form.append('file_input',new File([dataURLtoBlob(outputFile2!)],`Kedu${new Date().getTime()}.jpg`));
      if(response.labelName ==='Not Cat'){
        toast.warn("This is not cat",{position:"top-right",autoClose:5000});
      }
      else if(!antiZohan){
        toast.error("Token is invalid", { autoClose: 5000 });
      }
      else{
        const uploadResponse= await uploadImage(form);
        toast.success(uploadResponse.message,{position:"top-right",autoClose:5000});
      }
   
      
      

    } catch (error) {
      console.error("Error processing file:", error);
      toast.warn(error as string,{position:"top-right",autoClose:50000})
    } finally {
      setLoading(false);
      onClose();
            
    }
  };



  const handleToken = async (token: string) => {
    
    const response = await tokenIsValid(token);
    
     if (response.message === "Captcha validation failed") {
       setAntiZohan(false);
       
       
     } else {
       setAntiZohan(true);
     }
     
   };

  
  return (
    <>
      <div className="popup-overlay" onClick={onClose} />
      <div className="popup-inner">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <img className="image" src={image as string} alt="Popup Content"  />
        <form>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author || ''}
            placeholder="Author"
            onChange={handleChange}
          />
        </form>
        <Turnstile
      siteKey={process.env.REACT_APP_SITE_KEY || ""}
      theme="light"
      onSuccess={handleToken} />
        <button type='submit' onClick={handleOnSubmit}>Submit</button>
        
       
      </div>
    </>
  );
};

export default PopUp;
