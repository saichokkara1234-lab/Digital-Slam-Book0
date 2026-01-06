import { useBook } from '../../context/BookContext';
import { layouts } from '../../layouts/layouts';
import './LayoutCustomizer.css';

export function LayoutCustomizer({ bookId, currentLayout }) {
  const { updateBook } = useBook();

  const handleLayoutChange = (layoutId) => {
    updateBook(bookId, { layout: layoutId });
  };

  return (
    <div className="layout-customizer">
      <h3 className="layout-customizer-title">Layout</h3>
      <div className="layout-options-grid">
        {Object.values(layouts).map((layout) => (
          <div
            key={layout.id}
            className={`layout-preview-card ${currentLayout === layout.id ? 'active' : ''}`}
            onClick={() => handleLayoutChange(layout.id)}
          >
            <div className={`layout-preview ${layout.className}`}>
              {layout.id === 'single' && (
                <div className="preview-block single-preview"></div>
              )}
              {layout.id === 'twoColumns' && (
                <>
                  <div className="preview-block"></div>
                  <div className="preview-block"></div>
                </>
              )}
              {layout.id === 'grid' && (
                <>
                  <div className="preview-block"></div>
                  <div className="preview-block"></div>
                  <div className="preview-block"></div>
                  <div className="preview-block"></div>
                </>
              )}
            </div>
            <div className="layout-preview-label">
              <span className="layout-name">{layout.name}</span>
              <span className="layout-desc">{layout.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


