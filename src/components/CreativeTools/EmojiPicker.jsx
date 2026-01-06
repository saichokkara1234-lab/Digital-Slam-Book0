import { useState } from 'react';
import './EmojiPicker.css';

const emojiCategories = {
  'Faces': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  'Objects': ['📖', '📚', '✏️', '✒️', '🖊️', '🖋️', '📝', '📄', '📃', '📑', '🎨', '🖼️', '🎭', '🎪', '🎬'],
  'Stars': ['⭐', '🌟', '✨', '💫', '🔥', '💯', '🎉', '🎊', '🏆', '🥇', '🎖️'],
  'Nature': ['🌺', '🌸', '🌼', '🌻', '🌷', '🌹', '🌵', '🌴', '🌳', '🌲', '🌈', '☀️', '🌙', '⭐'],
};

export function EmojiPicker({ onSelect, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('Faces');

  const handleEmojiClick = (emoji) => {
    if (onSelect) {
      onSelect(emoji);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-header">
        <div className="emoji-categories">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              className={`emoji-category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="emoji-grid">
        {emojiCategories[selectedCategory]?.map((emoji, index) => (
          <button
            key={index}
            className="emoji-item"
            onClick={() => handleEmojiClick(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}


