import axios from "axios";
import { Token } from "../Models/Token";
import { CatBreed } from "../Models/CatBreed";
import { UploadResponse } from "../Models/UploadResponse";


export const getToken=  async ():Promise<Token> =>{
    const client_id=process.env.REACT_APP_CLIENT_ID;
    const client_secret=process.env.REACT_APP_CLIENT_SECRET;
   
    return  await axios.post<Token>('https://www.nyckel.com/connect/token',{
        grant_type :"client_credentials",
        client_id:client_id,
        client_secret:client_secret,
       },{headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then(response=>response.data);
}

export const getCatBreed = async (token:Token,form:FormData):Promise<CatBreed>=> {
    return await axios.post<CatBreed>("https://www.nyckel.com/v1/functions/cat-breed-identifier/invoke",form
    ,{headers:{"accessToken":token.access_token}}).then(response =>response.data);
}

export const uploadImage= async(form:FormData):Promise<UploadResponse> =>{
    return await axios.post<UploadResponse>("/upload",form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }}).then(response=>response.data);
}

export const getRandomImage = async()=>{
    axios.get( "/random-image").then(response=>console.log(response.data));
}

