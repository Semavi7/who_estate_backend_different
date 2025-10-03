import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';

export class FileUploadService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      this.storage = new Storage();
    } else {
      const keyFilePath = process.env.GCS_KEYFILE_PATH;
      if (!keyFilePath) {
        // Development mode without GCS - use local file system simulation
        console.warn('GCS_KEYFILE_PATH not set - file upload will return mock URLs in development');
        this.storage = {} as Storage;
        this.bucketName = 'mock-bucket';
        return;
      }
      this.storage = new Storage({ keyFilename: keyFilePath });
    }

    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('GCS_BUCKET_NAME environment variable is required');
    }
    this.bucketName = bucketName;
  }

  async uploadFile(file: Express.Multer.File, addWatermark: boolean): Promise<string> {
    // Development mode without GCS - return mock URL
    if (process.env.NODE_ENV !== 'production' && !process.env.GCS_KEYFILE_PATH) {
      console.log('Development mode: Returning mock file URL');
      return `https://storage.googleapis.com/mock-bucket/${uuidv4()}-${file.originalname.replace(/\s/g, '_')}`;
    }

    const bucket = this.storage.bucket(this.bucketName);
    const uniqueFileName = `${uuidv4()}-${file.originalname.replace(/\s/g, '_')}`;
    const blob = bucket.file(uniqueFileName);

    try {
      let imageBuffer = file.buffer;

      if (addWatermark) {
        const image = sharp(file.buffer);
        const metadata = await image.metadata();
        const { width, height } = metadata;

        if (!width || !height) {
          throw new Error('Could not get image dimensions');
        }

        const watermarkText = "DERYA EMLAK WHO ESTATE";
        const fontSize = Math.floor(Math.sqrt(width * width + height * height) / 15);
        const angle = Math.atan2(height, width) * 180 / Math.PI;

        const svgWatermark = `
          <svg width="${width}" height="${height}">
            <style>
              .title {
                fill: rgba(255, 255, 255, 0.2);
                font-size: ${fontSize / 2}px;
                font-family: Arial, sans-serif;
                font-weight: bold;
              }
            </style>
            <text
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
              transform="rotate(-${angle} ${width / 2} ${height / 2})"
              class="title">
              ${watermarkText}
            </text>
          </svg>
        `;

        const watermarkBuffer = Buffer.from(svgWatermark);
        imageBuffer = await image.composite([{ input: watermarkBuffer, tile: false }]).toBuffer();
      }

      return new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({ resumable: false });
        
        blobStream.on('error', (err) => {
          reject(new AppError(`File upload failed: ${err.message}`, 500));
        });
        
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
          console.log(`File uploaded successfully: ${publicUrl}`);
          resolve(publicUrl);
        });
        
        blobStream.end(imageBuffer);
      });
    } catch (error) {
      console.error('Error processing image or adding watermark:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new AppError(`Image processing failed: ${errorMessage}`, 500);
    }
  }
}