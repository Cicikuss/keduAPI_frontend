declare module "piexifjs" {
    export function load(data: string): Record<string, any>;
    export function dump(data: Record<string, any>): string;
    export function insert(exif: string, data: string): string;
    export function remove(data: string): string;
    export function undefinedToString(data: string | number, charset: string): string;
    export const ImageIFD: {
      Artist: number;
      ImageDescription:string;

    };

    export const ExifIFD: {
      UserComment: string;
      [key: string]: any; 
    };

  
  }
  