import { useState, useEffect } from 'react';
import { useBook } from '../../context/BookContext';
import { PageEditor } from './PageEditor';
import { ResponseViewer } from '../Social/ResponseViewer';
import { Button } from '../common/Button';
import './EditorLayout.css';

export function EditorLayout({ onBack }) {
  const { currentBook, addPage, getBookResponses } = useBook();
  const [selectedPageId, setSelectedPageId] = useState(
    currentBook?.pages?.[0]?.id || null
  );
  const [showResponses, setShowResponses] = useState(false);

  if (!currentBook) {
    return (
      <div className="editor-layout-empty">
        <div className="empty-content">
          <h2>No Book Selected</h2>
          <p>Please select a book from the list to start editing.</p>
        </div>
      </div>
    );
  }

  const selectedPage = currentBook.pages?.find(p => p.id === selectedPageId) || currentBook.pages?.[0];

  const handleAddPage = () => {
    const newPage = addPage(currentBook.id);
    if (newPage) {
      setSelectedPageId(newPage.id);
    }
  };

  const handlePageSelect = (pageId) => {
    setSelectedPageId(pageId);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="editor-layout">
      <div className="editor-header">
        <div className="editor-header-left">
          <Button variant="outline" size="small" onClick={handleBack}>
            ← Back to Books
          </Button>
          <h1 className="editor-title">{currentBook.title}</h1>
        </div>
        <div className="editor-header-actions">
          {getBookResponses?.(currentBook.id)?.length > 0 && (
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowResponses(!showResponses)}
            >
              👥 Responses ({getBookResponses(currentBook.id).length})
            </Button>
          )}
          <Button variant="primary" onClick={handleAddPage}>
            + Add Page
          </Button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-sidebar">
          <h3 className="sidebar-title">Pages</h3>
          <div className="pages-list">
            {currentBook.pages?.map((page, index) => (
              <div
                key={page.id}
                className={`page-item ${selectedPageId === page.id ? 'active' : ''}`}
                onClick={() => handlePageSelect(page.id)}
              >
                <span className="page-number">{index + 1}</span>
                <span className="page-label">Page {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-main">
          {showResponses ? (
            <div className="responses-view-container">
              <ResponseViewer bookId={currentBook.id} />
            </div>
          ) : (
            <PageEditor bookId={currentBook.id} page={selectedPage} bookLayout={currentBook.layout} />
          )}
        </div>
      </div>
    </div>
  );
}

