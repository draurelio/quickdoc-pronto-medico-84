

import React, { useState } from 'react';
import { Calculator, MessageCircle, TestTube, Globe, Users, History } from 'lucide-react'; // Removed FilePlus icon
import CalculatorModal from './calculator/CalculatorModal';
import ChatDrawer from './ChatDrawer';

const HoverSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLabClick = () => {
    window.open('https://acesso.unilabor.com.br:8443/ConcentWeb/hlab8000?cEmpCod_aux=0&cFilCod_aux=0&LabWLogTpCod_parm=&Codigo_parm=&cSenha_parm=', '_blank');
  };

  const handleTrxClick = () => {
    window.open('https://auth.logicsolutions.com.br/auth/realms/webpacs/protocol/openid-connect/auth?response_type=code&client_id=web_app&scope=openid%20address%20email%20microprofile-jwt%20offline_access%20phone%20profile%20roles%20web-origins&state=Gpt-2V61euSBXSq0ziTc1ngeyujwidcjzIlhJHwY-OU%3D&redirect_uri=http://webpacs.logicsolutions.com.br/login/oauth2/code/oidc&nonce=mSWph_U0fdaiUlR_lQMpxZ55eVzEpWpGdy5nhMUFhSQ', '_blank');
  };

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
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex flex-col items-center justify-center w-10 h-10 bg-medblue-50 hover:bg-medblue-100 rounded-md text-medblue-600 transition-colors"
              title="Chat IA"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs mt-1">Chat</span>
            </button>
            <button
              onClick={handleLabClick}
              className="flex flex-col items-center justify-center w-10 h-10 bg-medblue-50 hover:bg-medblue-100 rounded-md text-medblue-600 transition-colors"
              title="Laboratório"
            >
              <TestTube className="w-5 h-5" />
              <span className="text-xs mt-1">Lab</span>
            </button>
            <button
              onClick={handleTrxClick}
              className="flex flex-col items-center justify-center w-10 h-10 bg-medblue-50 hover:bg-medblue-100 rounded-md text-medblue-600 transition-colors"
              title="TRX"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs mt-1">TRX</span>
            </button>
            {/* TODO: Choose a more appropriate icon */}
            <button
              onClick={() => window.location.href = '#/patients'} 
              className="flex flex-col items-center justify-center w-10 h-10 bg-medblue-50 hover:bg-medblue-100 rounded-md text-medblue-600 transition-colors"
              title="Patient Management"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs mt-1">Patients</span>
            </button>
            {/* Removed "New Prescription" button that linked to /prescriptions/new */}
            <button
              onClick={() => window.location.href = '#/prescriptions/history'}
              className="flex flex-col items-center justify-center w-10 h-10 bg-medblue-50 hover:bg-medblue-100 rounded-md text-medblue-600 transition-colors"
              title="Prescription History"
            >
              <History className="w-5 h-5" />
              <span className="text-xs mt-1">History</span>
            </button>
          </div>
        </div>
      </div>

      <CalculatorModal 
        open={isCalculatorOpen} 
        onOpenChange={setIsCalculatorOpen} 
      />
      <ChatDrawer 
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </>
  );
};

export default HoverSidebar;

