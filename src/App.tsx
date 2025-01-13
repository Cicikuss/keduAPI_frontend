import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import PopUp from "./Components/PopUp/PopUp";
import { toast, ToastContainer } from "react-toastify";
import { getRandomImage } from "./Service/KeduService";


function App() {
  const [file, setFile] = useState<File | undefined>();
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>("https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif"); // Default image
  const dvdRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState({ x: 1, y: 1 });

  

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const selectedFile = target.files[0];
      setFile(selectedFile);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
      setIsOpen(true);
    } else {
      toast.warn("Image is not selected", { autoClose: 5000, position: "top-right" });
    }
  };

  const OnClick = async () => {
    try {
      const response = await getRandomImage();
      setImage(response.image_url || "https://media.tenor.com/k_UsDt9xfWIAAAAM/i-will-eat-you-cat.gif"); // Fallback image
      
    } catch (error) {
      toast.error("Failed to load image", { autoClose: 5000 });
    }
  };

  useEffect(() => {
    const container = document.querySelector(".dvd-container");
    const dvdImage = dvdRef.current;

    if (!container || !dvdImage) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let animationFrameId: number;

    const animate = () => {
      setPosition((prevPosition) => {
        let newX = prevPosition.x + speed.x;
        let newY = prevPosition.y + speed.y;

        if (newX + 100 >= containerWidth || newX <= 0) {
          setSpeed((prevSpeed) => ({ ...prevSpeed, x: -prevSpeed.x }));
        }

        if (newY + 100 >= containerHeight || newY <= 0) {
          setSpeed((prevSpeed) => ({ ...prevSpeed, y: -prevSpeed.y }));
        }

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);
  
 
  return (
    <div className="App">
      <meta name="google-site-verification" content="aD3tiBOgQPB09LE8zvswe_412LPNrGFQNtHHCJG71rk" /> 
      
      <div className="dvd-container">
        {image && (
          <img
            id="dvd-image"
            src={image}
            alt="Randomly generated"
            ref={dvdRef}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
          />
        )}
      </div>
      <h1>KEDU API IMAGE UPLOAD SERVICE</h1>
     
      <div className="file-upload" onClick={() => fileInput.current?.click()}>
        +
        <input
          className="upload"
          type="file"
          name="image"
          placeholder="Image"
          onChange={handleOnChange}
          ref={fileInput}
          accept="image/*"
        />
      </div>
      <PopUp isOpen={isOpen} onClose={() => setIsOpen(false)} image={preview} file={file}></PopUp>
      <ToastContainer />
      <div className="contributors">
        <p>
          This project was developed by{" "}
          <a href="https://github.com/Cicikuss" target="_blank" rel="noopener noreferrer">
            Cicikuss
          </a>{" "}
          and{" "}
          <a href="https://github.com/Hajorda" target="_blank" rel="noopener noreferrer">
            Hajorda
          </a>
          .
        </p>
        <button onClick={OnClick}>Random Image</button>
      </div>
    </div>
  );
}

export default App;
