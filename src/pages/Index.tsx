import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import Dashboard from "@/components/Dashboard";
import MoodTracker from "@/components/MoodTracker";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />;
      case 'mood-tracker':
        return <MoodTracker onBack={() => setCurrentScreen('dashboard')} />;
      case 'chatbot':
        return <ChatBot onBack={() => setCurrentScreen('dashboard')} />;
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
