// multer-config.ts

import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';
import { extname } from 'path';

export const multerStorageConfig = (path: string) => {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const { name } = req.body;
        const uploadPath = `./uploads/project/${name}/${path}`;
        mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const utf8String = decodeURIComponent(escape(file.originalname));
        const thaiString = utf8String.replace(
          /\\u([\dA-Fa-f]{4})/g,
          (match, p1) => String.fromCharCode(parseInt(p1, 16)),
        );
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(thaiString);
        const name = thaiString.replace(ext, '');
        const filename = `${name}-${uniqueSuffix}${ext}`;
        cb(null, filename.replace(/\s/g, ''));
      },
    }),
  };
};

export const multerStorageConfigForImageVideo = (path: string) => {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const { project_name, type } = req.body;
        const uploadPath = `./uploads/project/${project_name}/${path}/${type}`;
        mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const utf8String = decodeURIComponent(escape(file.originalname));
        const thaiString = utf8String.replace(
          /\\u([\dA-Fa-f]{4})/g,
          (match, p1) => String.fromCharCode(parseInt(p1, 16)),
        );
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(thaiString);
        const name = thaiString.replace(ext, '');
        const filename = `${name}-${uniqueSuffix}${ext}`;
        cb(null, filename.replace(/\s/g, ''));
      },
    }),
  };
};

export const leaseMulterStorageConfig = (path: string) => {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const { name, propertyOwner } = req.body;
        const uploadPath = `./uploads/project/${name}/${path}/${propertyOwner}`;
        mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const utf8String = decodeURIComponent(escape(file.originalname));
        const thaiString = utf8String.replace(
          /\\u([\dA-Fa-f]{4})/g,
          (match, p1) => String.fromCharCode(parseInt(p1, 16)),
        );
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(thaiString);
        const name = thaiString.replace(ext, '');
        const filename = `${name}-${uniqueSuffix}${ext}`;
        cb(null, filename.replace(/\s/g, ''));
      },
    }),
  };
};

// save base64 to file
export const multerStorageConfigForBase64 = (path: string) => {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // const { name } = req.body;
        console.log('base64', req.body);
      },
      // png base64
      filename: (req, file, cb) => {
        
        console.log('base64', req.body);
        // const utf8String = decodeURIComponent(escape(file.originalname));
        // const thaiString = utf8String.replace(
        //   /\\u([\dA-Fa-f]{4})/g,
        //   (match, p1) => String.fromCharCode(parseInt(p1, 16)),
        // );
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // const ext = extname(thaiString);
        // const name = thaiString.replace(ext, '');
        // const filename = `${name}-${uniqueSuffix}${ext}`;
        // cb(null, filename.replace(/\s/g, ''));
      },
    }),
  };
};
