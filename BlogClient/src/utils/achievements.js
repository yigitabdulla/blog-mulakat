// Achievement system for user profile
export const calculateAchievements = (user, userPosts, tournaments) => {
  if (!user) return [];

  const achievements = [];
  const tournamentWins = user.totalWins || 0; // Complete tournament victories
  const totalPosts = userPosts.length;
  
  // Early Adopter Achievement (if user joined recently)
  const joinDate = new Date(user.createdAt || Date.now());
  const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceJoin <= 7 && totalPosts >= 1) {
    achievements.push({
      id: 'early_adopter',
      title: 'Early Adopter',
      description: 'Joined and posted within the first week',
      icon: '🌅',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: 'uncommon'
    });
  }

  // First Victory Achievement (Tournament Win)
  if (tournamentWins >= 1) {
    achievements.push({
      id: 'first_victory',
      title: 'First Victory',
      description: 'Won your first tournament',
      icon: '🥇',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: 'common'
    });
  }

  // Multiple Champion Achievement
  if (tournamentWins >= 3) {
    achievements.push({
      id: 'multiple_champion',
      title: 'Multiple Champion',
      description: 'Won 3+ tournaments',
      icon: '👑',
      unlocked: true,
      progress: Math.min(tournamentWins, 10),
      maxProgress: 10,
      rarity: 'rare'
    });
  }

  // Tournament Legend Achievement
  if (tournamentWins >= 10) {
    achievements.push({
      id: 'tournament_legend',
      title: 'Tournament Legend',
      description: 'Won 10+ tournaments',
      icon: '🌟',
      unlocked: true,
      progress: tournamentWins,
      maxProgress: 20,
      rarity: 'legendary'
    });
  }

  // Sort achievements by rarity and unlocked status
  const rarityOrder = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
  achievements.sort((a, b) => {
    if (a.unlocked !== b.unlocked) {
      return b.unlocked - a.unlocked; // Unlocked first
    }
    return rarityOrder[b.rarity] - rarityOrder[a.rarity]; // Higher rarity first
  });

  return achievements;
};

// Get achievement progress for locked achievements
export const getLockedAchievements = (user, userPosts, tournaments = []) => {
  if (!user) return [];

  const tournamentWins = user.totalWins || 0;
  const totalPosts = userPosts.length;
  
  // Early Adopter Achievement (if not unlocked)
  const joinDate = new Date(user.createdAt || Date.now());
  const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  const isEarlyAdopter = daysSinceJoin <= 7 && totalPosts >= 1;

  const lockedAchievements = [];

  // Early Adopter (if not unlocked)
  if (!isEarlyAdopter) {
    lockedAchievements.push({
      id: 'early_adopter',
      title: 'Early Adopter',
      description: 'Join and post within the first week',
      icon: '🌅',
      unlocked: false,
      progress: daysSinceJoin <= 7 ? totalPosts : 0,
      maxProgress: 1,
      rarity: 'uncommon'
    });
  }

  // First Victory (if not unlocked)
  if (tournamentWins < 1) {
    lockedAchievements.push({
      id: 'first_victory',
      title: 'First Victory',
      description: 'Win your first tournament',
      icon: '🥇',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'common'
    });
  }

  // Multiple Champion (if not unlocked)
  if (tournamentWins < 3) {
    lockedAchievements.push({
      id: 'multiple_champion',
      title: 'Multiple Champion',
      description: 'Win 3+ tournaments',
      icon: '👑',
      unlocked: false,
      progress: tournamentWins,
      maxProgress: 3,
      rarity: 'rare'
    });
  }

  // Tournament Legend (if not unlocked)
  if (tournamentWins < 10) {
    lockedAchievements.push({
      id: 'tournament_legend',
      title: 'Tournament Legend',
      description: 'Win 10+ tournaments',
      icon: '🌟',
      unlocked: false,
      progress: tournamentWins,
      maxProgress: 10,
      rarity: 'legendary'
    });
  }

  return lockedAchievements;
};
