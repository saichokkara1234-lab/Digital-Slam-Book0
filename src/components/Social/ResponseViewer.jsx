import { useState } from 'react';
import { useBook } from '../../context/BookContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import './ResponseViewer.css';

export function ResponseViewer({ bookId }) {
  const { getBookResponses, deleteResponse } = useBook();
  const [selectedResponse, setSelectedResponse] = useState(null);
  const responses = getBookResponses(bookId);
  const { books } = useBook();
  const book = books.find(b => b.id === bookId);

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
  };

  const handleDeleteResponse = (responseId) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      deleteResponse(bookId, responseId);
      if (selectedResponse?.id === responseId) {
        setSelectedResponse(null);
      }
    }
  };

  if (!book) return null;

  const getAnswerForQuestion = (questionId) => {
    return selectedResponse?.answers?.[questionId] || '';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="response-viewer">
      <div className="response-viewer-header">
        <h3>Responses ({responses.length})</h3>
        {responses.length === 0 && (
          <p className="no-responses">No responses yet. Share your book for others to fill it out!</p>
        )}
      </div>

      {responses.length > 0 && (
        <>
          <div className="responses-list">
            {responses.map((response) => (
              <div key={response.id} className="response-card">
                <div className="response-card-header">
                  <div className="response-avatar">
                    {response.responderName.charAt(0).toUpperCase()}
                  </div>
                  <div className="response-info">
                    <div className="response-name">{response.responderName}</div>
                    <div className="response-date">{formatDate(response.createdAt)}</div>
                  </div>
                  <div className="response-actions">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleViewResponse(response)}
                    >
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteResponse(response.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal
            isOpen={!!selectedResponse}
            onClose={() => setSelectedResponse(null)}
            title={`Response by ${selectedResponse?.responderName}`}
            size="large"
          >
            {selectedResponse && (
              <div className="response-detail">
                {book.pages?.map((page, pageIndex) => (
                  <div key={page.id} className="response-page">
                    <h4 className="response-page-title">Page {pageIndex + 1}</h4>
                    <div className="response-questions">
                      {page.questions?.map((question) => {
                        const answer = getAnswerForQuestion(question.id);
                        return (
                          <div key={question.id} className="response-question-item">
                            <div className="response-question-label">{question.question}</div>
                            <div className="response-answer">
                              {question.type === 'rating' ? (
                                <div className="rating-display">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`star ${star <= (parseInt(answer) || 0) ? 'filled' : ''}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="answer-text">{answer || '(No answer provided)'}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}


