import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadFileService {
  async handleUpload(file: Express.Multer.File) {
    // console.log('file', file);
    return file;
  }

  async handleUploads(files: Express.Multer.File[]) {
    // console.log('files', files);
    return files;
  }

  async deleteFile(filepath: string): Promise<boolean> {
    const fullPath = path.resolve(filepath);
    try {
      await fs.promises.unlink(fullPath);
      // console.log(`File ${fullPath} has been deleted.`);
      return true;
    } catch (error) {
      // console.error(`Error while deleting ${fullPath}.`);
      console.error(error);
      throw error;
    }
  }

  // delete folder
  async deleteFolder(folderPath: string): Promise<boolean> {
    const fullPath = path.resolve(folderPath);
    try {
      await fs.promises.rmdir(fullPath, { recursive: true });
      // console.log(`Folder ${fullPath} has been deleted.`);
      return true;
    } catch (error) {
      // console.error(`Error while deleting ${fullPath}.`);
      console.error(error);
      throw error;
    }
  }

  async moveFolder(
    sourcePath: string,
    destinationPath: string,
  ): Promise<boolean> {
    const sourceFullPath = path.resolve(sourcePath);
    const destinationFullPath = path.resolve(destinationPath);

    try {
      await fs.promises.mkdir(path.dirname(destinationFullPath), {
        recursive: true,
      });
      await fs.promises.rename(sourceFullPath, destinationFullPath);
      // console.log(`Folder ${sourcePath} has been moved to ${destinationPath}.`);
      return true;
    } catch (error) {
      // console.error(`Error while moving ${sourcePath} to ${destinationPath}.`);
      console.log('ไม่พบโฟลเดอร์ที่ต้องการลบ');
      return true;
    }
  }
}
