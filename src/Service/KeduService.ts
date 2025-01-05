import axios from "axios";
import { allCats, CatBreed, randomCat, Token, UploadResponse, validateToken } from "../Models/ResponseModels";


const api_url=process.env.REACT_APP_API_URL;

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
    return await axios.post<UploadResponse>(api_url+"/upload",form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }}).then(response=>response.data);
}

export const getRandomImage = async():Promise<randomCat>=>{
   return await axios.get<randomCat>( api_url+"/random-image").then(response=>response.data);

}

export const getAllImages = async():Promise<allCats> =>{
    return await axios.get<allCats>(api_url+"/list-images").then(response =>response.data);
}

export const tokenIsValid = async(token:string):Promise<validateToken> =>{
    return await axios.post<validateToken>(api_url+"/verify-captcha",token).then(response=>response.data);
} 

