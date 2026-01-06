import { useState, useRef } from 'react';
import { useBook } from '../../context/BookContext';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import './MediaUploader.css';

export function MediaUploader({ bookId, pageId, media }) {
  const { addMedia, deleteMedia } = useBook();
  const { handleFileUpload, uploading, error } = useMediaUpload();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
    e.target.value = '';
  };

  const processFiles = async (files) => {
    for (const file of files) {
      try {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
          alert(`${file.name} is not a supported file type. Please use images or videos.`);
          continue;
        }

        const type = isImage ? 'image' : 'video';
        const result = await handleFileUpload(file, type);

        addMedia(bookId, pageId, {
          type: result.type,
          url: result.url,
          caption: ''
        });
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  };

  const handleDelete = (mediaId) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      deleteMedia(bookId, pageId, mediaId);
    }
  };

  const handleCaptionChange = (mediaId, caption) => {
    const mediaItem = media.find(m => m.id === mediaId);
    if (mediaItem) {
      deleteMedia(bookId, pageId, mediaId);
      addMedia(bookId, pageId, {
        ...mediaItem,
        caption
      });
    }
  };

  return (
    <div className="media-uploader">
      <h3 className="media-uploader-title">Media</h3>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          {uploading ? (
            <div className="upload-loading">Uploading...</div>
          ) : (
            <>
              <div className="upload-icon">📎</div>
              <p className="upload-text">
                Drag and drop files here or click to browse
              </p>
              <p className="upload-hint">Images and videos (max 10MB each)</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="upload-error">{error}</div>
      )}

      {media.length > 0 && (
        <div className="media-grid">
          {media.map((item) => (
            <div key={item.id} className="media-item">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.caption || 'Uploaded image'} className="media-preview" />
              ) : (
                <video src={item.url} controls className="media-preview" />
              )}
              <div className="media-caption">
                <Input
                  placeholder="Add caption..."
                  value={item.caption || ''}
                  onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                  size="small"
                />
              </div>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleDelete(item.id)}
                className="media-delete-btn"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


