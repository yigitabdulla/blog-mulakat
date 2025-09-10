import { useState } from 'react';
import SubmitModal from '../components/SubmitModal';

const SubmitPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Submit Your Blog Post
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Share your content with the community and let them vote on it in epic battles
        </p>
      </div>

      {/* Quick Submit Button */}
      <div className="text-center mb-12">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xl px-12 py-4"
        >
          🚀 Create New Post
        </button>
      </div>

      {/* Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">📝</span>
            </div>
                  <h3 className="text-xl font-semibold text-white">Writing Guidelines</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
            <li>• Write engaging, original content</li>
            <li>• Use clear, compelling titles</li>
            <li>• Include relevant images</li>
            <li>• Choose appropriate categories</li>
            <li>• Keep content family-friendly</li>
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">⚔️</span>
            </div>
                  <h3 className="text-xl font-semibold text-white">Battle Rules</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
            <li>• Posts compete in tournament brackets</li>
            <li>• Community votes determine winners</li>
            <li>• Winners advance to next rounds</li>
            <li>• Final champions get special badges</li>
            <li>• Fair play and respect required</li>
          </ul>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Entertainment', 'Sports', 'Other'].map((category) => (
            <div key={category} className="card text-center hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="text-2xl mb-2">
                {category === 'Technology' && '💻'}
                {category === 'Lifestyle' && '🌟'}
                {category === 'Travel' && '✈️'}
                {category === 'Food' && '🍕'}
                {category === 'Health' && '💪'}
                {category === 'Business' && '💼'}
                {category === 'Education' && '📚'}
                {category === 'Entertainment' && '🎬'}
                {category === 'Sports' && '⚽'}
                {category === 'Other' && '📄'}
              </div>
              <div className="text-sm font-medium text-gray-300">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Modal */}
      <SubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SubmitPost;
