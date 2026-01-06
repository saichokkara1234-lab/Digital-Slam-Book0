import { useState } from 'react';
import { useBook } from '../../context/BookContext';
import { exportBook, importBook } from '../../utils/export';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import './ExportModal.css';

export function ExportModal({ isOpen, onClose, book }) {
  const { importBook: importBookToStorage } = useBook();
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const handleExport = () => {
    if (book) {
      exportBook(book);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportError('');

    try {
      const importedBook = await importBook(file);
      importBookToStorage(importedBook);
      onClose();
      window.location.reload(); // Refresh to show new book
    } catch (error) {
      setImportError(error.message || 'Failed to import book');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export / Import Book" size="medium">
      <div className="export-modal-content">
        <div className="export-section">
          <h3 className="section-title">Export Book</h3>
          <p className="section-description">
            Download this book as a JSON file. You can share it or import it later.
          </p>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={!book}
          >
            Export {book?.title || 'Book'}
          </Button>
        </div>

        <div className="divider"></div>

        <div className="import-section">
          <h3 className="section-title">Import Book</h3>
          <p className="section-description">
            Upload a JSON file to import a previously exported book.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            id="import-file-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="import-file-input" style={{ display: 'inline-block' }}>
            <span
              className={`btn btn-outline btn-small ${importing ? 'disabled' : ''}`}
              style={{ cursor: importing ? 'not-allowed' : 'pointer', display: 'inline-flex' }}
            >
              {importing ? 'Importing...' : 'Choose File to Import'}
            </span>
          </label>
          {importError && (
            <div className="import-error">{importError}</div>
          )}
        </div>
      </div>
    </Modal>
  );
}

