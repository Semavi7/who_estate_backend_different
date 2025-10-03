const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

class FileUploadService {
  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
      this.storage = new Storage();
    } else {
      this.storage = new Storage({
        keyFilename: process.env.GCS_KEYFILE_PATH
      });
    }

    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('GCS_BUCKET_NAME environment variable is not set!');
    }
    this.bucketName = bucketName;
  }

  async uploadFile(file, addWatermark = false) {
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
          throw new Error('Resim boyutları alınamadı.');
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
        
        blobStream.on('error', (err) => reject(err));
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
          console.log(`Dosya başarı ile yüklendi: ${publicUrl}`);
          resolve(publicUrl);
        });
        
        blobStream.end(imageBuffer);
      });
    } catch (error) {
      console.error('Resim işlenirken veya filigran eklenirken hata oluştu', error.stack);
      throw new Error(`Resim işlenemedi: ${error.message}`);
    }
  }

  async uploadUserImage(file, addWatermark = false) {
    return this.uploadFile(file, addWatermark);
  }

  async uploadPropertyImages(files, addWatermark = true) {
    const uploadPromises = files.map(file => this.uploadFile(file, addWatermark));
    return Promise.all(uploadPromises);
  }
}

// Create singleton instance
const fileUploadService = new FileUploadService();

module.exports = {
  uploadUserImage: fileUploadService.uploadUserImage.bind(fileUploadService),
  uploadPropertyImages: fileUploadService.uploadPropertyImages.bind(fileUploadService)
};