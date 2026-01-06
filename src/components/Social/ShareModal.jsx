import { useState, useEffect } from 'react';
import { generateQRDataURI, generateShareableLink, copyToClipboard } from '../../utils/qrGenerator';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import './ShareModal.css';

export function ShareModal({ isOpen, onClose, book }) {
  const [qrImage, setQrImage] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (book && isOpen && !isGenerating) {
      setIsGenerating(true);
      try {
        // Set link immediately
        const link = generateShareableLink(book);
        setShareLink(link);
        
        // Generate QR pattern asynchronously to avoid blocking
        requestAnimationFrame(() => {
          setTimeout(() => {
            try {
              const qrData = generateQRDataURI(book);
              const pattern = qrData.generatePattern();
              setQrImage(pattern);
              setIsGenerating(false);
            } catch (error) {
              console.error('Error generating QR code:', error);
              setQrImage(null);
              setIsGenerating(false);
            }
          }, 50);
        });
      } catch (error) {
        console.error('Error in share modal:', error);
        // Fallback link
        setShareLink(window.location.href);
        setQrImage(null);
        setIsGenerating(false);
      }
    } else if (!isOpen) {
      // Reset state when closed
      setQrImage(null);
      setShareLink('');
      setCopied(false);
      setIsGenerating(false);
    }
  }, [book, isOpen]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (qrImage) {
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = `${book?.title || 'book'}_qr.png`;
      link.click();
    }
  };

  if (!book) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Slam Book" size="medium">
      <div className="share-modal-content">
        <div className="share-section">
          <h3 className="share-section-title">Shareable Link</h3>
          <p className="share-section-desc">
            Copy this link to share your book with others. They can fill it out directly!
          </p>
          <div className="share-link-container">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="share-link-input"
            />
            <Button
              variant={copied ? 'primary' : 'outline'}
              onClick={handleCopyLink}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>

        <div className="share-divider"></div>

        <div className="share-section">
          <h3 className="share-section-title">QR Code</h3>
          <p className="share-section-desc">
            Scan this QR code to open and fill out the book
          </p>
          {qrImage ? (
            <div className="qr-code-container">
              <img src={qrImage} alt="QR Code" className="qr-code-image" onLoad={() => setIsGenerating(false)} />
              <Button variant="outline" onClick={handleDownloadQR}>
                Download QR Code
              </Button>
            </div>
          ) : isGenerating ? (
            <div className="qr-code-loading">
              <div className="loading-spinner"></div>
              <p>Generating QR code...</p>
            </div>
          ) : (
            <div className="qr-code-loading">
              <p>QR code will appear here</p>
            </div>
          )}
        </div>

        <div className="share-note">
          <p>💡 Tip: Export the book as JSON file to share via email or messaging apps!</p>
        </div>
      </div>
    </Modal>
  );
}

