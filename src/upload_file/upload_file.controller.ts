import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  StreamableFile,
  Query,
  Res,
} from '@nestjs/common';
import { UploadFileService } from './upload_file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { mkdirSync, createReadStream, readFileSync } from 'fs';
import { Response } from 'express';
// import * as fs from 'fs';

@Controller('upload')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}
  @Delete('delete_file')
  async deleteFile(@Body() body: { filepath: string }): Promise<string> {
    const { filepath } = body;
    const result = await this.uploadFileService.deleteFile(filepath);
    return result ? `ลบไฟล์ ${filepath} แล้ว.` : `ไม่พบไฟล์ ${filepath}`;
  }

  @Post('profile/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { userId } = req.params;
          const uploadPath = `./uploads/profile/${userId}`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const utf8String = decodeURIComponent(escape(file.originalname));
          const thaiString = utf8String.replace(
            /\\u([\dA-Fa-f]{4})/g,
            (match, p1) => String.fromCharCode(parseInt(p1, 16)),
          );
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(thaiString);
          const name = thaiString.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadProfile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.handleUpload(file);
  }

  // multifile
  @Post('profiles/:userId')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { userId } = req.params;
          const uploadPath = `./uploads/profile/${userId}`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const utf8String = decodeURIComponent(escape(file.originalname));
          const thaiString = utf8String.replace(
            /\\u([\dA-Fa-f]{4})/g,
            (match, p1) => String.fromCharCode(parseInt(p1, 16)),
          );
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(thaiString);
          const name = thaiString.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadProfiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.uploadFileService.handleUploads(files);
  }

  @Post('all/:id')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { id } = req.params;
          const uploadPath = `./uploads/all/${id}`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const utf8String = decodeURIComponent(escape(file.originalname));
          const thaiString = utf8String.replace(
            /\\u([\dA-Fa-f]{4})/g,
            (match, p1) => String.fromCharCode(parseInt(p1, 16)),
          );
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(thaiString);
          const name = thaiString.replace(ext, '');
          const filename = `${uniqueSuffix}-98it${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadAllFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.uploadFileService.handleUploads(files);
  }

  // @Get(':filename')
  // getFile(@Res() res: Response, @Param('filename') filename: string) {
  //   const file = join(__dirname, '..', 'public', filename);
  //   res.sendFile(file);
  // }
  // @Get('getImage')
  // async getFile(@Body() body: { filepath: string }): Promise<string> {
  //   const { filepath } = body;
  //   const result = await this.uploadFileService.deleteFile(filepath);
  //   return result ? `ลบไฟล์ ${filepath} แล้ว.` : `ไม่พบไฟล์ ${filepath}`;
  // }

  // @Get("getImage")
  // getFile(@Res() res: Response) {
  //   const file = createReadStream(join(process.cwd(), 'package.json'));
  //   file.pipe(res);
  // }

  @Post('getImage')
  async getFile(@Body('filePath') filePath: string, @Res() res: Response) {
    const path = join(process.cwd(), `/${filePath}`);
    const stream = createReadStream(path);
    const chunks: any[] = [];

    // Read the file into chunks
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    // Join the chunks into a single Buffer
    const buffer = Buffer.concat(chunks);

    // Convert the buffer to a base64 string
    const base64 = buffer.toString('base64');

    // Send the base64 string as the response
    res.send(base64);
  }
  // getFile(): StreamableFile {

  // }

  @Post('product/:productId/seller')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { productId } = req.params;
          const uploadPath = `./uploads/product/${productId}/seller`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadProductOfStore(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('product/:productId/buyer')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { productId } = req.params;
          const uploadPath = `./uploads/product/${productId}/buyer`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadProductOfConsignment(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('consignment/:conId/admin/slip')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { conId } = req.params;
          const uploadPath = `./uploads/consignment/${conId}/admin/slip`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadConsignmentSlip(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('consignment/:conId/admin/product_inspection')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { conId } = req.params;
          const uploadPath = `./uploads/consignment/${conId}/admin/product_inspection`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadConsignmentProductInspection(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('consignment/:conId/:userId/proof_of_delivery')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { conId, userId } = req.params;
          const uploadPath = `./uploads/consignment/${conId}/${userId}/proof_of_delivery`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadConsignmentProofOfDelivery(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('refund/:refundId/buyer/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { refundId } = req.params;
          const uploadPath = `./uploads/refund/${refundId}/buyer/image`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadRefundImageByBuyer(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('refund/:refundId/buyer/video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { refundId } = req.params;
          const uploadPath = `./uploads/refund/${refundId}/buyer/video`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadRefundVideoByBuyer(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('refund/:refundId/admin/product_inspection')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { refundId } = req.params;
          const uploadPath = `./uploads/refund/${refundId}/admin/product_inspection`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadRefundImageByAdmin(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('refund/:refundId/admin/slip')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { refundId } = req.params;
          const uploadPath = `./uploads/refund/${refundId}/admin/slip`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadRefundSlipByAdmin(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadFileService.handleUpload(file);
  }

  @Post('promotion/:promotionId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { promotionId } = req.params;
          const uploadPath = `./uploads/promotion/${promotionId}`;
          mkdirSync(uploadPath, { recursive: true }); // สร้างโฟลเดอร์หากยังไม่มี
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async handleUploadPromotionImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.handleUpload(file);
  }
}
