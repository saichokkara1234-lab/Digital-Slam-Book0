import { useState, useEffect } from 'react';
import { BookProvider } from './context/BookContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookList } from './components/BookManager/BookList';
import { EditorLayout } from './components/Editor/EditorLayout';
import { BookPreview } from './components/Preview/BookPreview';
import { AnswerMode } from './components/AnswerMode/AnswerMode';
import { ThemePicker } from './components/ThemeSelector/ThemePicker';
import { ExportModal } from './components/Export/ExportModal';
import { AchievementsPanel } from './components/Achievements/AchievementsPanel';
import { useBook } from './context/BookContext';
import { Button } from './components/common/Button';
import { importBook as importBookUtil } from './utils/export';
import { checkAchievements } from './utils/achievements';
import './App.css';

function AppContent() {
  const { currentBook, selectBook, importBook } = useBook();
  const [view, setView] = useState('list'); // 'list', 'editor', 'preview', 'answer'
  const [previewBookId, setPreviewBookId] = useState(null);
  const [answerBookId, setAnswerBookId] = useState(null);
  const [exportBookId, setExportBookId] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Navigate to editor when a book is selected
  useEffect(() => {
    if (currentBook && view === 'list') {
      setView('editor');
    }
  }, [currentBook, view]);

  const handlePreviewBook = (bookId) => {
    setPreviewBookId(bookId);
    setView('preview');
  };

  const handleFillOutBook = (bookId) => {
    setAnswerBookId(bookId);
    setView('answer');
  };

  const handleClosePreview = () => {
    setView('list');
    setPreviewBookId(null);
  };

  const handleAnswerComplete = () => {
    // Check achievements after response is added
    setTimeout(() => {
      checkAchievements();
    }, 500);
    
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setView('list');
      setAnswerBookId(null);
    }, 2000);
  };

  const handleCancelAnswer = () => {
    setView('list');
    setAnswerBookId(null);
  };

  const handleBackToList = () => {
    selectBook(null);
    setView('list');
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title" onClick={handleBackToList} style={{ cursor: 'pointer' }}>
          📖 Digital Slam Book
        </h1>
        <div className="app-header-actions">
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowThemePicker(!showThemePicker)}
          >
            🎨 Theme
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowAchievements(true)}
          >
            🏆 Achievements
          </Button>
          {view === 'list' && (
            <Button
              variant="outline"
              size="small"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const book = await importBookUtil(file);
                      importBook(book);
                      window.location.reload();
                    } catch (error) {
                      alert('Failed to import book: ' + error.message);
                    }
                  }
                };
                input.click();
              }}
            >
              📥 Import
            </Button>
          )}
        </div>
      </div>

      {showThemePicker && (
        <div className="theme-picker-overlay" onClick={() => setShowThemePicker(false)}>
          <div className="theme-picker-popup" onClick={(e) => e.stopPropagation()}>
            <ThemePicker />
          </div>
        </div>
      )}

      <AchievementsPanel
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <main className="app-main">
        {view === 'list' && (
          <BookList onPreview={handlePreviewBook} onFillOut={handleFillOutBook} />
        )}
        {view === 'editor' && currentBook && (
          <EditorLayout onBack={handleBackToList} />
        )}
        {view === 'preview' && previewBookId && (
          <BookPreview bookId={previewBookId} onClose={handleClosePreview} />
        )}
        {view === 'answer' && answerBookId && (
          <AnswerMode
            bookId={answerBookId}
            onComplete={handleAnswerComplete}
            onCancel={handleCancelAnswer}
          />
        )}
      </main>

      {showSuccessAnimation && (
        <div className="success-animation">
          <div className="success-content">
            <div className="success-icon">✨</div>
            <h2>Response Saved!</h2>
            <p>Thank you for filling out the slam book!</p>
          </div>
        </div>
      )}

      {exportBookId && (
        <ExportModal
          isOpen={!!exportBookId}
          onClose={() => setExportBookId(null)}
          book={currentBook}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BookProvider>
        <AppContent />
      </BookProvider>
    </ThemeProvider>
  );
}

export default App;

