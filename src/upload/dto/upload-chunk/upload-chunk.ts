import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadChunkDto {
  @IsNotEmpty()
  @IsString()
  fileKey: string;

  @IsNotEmpty()
  @IsNumber()
  chunkIndex: number;
}
