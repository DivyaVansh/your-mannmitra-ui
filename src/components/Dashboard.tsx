import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Heart, 
  Calendar, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Gamepad2,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Zap,
  LogOut,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { translate, toggleLanguage } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [user?.id]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const dailyAffirmations = [
    "आपकी मानसिक शांति आपकी सबसे बड़ी शक्ति है। (Your mental peace is your greatest strength.)",
    "हर छोटा कदम आपको बेहतर बनाता है। (Every small step makes you better.)",
    "You are braver than you believe, stronger than you seem, and more loved than you know.",
    "कल्याणम् - Your wellness journey matters, and you matter.",
    "प्रेम और धैर्य से सब कुछ संभव है। (With love and patience, everything is possible.)"
  ];

  const [currentAffirmation] = useState(dailyAffirmations[Math.floor(Math.random() * dailyAffirmations.length)]);

  const quickActions = [
    {
      id: 'chatbot',
      title: translate('features.aiCompanion'),
      description: translate('features.aiCompanionDesc'),
      icon: MessageCircle,
      color: 'primary',
      urgent: false
    },
    {
      id: 'mood-tracker',
      title: translate('features.moodTracker'),
      description: translate('features.moodTrackerDesc'),
      icon: Heart,
      color: 'secondary',
      urgent: true
    },
    {
      id: 'wellness-hub',
      title: translate('features.wellnessHub'),
      description: translate('features.wellnessHubDesc'),
      icon: Sparkles,
      color: 'accent',
      urgent: false
    },
    {
      id: 'counselor',
      title: translate('features.bookCounselor'),
      description: translate('features.bookCounselorDesc'),
      icon: Calendar,
      color: 'primary',
      urgent: false
    },
    {
      id: 'peer-forum',
      title: translate('features.peerSupport'),
      description: translate('features.peerSupportDesc'),
      icon: Users,
      color: 'secondary',
      urgent: false
    },
    {
      id: 'journal',
      title: translate('features.dailyJournal'),
      description: translate('features.dailyJournalDesc'),
      icon: BookOpen,
      color: 'accent',
      urgent: false
    },
    {
      id: 'progress',
      title: translate('features.myProgress'),
      description: translate('features.myProgressDesc'),
      icon: TrendingUp,
      color: 'primary',
      urgent: false
    },
    {
      id: 'games',
      title: translate('features.mindfulGames'),
      description: translate('features.mindfulGamesDesc'),
      icon: Gamepad2,
      color: 'secondary',
      urgent: false
    }
  ];

  const moodIcons = {
    great: { icon: Sun, color: 'mood-great', label: 'Great' },
    good: { icon: Zap, color: 'mood-good', label: 'Good' },
    okay: { icon: Cloud, color: 'mood-okay', label: 'Okay' },
    low: { icon: CloudRain, color: 'mood-low', label: 'Low' },
    difficult: { icon: Moon, color: 'mood-difficult', label: 'Difficult' }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {translate('dashboard.goodMorning')}, {userProfile?.full_name || 'Friend'}! 🌅
              </h1>
              <p className="text-muted-foreground">{translate('dashboard.namaste')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gradient-wellness">
                {translate('dashboard.streak')}
              </Badge>
              <Button variant="outline" size="icon" onClick={toggleLanguage}>
                <Languages className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Daily Affirmation */}
        <Card className="mb-8 shadow-soft slide-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6 text-center gradient-card">
            <div className="mb-4">
              <Sparkles className="w-8 h-8 mx-auto text-accent breathe" />
            </div>
            <blockquote className="text-lg font-medium text-foreground mb-2">
              {currentAffirmation}
            </blockquote>
            <p className="text-sm text-muted-foreground">
              Daily wisdom for your wellness journey
            </p>
          </CardContent>
        </Card>

        {/* Quick Mood Check */}
        <Card className="mb-8 shadow-soft slide-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {translate('dashboard.quickMood')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center gap-2">
              {Object.entries(moodIcons).map(([mood, { icon: Icon, color, label }]) => (
                <Button
                  key={mood}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-16 flex-col gap-1 hover:shadow-soft transition-all duration-200"
                  onClick={() => onNavigate('mood-tracker')}
                >
                  <Icon className={`w-6 h-6 text-${color}`} />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={action.id}
              className={`shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer slide-in ${
                action.urgent ? 'ring-2 ring-primary/20 glow' : ''
              }`}
              style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              onClick={() => onNavigate(action.id)}
            >
              <CardContent className="p-6 text-center relative">
                {action.urgent && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground"
                  >
                    New
                  </Badge>
                )}
                <div className={`w-12 h-12 mx-auto mb-4 gradient-${action.color === 'primary' ? 'primary' : action.color === 'secondary' ? 'wellness' : 'card'} rounded-full flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Help */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary-light/10 border-primary/20 slide-in" style={{ animationDelay: '0.8s' }}>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">{translate('dashboard.emergency')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {translate('dashboard.helpline')}
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {translate('dashboard.kiranCall')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;