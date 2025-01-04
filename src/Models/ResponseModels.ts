export type CatBreed = {
    labelName:string,
    labelId:string,
    confidence:number
}
export type Token ={
    access_token:string,
    token_type:string,
    expires_in:number
}
export type UploadResponse ={
    message:string
}
export type allCats = {
    images:string[]
}
export  type randomCat = {
    image_url:string,
    metadata : {
        name:string,
        "content-type":string,
        size:number,
        updated:string
    }
}