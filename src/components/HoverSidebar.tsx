
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import CalculatorModal from './calculator/CalculatorModal';

const HoverSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <>
      <div 
        className={`fixed right-0 top-1/4 flex transition-all duration-300 ease-in-out z-20 ${
          isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-10px)]'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Hover tab */}
        <div className="w-2 h-32 bg-gradient-to-r from-medblue-300 to-medblue-400 rounded-l-md cursor-pointer">
        </div>
        
        {/* Sidebar content */}
        <div className={`bg-white shadow-lg border-l border-t border-b border-medblue-200 rounded-l-md p-2 w-14`}>
          <div className="space-y-4">
            <button 
              onClick={() => setIsCalculatorOpen(true)}
              className="flex flex-col items-center justify-center w-10 h-10 bg-medblue-50 hover:bg-medblue-100 rounded-md text-medblue-600 transition-colors"
              title="Calculadora"
            >
              <Calculator className="w-5 h-5" />
              <span className="text-xs mt-1">Calc</span>
            </button>
          </div>
        </div>
      </div>

      <CalculatorModal 
        open={isCalculatorOpen} 
        onOpenChange={setIsCalculatorOpen} 
      />
    </>
  );
};

export default HoverSidebar;
