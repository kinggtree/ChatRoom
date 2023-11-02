import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';

function resizeImage(file, callback) {
  const maxWidth=800;
  const maxHeight=800;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height *= maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width *= maxHeight / height));
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        callback(blob);
      }, file.type);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


function UploadImage({ open, handleOpen, _id, type }) {
  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileInputChange = (e) => {
    handleChange(e);
  };

  const handleChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const file = files[0];
    if (!file) return;

    // 调整图片尺寸
    resizeImage(file, (blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        handleOpen(true);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleUpload = async () => {
    try {
      const croppedImage = cropper.getCroppedCanvas().toDataURL('image/png');
      const blob = dataURLtoBlob(croppedImage);
      const formData = new FormData();
      formData.append('image', blob);
      formData.append('_id', _id);
      formData.append('type', type)
  
      const response = await axios.post('/api/uploadAvatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if(response.data.status===200){
        alert("更改头像成功！");
        handleOpen(false);
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };
  
  // Helper function to convert dataURL to Blob
  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }


  return (
    <div>
      <input
        type="file"
        onChange={handleFileInputChange}
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <Button startIcon={<EditIcon />} onClick={() => fileInputRef.current.click()}>
        更改头像
      </Button>
      <Dialog open={open} onClose={() => handleOpen(false)}>
        <DialogTitle>裁切</DialogTitle>
        <DialogContent>
          <Cropper
            style={{ height: 400, width: "100%" }}
            aspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOpen(false)}>取消</Button>
          <Button onClick={handleUpload}>确认</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function AvatarUploader({ type, _id }) {
  const [open, setOpen] = useState(false);

  const handleOpen = (value) => {
    setOpen(value);
  };

  return (
    <div>
      <UploadImage open={open} handleOpen={handleOpen} _id={_id} type={type} />
    </div>
  );
}

export default AvatarUploader;
