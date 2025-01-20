import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { UploadChunkDto } from './dto/upload-chunk/upload-chunk';

@Injectable()
export class UploadService {
  private readonly tempDir = path.join(__dirname, '..', '..', 'uploads');

  constructor() {
    // Pastikan folder upload tersedia
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async getUploadedChunks(fileKey: string): Promise<{ uploadedChunks: number[] }> {
    const fileChunksDir = path.join(this.tempDir, fileKey);

    if (!fs.existsSync(fileChunksDir)) {
      return { uploadedChunks: [] }; // Jika belum ada folder, tidak ada chunk yang diupload
    }

    const uploadedChunks = fs.readdirSync(fileChunksDir)
      .map((file) => parseInt(file.split('.')[0], 10)) // Ambil indeks dari nama file chunk
      .filter((index) => !isNaN(index)); // Pastikan hanya angka yang valid

    return { uploadedChunks };
  }

  async handleChunk(file: Express.Multer.File, { fileKey, chunkIndex }: UploadChunkDto) {
    const chunkDir = path.join(this.tempDir, fileKey);
    if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);

    const chunkPath = path.join(chunkDir, `${chunkIndex}`);
    fs.writeFileSync(chunkPath, file.buffer);

    return { message: `Chunk ${chunkIndex} uploaded successfully` };
  }

  async mergeChunks(fileKey: string) {
    const chunkDir = path.join(this.tempDir, fileKey);

    if (!fs.existsSync(chunkDir)) {
      throw new HttpException('Chunks not found', HttpStatus.BAD_REQUEST);
    }

    const chunkFiles = fs.readdirSync(chunkDir).sort((a, b) => parseInt(a) - parseInt(b));
    const fileBuffer = Buffer.concat(
      chunkFiles.map((chunkFile) =>
        fs.readFileSync(path.join(chunkDir, chunkFile)),
      ),
    );
    const filename = fileKey.split('-chunk')[0]

    // This would typically upload the file to S3 or GCS
    // For the sake of example, we're just simulating the upload.
    const filePath = path.join(__dirname, '../../uploads', filename);
    fs.writeFileSync(filePath, fileBuffer);
    
    // Cleanup
    chunkFiles.forEach((chunkFile) => fs.unlinkSync(path.join(chunkDir, chunkFile)));
    fs.rmdirSync(chunkDir);


    return {
      message: `File ${fileKey} merged and uploaded successfully.`,
    };
  }
}
