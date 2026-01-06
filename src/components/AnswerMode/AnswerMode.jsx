import { useState, useEffect } from 'react';
import { useBook } from '../../context/BookContext';
import { addResponse } from '../../utils/storage';
import { Button } from '../common/Button';
import { Input, Textarea } from '../common/Input';
import './AnswerMode.css';

export function AnswerMode({ bookId, onComplete, onCancel }) {
  const { books } = useBook();
  const book = books.find(b => b.id === bookId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responderName, setResponderName] = useState('');
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize answers object
    if (book) {
      const initialAnswers = {};
      book.pages?.forEach(page => {
        page.questions?.forEach(question => {
          initialAnswers[question.id] = '';
        });
      });
      setAnswers(initialAnswers);
    }
  }, [book]);

  if (!book) {
    return (
      <div className="answer-mode-error">
        <p>Book not found</p>
      </div>
    );
  }

  const currentPage = book.pages?.[currentPageIndex];
  const totalPages = book.pages?.length || 0;

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentPage = () => {
    if (!currentPage) return true;
    
    const pageErrors = {};
    currentPage.questions?.forEach(question => {
      if (question.required && !answers[question.id]?.toString().trim()) {
        pageErrors[question.id] = 'This question is required';
      }
    });

    setErrors(prev => ({ ...prev, ...pageErrors }));
    return Object.keys(pageErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentPage() && currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentPage()) {
      return;
    }

    // Validate all pages
    let hasErrors = false;
    const allErrors = {};
    
    book.pages?.forEach(page => {
      page.questions?.forEach(question => {
        if (question.required && !answers[question.id]?.toString().trim()) {
          allErrors[question.id] = 'This question is required';
          hasErrors = true;
        }
      });
    });

    if (hasErrors) {
      setErrors(allErrors);
      // Jump to first page with error
      const firstErrorPage = book.pages.findIndex(page =>
        page.questions?.some(q => allErrors[q.id])
      );
      if (firstErrorPage !== -1) {
        setCurrentPageIndex(firstErrorPage);
      }
      return;
    }

    // Validate name
    if (!responderName.trim()) {
      alert('Please enter your name');
      return;
    }

    // Save response
    try {
      addResponse(bookId, {
        responderName: responderName.trim(),
        answers
      });
      
      // Show success animation
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      alert('Failed to save response: ' + error.message);
    }
  };

  const getAnswerValue = (questionId) => {
    return answers[questionId] || '';
  };

  const renderQuestion = (question) => {
    const value = getAnswerValue(question.id);
    const error = errors[question.id];

    return (
      <div key={question.id} className="answer-question">
        <label className="answer-question-label">
          {question.question}
          {question.required && <span className="required">*</span>}
        </label>
        
        {question.type === 'text' && (
          <Input
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer..."
            error={error}
          />
        )}
        
        {question.type === 'textarea' && (
          <Textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer..."
            rows={4}
            error={error}
          />
        )}
        
        {question.type === 'rating' && (
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`rating-star ${star <= (parseInt(value) || 0) ? 'active' : ''}`}
                onClick={() => handleAnswerChange(question.id, star.toString())}
                onMouseEnter={(e) => {
                  if (!e.buttons) {
                    // Preview hover effect
                  }
                }}
              >
                ★
              </button>
            ))}
            {error && <span className="input-error-message">{error}</span>}
          </div>
        )}
        
        {question.type === 'choice' && question.options && (
          <div className="choice-input">
            {question.options.map((option, index) => (
              <label key={index} className="choice-option-label">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
            {error && <span className="input-error-message">{error}</span>}
          </div>
        )}
      </div>
    );
  };

  const progress = totalPages > 0 ? ((currentPageIndex + 1) / totalPages) * 100 : 0;

  return (
    <div className="answer-mode">
      <div className="answer-header">
        <h1 className="answer-title">{book.title}</h1>
        <Button variant="outline" size="small" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {currentPageIndex === 0 && (
        <div className="answer-intro">
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={responderName}
            onChange={(e) => setResponderName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="answer-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">
          Page {currentPageIndex + 1} of {totalPages}
        </span>
      </div>

      <div className="answer-content">
        {currentPage && (
          <div className="answer-page">
            <div className="answer-page-header">
              <h2>Page {currentPageIndex + 1}</h2>
            </div>

            {currentPage.media?.length > 0 && (
              <div className="answer-media">
                {currentPage.media.map((item) => (
                  <div key={item.id} className="answer-media-item">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.caption || 'Media'} className="answer-media-img" />
                    ) : (
                      <video src={item.url} controls className="answer-media-video" />
                    )}
                    {item.caption && (
                      <p className="answer-media-caption">{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="answer-questions">
              {currentPage.questions?.map(question => renderQuestion(question))}
            </div>
          </div>
        )}
      </div>

      <div className="answer-navigation">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
        >
          ← Previous
        </Button>
        
        {currentPageIndex === totalPages - 1 ? (
          <Button variant="primary" onClick={handleSubmit}>
            Submit Answers ✨
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}


