import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthScreen from "@/components/Auth/AuthScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import Dashboard from "@/components/Dashboard";
import MoodTracker from "@/components/MoodTracker";
import ChatBot from "@/components/ChatBot";
import WellnessHub from "@/components/WellnessHub";
import BookCounselor from "@/components/BookCounselor";
import DailyJournal from "@/components/DailyJournal";

const Index = () => {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

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
      case 'wellness-hub':
        return <WellnessHub onBack={() => setCurrentScreen('dashboard')} />;
      case 'counselor':
        return <BookCounselor onBack={() => setCurrentScreen('dashboard')} />;
      case 'journal':
        return <DailyJournal onBack={() => setCurrentScreen('dashboard')} />;
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
