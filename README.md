# Digital Slam Book Application

A customizable digital slam book application built with React. Create, customize, and manage personalized slam books with questions, themes, layouts, and multimedia content.

## Features

- 📖 **Multiple Books**: Create and manage multiple slam books
- 🎨 **Customizable Themes**: Choose from Default, Colorful, Elegant, or Dark themes
- 📐 **Flexible Layouts**: Single column, two columns, or grid layouts
- ❓ **Question Types**: Add text, textarea, rating (1-5), or multiple choice questions
- 🖼️ **Multimedia Support**: Upload images and videos (stored as base64 in localStorage)
- 📄 **Multiple Pages**: Add multiple pages to each book
- 👁️ **Preview Mode**: Preview your book before sharing
- 💾 **Export/Import**: Export books as JSON files or import previously exported books
- 🎯 **Local Storage**: All data is stored locally in your browser

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a New Slam Book

1. Click "Create New Book" on the main page
2. Enter a title for your book
3. Select a theme (Default, Colorful, Elegant, or Dark)
4. Choose a layout (Single Column, Two Columns, or Grid)
5. Click "Create Book"

### Editing a Book

1. Click "Edit" on any book card
2. Add pages using the "+ Add Page" button
3. For each page:
   - Add questions using the Question Builder
   - Upload images or videos using the Media Uploader
   - Customize the layout
4. Use the sidebar to navigate between pages

### Adding Questions

1. In the editor, scroll to the "Questions" section
2. Select a question type (Short Text, Long Text, Rating, or Multiple Choice)
3. Enter your question
4. Mark as required if needed
5. For multiple choice, add options
6. Click "Add Question"

### Adding Media

1. In the editor, scroll to the "Media" section
2. Drag and drop files or click to browse
3. Supported formats:
   - Images: JPG, PNG, GIF, WebP
   - Videos: MP4, WebM, OGG
4. Add captions to your media
5. Maximum file size: 10MB per file

### Previewing Your Book

1. From the book list, click "Preview" on any book card
2. Navigate between pages using Previous/Next buttons
3. Close preview to return to the book list

### Exporting/Importing Books

- **Export**: Click "Export" on any book card to download it as a JSON file
- **Import**: Use the "Import" button in the header to upload a previously exported book

### Changing Themes

1. Click the "Theme" button in the header
2. Select your preferred theme
3. The theme applies globally to all books

## Project Structure

```
src/
├── components/
│   ├── BookManager/      # Book list and management
│   ├── Editor/           # Editor components
│   ├── Preview/          # Preview components
│   ├── ThemeSelector/    # Theme picker
│   ├── Export/           # Export/import functionality
│   └── common/           # Reusable components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── themes/               # Theme CSS files
└── layouts/              # Layout configurations
```

## Technologies Used

- React 18
- Vite
- CSS Variables for theming
- localStorage for data persistence
- HTML5 FileReader API for media handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All data is stored in browser localStorage
- Media files are converted to base64, so large files may affect performance
- Maximum recommended file size per media item: 10MB
- Clearing browser data will delete all books

## License

This project is open source and available for personal and educational use.


