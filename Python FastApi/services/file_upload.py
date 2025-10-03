import os
from fastapi import HTTPException, status
from google.cloud import storage
from PIL import Image, ImageDraw, ImageFont
import io
import uuid
from typing import Optional
import magic

class FileUploadService:
    def __init__(self):
        self.bucket_name = os.getenv("GCS_BUCKET_NAME")
        if not self.bucket_name:
            raise ValueError("GCS_BUCKET_NAME environment variable is not set!")
        
        # Initialize Google Cloud Storage client
        key_file_path = os.getenv("GCS_KEYFILE_PATH")
        if key_file_path:
            self.storage_client = storage.Client.from_service_account_json(key_file_path)
        else:
            self.storage_client = storage.Client()
        
        self.bucket = self.storage_client.bucket(self.bucket_name)

    async def upload_file(
        self, 
        file_content: bytes, 
        filename: str, 
        add_watermark: bool = False
    ) -> str:
        try:
            # Validate file type
            file_type = magic.from_buffer(file_content, mime=True)
            if not file_type.startswith('image/'):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only image files are allowed"
                )

            if add_watermark:
                file_content = await self._add_watermark(file_content)

            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}-{filename.replace(' ', '_')}"
            
            # Upload to Google Cloud Storage
            blob = self.bucket.blob(unique_filename)
            blob.upload_from_string(file_content, content_type=file_type)
            
            # Make the file publicly accessible
            blob.make_public()
            
            return blob.public_url
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"File upload failed: {str(e)}"
            )

    async def _add_watermark(self, image_data: bytes) -> bytes:
        try:
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Get image dimensions
            width, height = image.size
            
            # Create watermark text
            watermark_text = "DERYA EMLAK WHO ESTATE"
            
            # Calculate font size based on image dimensions
            font_size = int((width * height) ** 0.5 / 15)
            
            # Calculate angle for diagonal placement
            angle = 45  # Simple diagonal angle
            
            # Create a transparent layer for watermark
            watermark = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            draw = ImageDraw.Draw(watermark)
            
            # Try to use a font, fallback to default if not available
            try:
                font = ImageFont.truetype("arial.ttf", font_size)
            except:
                font = ImageFont.load_default()
            
            # Calculate text position (center)
            text_bbox = draw.textbbox((0, 0), watermark_text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            
            x = (width - text_width) // 2
            y = (height - text_height) // 2
            
            # Draw watermark text with transparency
            draw.text((x, y), watermark_text, fill=(255, 255, 255, 51), font=font)
            
            # Rotate watermark
            watermark = watermark.rotate(angle, expand=True)
            
            # Composite watermark onto original image
            watermarked_image = Image.alpha_composite(
                image.convert('RGBA'), 
                watermark
            ).convert('RGB')
            
            # Convert back to bytes
            output_buffer = io.BytesIO()
            watermarked_image.save(output_buffer, format=image.format)
            
            return output_buffer.getvalue()
            
        except Exception as e:
            # If watermarking fails, return original image
            return image_data

# Create singleton instance
file_upload_service = FileUploadService()