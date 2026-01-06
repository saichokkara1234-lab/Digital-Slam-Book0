import { useState } from 'react';
import { useBook } from '../../context/BookContext';
import { useTheme } from '../../context/ThemeContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { layouts } from '../../layouts/layouts';
import './CreateBookModal.css';

const themes = [
  { id: 'default', name: 'Default' },
  { id: 'colorful', name: 'Colorful' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'dark', name: 'Dark' }
];

export function CreateBookModal({ isOpen, onClose }) {
  const { createBook, selectBook } = useBook();
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('default');
  const [layout, setLayout] = useState('single');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a book title');
      return;
    }

    const newBook = createBook({
      title: title.trim(),
      theme,
      layout
    });

    selectBook(newBook.id);
    setTitle('');
    setTheme('default');
    setLayout('single');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Slam Book" size="medium">
      <form onSubmit={handleSubmit} className="create-book-form">
        <Input
          label="Book Title"
          placeholder="Enter book title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          error={error}
          required
          autoFocus
        />

        <div className="form-section">
          <label className="form-label">Theme</label>
          <div className="theme-options">
            {themes.map((t) => (
              <div
                key={t.id}
                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <div className={`theme-preview theme-${t.id}`}></div>
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Layout</label>
          <div className="layout-options">
            {Object.values(layouts).map((l) => (
              <div
                key={l.id}
                className={`layout-option ${layout === l.id ? 'active' : ''}`}
                onClick={() => setLayout(l.id)}
              >
                <span className="layout-name">{l.name}</span>
                <span className="layout-desc">{l.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Book
          </Button>
        </div>
      </form>
    </Modal>
  );
}


