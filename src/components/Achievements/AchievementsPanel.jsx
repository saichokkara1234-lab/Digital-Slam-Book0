import { useState, useEffect } from 'react';
import { checkAchievements, getAchievementProgress } from '../../utils/achievements';
import { Modal } from '../common/Modal';
import './AchievementsPanel.css';

export function AchievementsPanel({ isOpen, onClose }) {
  const [achievementData, setAchievementData] = useState(null);
  const [showNewAchievements, setShowNewAchievements] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const data = checkAchievements();
      setAchievementData(data);
      
      if (data.newAchievements.length > 0) {
        setShowNewAchievements(true);
      }
    }
  }, [isOpen]);

  const progress = getAchievementProgress();

  if (!achievementData) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Achievements" size="large">
        <div className="achievements-panel">
          <div className="achievements-header">
            <div className="achievements-stats">
              <div className="stat-item">
                <div className="stat-value">{achievementData.totalUnlocked}</div>
                <div className="stat-label">Unlocked</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{achievementData.totalAchievements}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.round((achievementData.totalUnlocked / achievementData.totalAchievements) * 100)}%
                </div>
                <div className="stat-label">Complete</div>
              </div>
            </div>
          </div>

          <div className="achievements-grid">
            {progress.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-info">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-desc">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <div className="achievement-badge">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {showNewAchievements && achievementData.newAchievements.length > 0 && (
        <div className="new-achievements-overlay" onClick={() => setShowNewAchievements(false)}>
          <div className="new-achievements-popup" onClick={(e) => e.stopPropagation()}>
            <div className="celebration">🎉</div>
            <h2>New Achievement Unlocked!</h2>
            {achievementData.newAchievements.map((achievement) => (
              <div key={achievement.id} className="new-achievement-item">
                <div className="new-achievement-icon">{achievement.icon}</div>
                <div>
                  <div className="new-achievement-name">{achievement.name}</div>
                  <div className="new-achievement-desc">{achievement.description}</div>
                </div>
              </div>
            ))}
            <button
              className="close-celebration-btn"
              onClick={() => setShowNewAchievements(false)}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </>
  );
}


