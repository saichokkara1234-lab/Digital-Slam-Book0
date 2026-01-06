// Export a book to JSON file
export function exportBook(book) {
  const dataStr = JSON.stringify(book, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${book.title.replace(/[^a-z0-9]/gi, '_')}_slam_book.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import a book from JSON file
export function importBook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const book = JSON.parse(e.target.result);
        
        // Validate book structure
        if (!book.id || !book.title || !Array.isArray(book.pages)) {
          reject(new Error('Invalid book format'));
          return;
        }
        
        // Generate new ID to avoid conflicts
        book.id = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        book.createdAt = Date.now();
        book.updatedAt = Date.now();
        
        resolve(book);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}


