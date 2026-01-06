import { getAllBooks } from './storage';

const ACHIEVEMENT_STORAGE_KEY = 'slamBookAchievements';

// Achievement definitions
export const achievements = [
  {
    id: 'first_book',
    name: 'Getting Started',
    description: 'Create your first slam book',
    icon: '📖',
    condition: (stats) => stats.totalBooks >= 1
  },
  {
    id: 'book_collector',
    name: 'Book Collector',
    description: 'Create 5 slam books',
    icon: '📚',
    condition: (stats) => stats.totalBooks >= 5
  },
  {
    id: 'prolific_creator',
    name: 'Prolific Creator',
    description: 'Create 10 slam books',
    icon: '⭐',
    condition: (stats) => stats.totalBooks >= 10
  },
  {
    id: 'question_master',
    name: 'Question Master',
    description: 'Create 50 questions across all books',
    icon: '❓',
    condition: (stats) => stats.totalQuestions >= 50
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Get 10 responses to your books',
    icon: '🦋',
    condition: (stats) => stats.totalResponses >= 10
  },
  {
    id: 'popular_creator',
    name: 'Popular Creator',
    description: 'Get 25 responses to your books',
    icon: '🌟',
    condition: (stats) => stats.totalResponses >= 25
  },
  {
    id: 'media_maven',
    name: 'Media Maven',
    description: 'Add 20 media items to your books',
    icon: '📸',
    condition: (stats) => stats.totalMedia >= 20
  },
  {
    id: 'page_turner',
    name: 'Page Turner',
    description: 'Create 20 pages across all books',
    icon: '📄',
    condition: (stats) => stats.totalPages >= 20
  },
  {
    id: 'theme_explorer',
    name: 'Theme Explorer',
    description: 'Use all 4 themes',
    icon: '🎨',
    condition: (stats) => stats.uniqueThemes >= 4
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Create a book before 8 AM',
    icon: '🌅',
    condition: (stats) => stats.createdBefore8AM > 0
  }
];

// Calculate statistics
export function calculateStats() {
  const books = getAllBooks();
  
  let totalQuestions = 0;
  let totalPages = 0;
  let totalMedia = 0;
  let totalResponses = 0;
  const themes = new Set();
  let createdBefore8AM = 0;

  books.forEach(book => {
    themes.add(book.theme);
    
    const createdAt = new Date(book.createdAt);
    if (createdAt.getHours() < 8) {
      createdBefore8AM++;
    }

    book.pages?.forEach(page => {
      totalPages++;
      totalQuestions += page.questions?.length || 0;
      totalMedia += page.media?.length || 0;
    });

    totalResponses += book.responses?.length || 0;
  });

  return {
    totalBooks: books.length,
    totalQuestions,
    totalPages,
    totalMedia,
    totalResponses,
    uniqueThemes: themes.size,
    createdBefore8AM
  };
}

// Get unlocked achievements
export function getUnlockedAchievements() {
  try {
    const unlocked = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    return unlocked ? JSON.parse(unlocked) : [];
  } catch (error) {
    console.error('Error reading achievements:', error);
    return [];
  }
}

// Check and unlock achievements
export function checkAchievements() {
  const stats = calculateStats();
  const unlocked = getUnlockedAchievements();
  const newAchievements = [];

  achievements.forEach(achievement => {
    if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
      unlocked.push(achievement.id);
      newAchievements.push(achievement);
    }
  });

  if (newAchievements.length > 0) {
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(unlocked));
  }

  return {
    unlocked,
    newAchievements,
    stats,
    totalUnlocked: unlocked.length,
    totalAchievements: achievements.length
  };
}

// Get achievement progress
export function getAchievementProgress() {
  const stats = calculateStats();
  const unlocked = getUnlockedAchievements();
  
  return achievements.map(achievement => ({
    ...achievement,
    unlocked: unlocked.includes(achievement.id),
    progress: achievement.condition(stats)
  }));
}


