import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';

interface FloatingActionButtonProps {
  onList: () => void;
  onWant: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onList, onWant }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <div className="relative flex flex-col items-center gap-3">
        {isOpen && (
          <>
            <div className="flex items-center gap-3 animate-fade-in-up-fast">
              <span className="bg-white text-sm text-gray-700 font-semibold px-3 py-1.5 rounded-lg shadow-md">
                '구해요' 등록
              </span>
              <button
                onClick={() => { onWant(); setIsOpen(false); }}
                className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-dark transition-transform hover:scale-110"
              >
                <PlusIcon className="w-7 h-7" />
              </button>
            </div>
            <div className="flex items-center gap-3 animate-fade-in-up-fast" style={{ animationDelay: '50ms' }}>
              <span className="bg-white text-sm text-gray-700 font-semibold px-3 py-1.5 rounded-lg shadow-md">
                판매글 등록
              </span>
              <button
                onClick={() => { onList(); setIsOpen(false); }}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform hover:scale-110"
              >
                <PlusIcon className="w-7 h-7" />
              </button>
            </div>
          </>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-xl hover:bg-primary-dark transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;