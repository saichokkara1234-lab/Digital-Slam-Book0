import { useBook } from '../../context/BookContext';
import { QuestionBuilder } from './QuestionBuilder';
import { MediaUploader } from './MediaUploader';
import { LayoutCustomizer } from './LayoutCustomizer';
import { Button } from '../common/Button';
import './PageEditor.css';

export function PageEditor({ bookId, page, bookLayout }) {
  const { addPage, deletePage, updatePage } = useBook();

  if (!page) {
    return (
      <div className="page-editor-empty">
        <p>Select a page to edit</p>
      </div>
    );
  }

  const handleDeletePage = () => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      deletePage(bookId, page.id);
    }
  };

  return (
    <div className="page-editor">
      <div className="page-editor-header">
        <h2 className="page-editor-title">Page {page.order + 1}</h2>
        <Button variant="danger" size="small" onClick={handleDeletePage}>
          Delete Page
        </Button>
      </div>

      <div className="page-editor-content">
        <div className="page-editor-main">
          <QuestionBuilder
            bookId={bookId}
            pageId={page.id}
            questions={page.questions || []}
          />
          <MediaUploader
            bookId={bookId}
            pageId={page.id}
            media={page.media || []}
          />
        </div>

        <div className="page-editor-sidebar">
          <LayoutCustomizer
            bookId={bookId}
            currentLayout={bookLayout}
          />
        </div>
      </div>
    </div>
  );
}

