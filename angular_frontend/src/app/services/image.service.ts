import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  convertFileToJpegBase64(file: File, callback: Function, errCallback: Function, width: number, height: number, quality:number=1){
    if (file.type.split("/")[0] !== "image")
      return errCallback("File has no Image type!");
    // read FileData
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      // convert File to Image Object
      let img = new Image();
      img.onload = () => {
        // create temporary invisible canvas in DOM
        var cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;
        // draw image on canvas and resize to standard values
        cvs.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
        // convert to JPEG
        var newImageData = cvs.toDataURL("image/jpeg", quality);
        callback(newImageData)
      }
      img.src = event.target.result;
    };
    reader.onerror = (event: any) => {
      errCallback("File could not be read: " + event.target.error.code);
    };
  }

  getPlaceholderImage(){
    return "/assets/placeholderImage.jpg";
  }

  getUserPlaceholderImage(){
    return "/assets/userPlaceholder.png";
  }
}
