import React, { useRef, useState } from 'react';
import './App.css';
import PopUp from './Components/PopUp/PopUp';

function App() {
  const [file,setFile]=useState<File|undefined>();
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview ,setPreview]=useState<string|ArrayBuffer|null>(null);
  const [isOpen, setisOpen] = useState<boolean>(false); 

 

  function handleOnChange(e:React.FormEvent<HTMLInputElement>){
    const target=e.target as HTMLInputElement & {
      files:FileList;
    }
    setFile(target.files[0]);
    const file = new FileReader;
    file.onload= ()=> {
      setPreview(file.result);
    }
    file.readAsDataURL(target.files[0]);
    setisOpen(true);
  }

 

  

 
  
  return (
    <div className="App">
      <h1> KEDU AI IMAGE UPLOAD SERVICE</h1>
     
      <div className='file-upload' onClick={()=>fileInput.current?.click()} > + <input className='upload' type="file" name='image' placeholder='Image' onChange={handleOnChange} ref={fileInput} accept='image/*' /></div>
    <PopUp isOpen={isOpen} onClose={() => setisOpen(false)} image={preview} file={file} ></PopUp>
   
    
    </div>
  );
}

export default App;
