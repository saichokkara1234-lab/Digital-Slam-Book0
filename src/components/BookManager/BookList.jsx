import { useState } from 'react';
import { useBook } from '../../context/BookContext';
import { BookCard } from './BookCard';
import { CreateBookModal } from './CreateBookModal';
import { Button } from '../common/Button';
import './BookList.css';

export function BookList({ onPreview, onFillOut }) {
  const { books, loading } = useBook();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="book-list-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Loading your slam books...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1 className="book-list-title">My Slam Books</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + Create New Book
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h2>No Slam Books Yet</h2>
          <p>Create your first digital slam book to get started!</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Create Your First Book
          </Button>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onPreview={onPreview} onFillOut={onFillOut} />
          ))}
        </div>
      )}

      <CreateBookModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

