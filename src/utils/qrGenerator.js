// QR Code Generator using simple pattern (no external library)
// This creates a simple visual QR-like pattern that encodes book data in the URL

export function generateQRDataURI(book) {
  // Create a data URL with book information
  const bookData = {
    id: book.id,
    title: book.title,
    type: 'slambook'
  };
  
  // Encode book data as base64 in URL
  const encoded = btoa(JSON.stringify(bookData));
  const url = `${window.location.origin}${window.location.pathname}#book=${encoded}`;
  
  // For a real QR code, we'd need a library like qrcode.js
  // For now, we'll create a shareable link and a visual pattern
  return {
    url,
    data: encoded,
    // Return a simple pattern-based visual representation
    generatePattern: () => {
      try {
        // Simple checkered pattern representing data
        const size = 200;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Fill background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        
        // Create a pattern based on the encoded data
        const blockSize = 10;
        const blocksPerRow = Math.floor(size / blockSize);
        const totalBlocks = blocksPerRow * blocksPerRow;
        
        // Generate pattern from encoded data
        for (let i = 0; i < totalBlocks; i++) {
          const x = (i % blocksPerRow) * blockSize;
          const y = Math.floor(i / blocksPerRow) * blockSize;
          
          // Use encoded data to determine pattern, cycling through if needed
          const charIndex = i % encoded.length;
          const char = encoded.charCodeAt(charIndex);
          const isBlack = (char + i) % 2 === 0;
          
          ctx.fillStyle = isBlack ? '#000000' : '#FFFFFF';
          ctx.fillRect(x, y, blockSize, blockSize);
        }
        
        // Add corner markers (QR code style)
        const markerSize = blockSize * 3;
        const drawMarker = (startX, startY) => {
          ctx.fillStyle = '#000000';
          ctx.fillRect(startX, startY, markerSize, markerSize);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(startX + blockSize, startY + blockSize, blockSize, blockSize);
        };
        
        drawMarker(0, 0);
        drawMarker(size - markerSize, 0);
        drawMarker(0, size - markerSize);
        
        // Add border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size - 2, size - 2);
        
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error generating QR pattern:', error);
        // Return a simple fallback pattern
        return generateFallbackQR();
      }
    }
  };
}

export function decodeBookFromURL() {
  const hash = window.location.hash;
  const match = hash.match(/book=([^&]+)/);
  
  if (match) {
    try {
      const decoded = atob(match[1]);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode book from URL:', error);
      return null;
    }
  }
  
  return null;
}

// Generate shareable link with book data embedded
export function generateShareableLink(book) {
  const { url } = generateQRDataURI(book);
  return url;
}

// Generate fallback QR code if canvas fails
function generateFallbackQR() {
  try {
    const size = 200;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Simple checkered pattern
    const blockSize = 20;
    for (let x = 0; x < size; x += blockSize) {
      for (let y = 0; y < size; y += blockSize) {
        ctx.fillStyle = ((x + y) / blockSize) % 2 === 0 ? '#000000' : '#FFFFFF';
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    // Return a simple data URI for a 1x1 white pixel as last resort
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }
}

// Copy link to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

