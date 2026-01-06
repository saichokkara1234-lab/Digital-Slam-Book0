import { useState } from 'react';
import { useBook } from '../../context/BookContext';
import { Button } from '../common/Button';
import { Input, Textarea } from '../common/Input';
import './QuestionBuilder.css';

const questionTypes = [
  { id: 'text', label: 'Short Text' },
  { id: 'textarea', label: 'Long Text' },
  { id: 'rating', label: 'Rating (1-5)' },
  { id: 'choice', label: 'Multiple Choice' }
];

export function QuestionBuilder({ bookId, pageId, questions, onUpdate }) {
  const { addQuestion, updateQuestion, deleteQuestion } = useBook();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'text',
    question: '',
    required: false,
    options: []
  });

  const handleAddQuestion = () => {
    if (!formData.question.trim()) return;

    const questionData = {
      ...formData,
      options: formData.type === 'choice' ? formData.options : undefined
    };

    addQuestion(bookId, pageId, questionData);
    setFormData({
      type: 'text',
      question: '',
      required: false,
      options: []
    });
  };

  const handleEdit = (question) => {
    setEditingId(question.id);
    setFormData({
      type: question.type,
      question: question.question,
      required: question.required,
      options: question.options || []
    });
  };

  const handleUpdate = () => {
    if (!formData.question.trim()) return;

    updateQuestion(bookId, pageId, editingId, {
      ...formData,
      options: formData.type === 'choice' ? formData.options : undefined
    });

    setEditingId(null);
    setFormData({
      type: 'text',
      question: '',
      required: false,
      options: []
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      type: 'text',
      question: '',
      required: false,
      options: []
    });
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(bookId, pageId, questionId);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="question-builder">
      <h3 className="question-builder-title">Questions</h3>

      <div className="question-form">
        <div className="question-form-row">
          <select
            className="question-type-select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value, options: [] })}
          >
            {questionTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
            />
            Required
          </label>
        </div>

        <Textarea
          placeholder="Enter your question..."
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          rows={2}
        />

        {formData.type === 'choice' && (
          <div className="choice-options">
            <label className="choice-options-label">Options:</label>
            {formData.options.map((option, index) => (
              <div key={index} className="choice-option-row">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => removeOption(index)}
                  disabled={formData.options.length <= 2}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" size="small" onClick={addOption}>
              + Add Option
            </Button>
          </div>
        )}

        <div className="question-form-actions">
          {editingId ? (
            <>
              <Button variant="outline" size="small" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="small" onClick={handleUpdate}>
                Update Question
              </Button>
            </>
          ) : (
            <Button variant="primary" size="small" onClick={handleAddQuestion}>
              Add Question
            </Button>
          )}
        </div>
      </div>

      <div className="questions-list">
        {questions.map((question, index) => (
          <div key={question.id} className="question-item">
            <div className="question-header">
              <span className="question-number">{index + 1}.</span>
              <span className="question-type-badge">{question.type}</span>
              {question.required && <span className="required-badge">Required</span>}
            </div>
            <div className="question-text">{question.question}</div>
            {question.options && question.options.length > 0 && (
              <div className="question-options-preview">
                Options: {question.options.join(', ')}
              </div>
            )}
            <div className="question-actions">
              <Button variant="outline" size="small" onClick={() => handleEdit(question)}>
                Edit
              </Button>
              <Button variant="danger" size="small" onClick={() => handleDelete(question.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


