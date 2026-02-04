import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';
import * as tmp from 'tmp';
import { writeFile, readFile, unlink } from 'fs/promises';
import { supabase } from '../supabase.service';
import mime from 'mime';

@Injectable()
export class FileUploadService {

  private readonly bucket = 'media';

  private getUploadKeyAndMime(userId: string, originalName: string): { key: string, contentType: string } {
    const extension = mime.extension(originalName) || 'bin';
    const contentType = mime.lookup(originalName) || 'application/octet-stream';
    const key = `uploads/${userId}/${Date.now()}.${extension}`;
    return { key, contentType };
  }

  private async uploadToSupabase(key: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const { data, error } = await supabase.storage.from(this.bucket).upload(key, fileBuffer, {
      contentType,
      upsert: true,
    });

    if (error) throw new Error('Upload failed: ' + error.message);

    return supabase.storage.from(this.bucket).getPublicUrl(data.path).data.publicUrl;
  }

  async compressImageAndUpload(fileBuffer: Buffer, userId: string, originalName: string): Promise<string> {
    const compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 1024 })
      .jpeg({ quality: 80 })
      .toBuffer();

    const { key } = this.getUploadKeyAndMime(userId, originalName);
    // Override contentType to image/jpeg since sharp converts to jpeg
    return this.uploadToSupabase(key, compressedBuffer, 'image/jpeg');
  }

  async compressAudioBufferAndUpload(fileBuffer: Buffer, userId: string, originalName: string): Promise<string> {
    const tmpInput = tmp.tmpNameSync({ postfix: '.mp3' });
    const tmpOutput = tmp.tmpNameSync({ postfix: '.mp3' });

    await writeFile(tmpInput, fileBuffer);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(tmpInput)
        .audioBitrate('128k')
        .toFormat('mp3')
        .on('end', () => resolve())
        .on('error', reject)
        .save(tmpOutput);
    });

    const outputBuffer = await readFile(tmpOutput);
    await unlink(tmpInput);
    await unlink(tmpOutput);

    const { key } = this.getUploadKeyAndMime(userId, originalName);
    // Override contentType to audio/mpeg since ffmpeg converts to mp3
    return this.uploadToSupabase(key, outputBuffer, 'audio/mpeg');
  }

  async compressVideoBufferAndUpload(fileBuffer: Buffer, userId: string, originalName: string): Promise<string> {
    const tmpInput = tmp.tmpNameSync({ postfix: '.mp4' });
    const tmpOutput = tmp.tmpNameSync({ postfix: '.mp4' });

    await writeFile(tmpInput, fileBuffer);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(tmpInput)
        .videoCodec('libx264')
        .size('1280x720')
        .outputOptions('-preset', 'fast')
        .on('end', () => resolve())
        .on('error', reject)
        .save(tmpOutput);
    });

    const outputBuffer = await readFile(tmpOutput);
    await unlink(tmpInput);
    await unlink(tmpOutput);

    const { key, contentType } = this.getUploadKeyAndMime(userId, originalName);
    // Override contentType to video/mp4 since ffmpeg converts to mp4
    return this.uploadToSupabase(key, outputBuffer, contentType);
  }

  async uploadFileDirectly(fileBuffer: Buffer, userId: string, originalName: string): Promise<string> {
    const { key, contentType } = this.getUploadKeyAndMime(userId, originalName);
    return this.uploadToSupabase(key, fileBuffer, contentType);
  }
}
