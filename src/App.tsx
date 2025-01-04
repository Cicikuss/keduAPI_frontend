import React, { useRef, useState } from 'react';
import './App.css';
import PopUp from './Components/PopUp/PopUp';
import { toast, ToastContainer } from 'react-toastify';

function App() {
  const [file,setFile]=useState<File|undefined>();
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview ,setPreview]=useState<string|ArrayBuffer|null>(null);
  const [isOpen, setisOpen] = useState<boolean>(false); 

 

  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const selectedFile = target.files[0];
      setFile(selectedFile);
  
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
      setisOpen(true);
    } else {
      toast.warn("Image is not selected",{autoClose:5000,position:"top-right"});
      
    }
  }
  

 

  

 
  
  return (
    <div className="App">
      <h1> KEDU API IMAGE UPLOAD SERVICE</h1>
     
      <div className='file-upload' onClick={()=>fileInput.current?.click()} > + <input className='upload' type="file" name='image' placeholder='Image' onChange={handleOnChange} ref={fileInput} accept='image/*' /></div>
    <PopUp isOpen={isOpen} onClose={() => setisOpen(false)} image={preview} file={file} ></PopUp>
    <ToastContainer/>
   
    
    </div>
  );
}

export default App;
