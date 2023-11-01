import React, { useState } from 'react';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function UploadAvatar({ uploadConfig }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);

  const onImageLoaded = (image) => {
    // 设置初始裁切区域
    setCrop({
      unit: '%',
      width: 50,
      aspect: 1 / 1,
    });
  };

  const onCropComplete = async (crop) => {
    if (selectedImage && crop.width && crop.height) {
      // 创建裁切后图片的URL
      const croppedImageUrl = await getCroppedImg(
        selectedImage,
        crop,
        'croppedImage.jpeg'
      );
      setCroppedImage(croppedImageUrl);
    }
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setSelectedImage(reader.result)
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const uploadImage = () => {
    if (!uploadConfig || !uploadConfig.apiUrl) {
      console.error('Missing upload configuration');
      return;
    }

    const formData = new FormData();
    formData.append('file', croppedImage);
    formData.append('_id', uploadConfig._id);

    // Add other necessary parameters from uploadConfig to formData if needed
    if (uploadConfig.otherParams) {
      Object.keys(uploadConfig.otherParams).forEach(key => {
        formData.append(key, uploadConfig.otherParams[key]);
      });
    }

    axios.post(uploadConfig.apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log('Image uploaded successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error uploading image:', error);
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onImageChange} />
      {selectedImage && (
        <ReactCrop
          src={selectedImage}
          crop={crop}
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={(newCrop) => setCrop(newCrop)}
        />
      )}
      {croppedImage && (
        <div>
          <img alt="Cropped" style={{ maxWidth: '100%' }} src={croppedImage} />
          <button onClick={uploadImage}>Upload Image</button>
        </div>
      )}
    </div>
  );
}

// Convert the cropped region to a Blob and return a URL to this Blob
function getCroppedImg(imageSrc, crop, fileName) {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  // New lines to be added
  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      blob.name = fileName;
      const croppedImageUrl = URL.createObjectURL(blob);
      resolve(croppedImageUrl);
    }, 'image/jpeg');
  });
}

export default UploadAvatar;

/*
使用方法
<ImageUploadAndCrop
  uploadConfig={{
    apiUrl: '/upload-url',
    _id: '12345',
    otherParams: {
      param1: 'value1',
      param2: 'value2',
      // ... other parameters
    },
  }}
/>
*/
