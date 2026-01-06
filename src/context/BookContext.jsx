import { createContext, useContext, useState, useEffect } from 'react';
import * as storage from '../utils/storage';

const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load books from localStorage on mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setLoading(true);
    try {
      const loadedBooks = storage.getAllBooks();
      setBooks(loadedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBook = (bookData) => {
    const newBook = storage.createBook(bookData);
    setBooks(prev => [...prev, newBook]);
    return newBook;
  };

  const updateBook = (id, updates) => {
    const updated = storage.updateBook(id, updates);
    setBooks(prev => prev.map(b => b.id === id ? updated : b));
    if (currentBook?.id === id) {
      setCurrentBook(updated);
    }
    return updated;
  };

  const deleteBook = (id) => {
    storage.deleteBook(id);
    setBooks(prev => prev.filter(b => b.id !== id));
    if (currentBook?.id === id) {
      setCurrentBook(null);
    }
  };

  const selectBook = (id) => {
    if (id === null) {
      setCurrentBook(null);
      return null;
    }
    const book = storage.getBookById(id);
    setCurrentBook(book);
    return book;
  };

  const addPage = (bookId) => {
    const page = storage.addPage(bookId);
    if (page) {
      const updated = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? updated : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(updated);
      }
    }
    return page;
  };

  const updatePage = (bookId, pageId, updates) => {
    const updated = storage.updatePage(bookId, pageId, updates);
    if (updated) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return updated;
  };

  const deletePage = (bookId, pageId) => {
    const deleted = storage.deletePage(bookId, pageId);
    if (deleted) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return deleted;
  };

  const addQuestion = (bookId, pageId, question) => {
    const updated = storage.addQuestion(bookId, pageId, question);
    if (updated) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return updated;
  };

  const updateQuestion = (bookId, pageId, questionId, updates) => {
    const updated = storage.updateQuestion(bookId, pageId, questionId, updates);
    if (updated) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return updated;
  };

  const deleteQuestion = (bookId, pageId, questionId) => {
    const deleted = storage.deleteQuestion(bookId, pageId, questionId);
    if (deleted) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return deleted;
  };

  const addMedia = (bookId, pageId, media) => {
    const updated = storage.addMedia(bookId, pageId, media);
    if (updated) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return updated;
  };

  const deleteMedia = (bookId, pageId, mediaId) => {
    const deleted = storage.deleteMedia(bookId, pageId, mediaId);
    if (deleted) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return deleted;
  };

  const importBook = (book) => {
    // Generate new ID
    book.id = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    book.createdAt = Date.now();
    book.updatedAt = Date.now();
    
    const books = storage.getAllBooks();
    books.push(book);
    localStorage.setItem('slamBooks', JSON.stringify(books));
    loadBooks();
    return book;
  };

  const addResponse = (bookId, responseData) => {
    const response = storage.addResponse(bookId, responseData);
    if (response) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return response;
  };

  const getBookResponses = (bookId) => {
    return storage.getBookResponses(bookId);
  };

  const deleteResponse = (bookId, responseId) => {
    const deleted = storage.deleteResponse(bookId, responseId);
    if (deleted) {
      const book = storage.getBookById(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
    }
    return deleted;
  };

  return (
    <BookContext.Provider
      value={{
        books,
        currentBook,
        loading,
        createBook,
        updateBook,
        deleteBook,
        selectBook,
        addPage,
        updatePage,
        deletePage,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addMedia,
        deleteMedia,
        importBook,
        loadBooks,
        addResponse,
        getBookResponses: (bookId) => {
          return storage.getBookResponses(bookId);
        },
        deleteResponse
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
}

