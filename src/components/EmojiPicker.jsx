import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, Smile, Heart, ThumbsUp, Fire, Cry, Angry } from 'lucide-react';

const EMOJI_CATEGORIES = {
  recent: { name: 'Recently Used', icon: Clock, emojis: [] },
  smileys: {
    name: 'Smileys & Emotion',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😔', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢',
      '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
      '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶',
      '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱',
      '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷',
      '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩'
    ]
  },
  people: {
    name: 'People & Body',
    icon: '👋',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
      '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
      '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
      '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'
    ]
  },
  nature: {
    name: 'Animals & Nature',
    icon: '🌿',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
      '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
      '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕',
      '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳',
      '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛'
    ]
  },
  food: {
    name: 'Food & Drink',
    icon: '🍎',
    emojis: [
      '🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈',
      '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦',
      '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔',
      '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈',
      '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟',
      '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘'
    ]
  },
  activities: {
    name: 'Activities',
    icon: '⚽',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
      '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️',
      '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️‍♂️', '🤼‍♀️', '🤼‍♂️', '🤸‍♀️',
      '🤸‍♂️', '⛹️‍♀️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾‍♂️', '🏌️‍♀️', '🏌️‍♂️', '🏇', '🧘‍♀️'
    ]
  },
  travel: {
    name: 'Travel & Places',
    icon: '🚗',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
      '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼',
      '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️',
      '🚢', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚁', '🚂', '🚃', '🚄',
      '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌'
    ]
  },
  objects: {
    name: 'Objects',
    icon: '📱',
    emojis: [
      '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️',
      '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '📽️', '🎞️',
      '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭',
      '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡',
      '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷'
    ]
  },
  symbols: {
    name: 'Symbols',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
      '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
      '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳'
    ]
  },
  flags: {
    name: 'Flags',
    icon: '🏁',
    emojis: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇱',
      '🇩🇿', '🇦🇩', '🇦🇴', '🇦🇮', '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺',
      '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾', '🇧🇪', '🇧🇿', '🇧🇯',
      '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇻🇬', '🇧🇳', '🇧🇬', '🇧🇫'
    ]
  }
};

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

const EmojiPicker = ({ isOpen, onClose, onEmojiSelect, position = 'bottom-left' }) => {
  const [activeCategory, setActiveCategory] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState([]);
  const pickerRef = useRef(null);

  useEffect(() => {
    // Load recent emojis from localStorage
    const stored = localStorage.getItem('recentEmojis');
    if (stored) {
      setRecentEmojis(JSON.parse(stored));
      EMOJI_CATEGORIES.recent.emojis = JSON.parse(stored);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const addToRecent = (emoji) => {
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
    setRecentEmojis(newRecent);
    EMOJI_CATEGORIES.recent.emojis = newRecent;
    localStorage.setItem('recentEmojis', JSON.stringify(newRecent));
  };

  const handleEmojiClick = (emoji) => {
    addToRecent(emoji);
    onEmojiSelect(emoji);
  };

  const filteredEmojis = () => {
    if (!searchQuery.trim()) {
      return EMOJI_CATEGORIES[activeCategory].emojis;
    }

    // Simple search across all categories
    const allEmojis = Object.values(EMOJI_CATEGORIES).flatMap(cat => cat.emojis);
    return allEmojis.filter(emoji => {
      // This is a simplified search - in a real app, you'd have emoji names/keywords
      return true; // For now, return all emojis when searching
    });
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      default: // bottom-left
        return 'top-full left-0 mt-2';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className={`absolute ${getPositionClasses()} w-80 h-96 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="p-3 border-b border-light-border dark:border-dark-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emojis..."
            className="w-full pl-9 pr-3 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
          />
        </div>
      </div>

      {/* Quick Reactions */}
      <div className="p-3 border-b border-light-border dark:border-dark-border">
        <div className="flex space-x-2">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-xl"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-light-border dark:border-dark-border">
        {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-1 p-2 text-center border-b-2 transition-colors ${
                activeCategory === key
                  ? 'border-brand-orange-light dark:border-brand-orange-dark text-brand-orange-light dark:text-brand-orange-dark'
                  : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
              }`}
            >
              {typeof category.icon === 'string' ? (
                <span className="text-lg">{category.icon}</span>
              ) : (
                <IconComponent size={18} />
              )}
            </button>
          );
        })}
      </div>

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis().map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-xl aspect-square flex items-center justify-center"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        {filteredEmojis().length === 0 && (
          <div className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
            <p>No emojis found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;
