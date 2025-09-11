import React from 'react';
import { useSelector } from 'react-redux';
import Achievement from '../components/Achievement';
import { calculateAchievements, getLockedAchievements } from '../utils/achievements';

const Achievements = () => {
  const { user: authUser } = useSelector(state => state.auth);
  const { myPosts } = useSelector(state => state.blog);

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Login Required</h1>
          <p className="text-gray-600">Please log in to view your achievements.</p>
        </div>
      </div>
    );
  }

  const achievements = calculateAchievements(authUser, myPosts, []);
  const lockedAchievements = getLockedAchievements(authUser, myPosts, []);
  const allAchievements = [...achievements, ...lockedAchievements];

  const unlockedCount = achievements.length;
  const totalCount = allAchievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🏆 Achievements</h1>
          <p className="mt-2 text-gray-600">Track your progress and unlock new achievements</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Progress Overview</h2>
            <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{unlockedCount} unlocked</span>
            <span>{totalCount} total</span>
          </div>
        </div>

        {/* Unlocked Achievements */}
        {achievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Unlocked Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <Achievement key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔒 Locked Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lockedAchievements.map((achievement) => (
                <Achievement key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Achievement Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievement Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-medium text-gray-900">Content Creation</h3>
              <p className="text-sm text-gray-600">Publishing posts</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-medium text-gray-900">Tournament Wins</h3>
              <p className="text-sm text-gray-600">Winning battles</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <h3 className="font-medium text-gray-900">Popularity</h3>
              <p className="text-sm text-gray-600">Getting votes</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⚔️</div>
              <h3 className="font-medium text-gray-900">Battle Performance</h3>
              <p className="text-sm text-gray-600">Win rates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
