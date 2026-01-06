import { useState } from 'react';
import { useBook } from '../../context/BookContext';
import { Button } from '../common/Button';
import './BookPreview.css';

export function BookPreview({ bookId, onClose }) {
  const { books } = useBook();
  const book = books.find(b => b.id === bookId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (!book) {
    return (
      <div className="book-preview-empty">
        <p>Book not found</p>
      </div>
    );
  }

  const currentPage = book.pages?.[currentPageIndex];
  const totalPages = book.pages?.length || 0;

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const renderQuestion = (question, index) => {
    return (
      <div key={question.id} className="preview-question">
        <label className="preview-question-label">
          {index + 1}. {question.question}
          {question.required && <span className="required">*</span>}
        </label>
        <div className="preview-question-answer">
          {question.type === 'rating' ? (
            <div className="rating-display">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= (question.answer || 0) ? 'star filled' : 'star'}
                >
                  ★
                </span>
              ))}
            </div>
          ) : question.type === 'choice' ? (
            <div className="choice-display">
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="choice-option">
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={option}
                    disabled
                    defaultChecked={question.answer === option}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          ) : (
            <div className="answer-placeholder">
              {question.type === 'textarea' ? (
                <textarea rows="4" disabled placeholder="Answer here..." />
              ) : (
                <input type="text" disabled placeholder="Answer here..." />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="book-preview">
      <div className="preview-header">
        <h1 className="preview-title">{book.title}</h1>
        <Button variant="outline" onClick={onClose}>
          Close Preview
        </Button>
      </div>

      <div className="preview-content">
        {currentPage && (
          <div className={`preview-page layout-${book.layout}`}>
            <div className="preview-page-header">
              <h2>Page {currentPageIndex + 1}</h2>
            </div>

            <div className="preview-media-section">
              {currentPage.media?.map((item) => (
                <div key={item.id} className="preview-media-item">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.caption || 'Media'} className="preview-media" />
                  ) : (
                    <video src={item.url} controls className="preview-media" />
                  )}
                  {item.caption && (
                    <p className="preview-media-caption">{item.caption}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="preview-questions-section">
              {currentPage.questions?.map((question, index) =>
                renderQuestion(question, index)
              )}
            </div>
          </div>
        )}

        {totalPages === 0 && (
          <div className="preview-empty-page">
            <p>No pages in this book</p>
          </div>
        )}
      </div>

      <div className="preview-navigation">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
        >
          ← Previous
        </Button>
        <span className="page-indicator">
          Page {currentPageIndex + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPageIndex === totalPages - 1}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}


