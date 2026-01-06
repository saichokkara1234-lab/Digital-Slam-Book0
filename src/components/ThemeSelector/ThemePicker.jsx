import { useTheme } from '../../context/ThemeContext';
import './ThemePicker.css';

const themes = [
  { id: 'default', name: 'Default', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'colorful', name: 'Colorful', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'elegant', name: 'Elegant', preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'dark', name: 'Dark', preview: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }
];

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-picker">
      <h3 className="theme-picker-title">Select Theme</h3>
      <div className="theme-options-list">
        {themes.map((t) => (
          <div
            key={t.id}
            className={`theme-option-card ${theme === t.id ? 'active' : ''}`}
            onClick={() => setTheme(t.id)}
          >
            <div
              className="theme-preview-box"
              style={{ background: t.preview }}
            ></div>
            <span className="theme-name">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


