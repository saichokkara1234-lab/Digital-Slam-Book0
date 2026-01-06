import { generateUUID } from './uuid';

const STORAGE_KEY = 'slamBooks';

// Get all books
export function getAllBooks() {
  try {
    const books = localStorage.getItem(STORAGE_KEY);
    return books ? JSON.parse(books) : [];
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
}

// Get a single book by ID
export function getBookById(id) {
  const books = getAllBooks();
  return books.find(book => book.id === id);
}

// Create a new book
export function createBook(bookData) {
  const books = getAllBooks();
  const newBook = {
    id: generateUUID(),
    title: bookData.title || 'Untitled Slam Book',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    theme: bookData.theme || 'default',
    layout: bookData.layout || 'single',
    pages: bookData.pages || [{
      id: generateUUID(),
      order: 0,
      questions: [],
      media: []
    }]
  };
  
  books.push(newBook);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return newBook;
}

// Update a book
export function updateBook(id, updates) {
  const books = getAllBooks();
  const index = books.findIndex(book => book.id === id);
  
  if (index === -1) {
    throw new Error(`Book with id ${id} not found`);
  }
  
  books[index] = {
    ...books[index],
    ...updates,
    id,
    updatedAt: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return books[index];
}

// Delete a book
export function deleteBook(id) {
  const books = getAllBooks();
  const filtered = books.filter(book => book.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Add a page to a book
export function addPage(bookId) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const newPage = {
    id: generateUUID(),
    order: book.pages.length,
    questions: [],
    media: []
  };
  
  const updatedBook = updateBook(bookId, {
    pages: [...book.pages, newPage]
  });
  
  return newPage;
}

// Update a page
export function updatePage(bookId, pageId, updates) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const updatedPages = book.pages.map(page =>
    page.id === pageId ? { ...page, ...updates } : page
  );
  
  return updateBook(bookId, { pages: updatedPages });
}

// Delete a page
export function deletePage(bookId, pageId) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const filteredPages = book.pages
    .filter(page => page.id !== pageId)
    .map((page, index) => ({ ...page, order: index }));
  
  return updateBook(bookId, { pages: filteredPages });
}

// Add a question to a page
export function addQuestion(bookId, pageId, question) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const page = book.pages.find(p => p.id === pageId);
  if (!page) return null;
  
  const newQuestion = {
    id: generateUUID(),
    type: question.type || 'text',
    question: question.question || '',
    answer: question.answer || '',
    required: question.required || false,
    ...(question.type === 'choice' && { options: question.options || [] })
  };
  
  const updatedQuestions = [...page.questions, newQuestion];
  
  return updatePage(bookId, pageId, { questions: updatedQuestions });
}

// Update a question
export function updateQuestion(bookId, pageId, questionId, updates) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const page = book.pages.find(p => p.id === pageId);
  if (!page) return null;
  
  const updatedQuestions = page.questions.map(q =>
    q.id === questionId ? { ...q, ...updates } : q
  );
  
  return updatePage(bookId, pageId, { questions: updatedQuestions });
}

// Delete a question
export function deleteQuestion(bookId, pageId, questionId) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const page = book.pages.find(p => p.id === pageId);
  if (!page) return null;
  
  const updatedQuestions = page.questions.filter(q => q.id !== questionId);
  
  return updatePage(bookId, pageId, { questions: updatedQuestions });
}

// Add media to a page
export function addMedia(bookId, pageId, media) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const page = book.pages.find(p => p.id === pageId);
  if (!page) return null;
  
  const newMedia = {
    id: generateUUID(),
    type: media.type,
    url: media.url,
    caption: media.caption || ''
  };
  
  const updatedMedia = [...page.media, newMedia];
  
  return updatePage(bookId, pageId, { media: updatedMedia });
}

// Delete media
export function deleteMedia(bookId, pageId, mediaId) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  const page = book.pages.find(p => p.id === pageId);
  if (!page) return null;
  
  const updatedMedia = page.media.filter(m => m.id !== mediaId);
  
  return updatePage(bookId, pageId, { media: updatedMedia });
}

// RESPONSE/FILL-OUT FUNCTIONS
// Add a response to a book
export function addResponse(bookId, responseData) {
  const book = getBookById(bookId);
  if (!book) return null;
  
  // Initialize responses array if it doesn't exist
  if (!book.responses) {
    book.responses = [];
  }
  
  const newResponse = {
    id: generateUUID(),
    responderName: responseData.responderName || 'Anonymous',
    createdAt: Date.now(),
    answers: responseData.answers || {}
  };
  
  book.responses.push(newResponse);
  
  const updated = updateBook(bookId, { responses: book.responses });
  return newResponse;
}

// Get all responses for a book
export function getBookResponses(bookId) {
  const book = getBookById(bookId);
  return book?.responses || [];
}

// Delete a response
export function deleteResponse(bookId, responseId) {
  const book = getBookById(bookId);
  if (!book || !book.responses) return null;
  
  book.responses = book.responses.filter(r => r.id !== responseId);
  return updateBook(bookId, { responses: book.responses });
}

