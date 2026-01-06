import { useBook } from '../../context/BookContext';
import { exportBook } from '../../utils/export';
import { Button } from '../common/Button';
import { useState } from 'react';
import { ShareModal } from '../Social/ShareModal';
import './BookCard.css';

export function BookCard({ book, onPreview, onFillOut }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const { selectBook, deleteBook, getBookResponses } = useBook();

  const handleEdit = () => {
    selectBook(book.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      deleteBook(book.id);
    }
  };

  const handleExport = () => {
    exportBook(book);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(book.id);
    }
  };

  const handleFillOut = () => {
    if (onFillOut) {
      onFillOut(book.id);
    }
  };

  const responseCount = getBookResponses?.(book.id)?.length || 0;

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="book-card">
      <div className="book-card-header">
        <h3 className="book-card-title">{book.title}</h3>
        <span className="book-card-date">
          {formatDate(book.createdAt)}
        </span>
      </div>
      
      <div className="book-card-info">
        <div className="book-card-stat">
          <span className="stat-label">Pages:</span>
          <span className="stat-value">{book.pages?.length || 0}</span>
        </div>
        <div className="book-card-stat">
          <span className="stat-label">Theme:</span>
          <span className="stat-value">{book.theme}</span>
        </div>
        {responseCount > 0 && (
          <div className="book-card-stat">
            <span className="stat-label">Responses:</span>
            <span className="stat-value">{responseCount}</span>
          </div>
        )}
      </div>

      <div className="book-card-actions">
        <Button variant="primary" size="small" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="outline" size="small" onClick={handleFillOut} className="fill-out-btn">
          ✏️ Fill Out
        </Button>
        <Button variant="outline" size="small" onClick={handlePreview}>
          Preview
        </Button>
        <Button variant="outline" size="small" onClick={() => setShowShareModal(true)}>
          🔗 Share
        </Button>
        <Button variant="outline" size="small" onClick={handleExport}>
          Export
        </Button>
        <Button variant="danger" size="small" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        book={book}
      />
    </div>
  );
}

