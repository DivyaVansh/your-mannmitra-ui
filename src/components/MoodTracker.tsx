import { useState } from "react";
import { ArrowLeft, Sun, Zap, Cloud, CloudRain, Moon, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface MoodTrackerProps {
  onBack: () => void;
}

const MoodTracker = ({ onBack }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moods = [
    {
      id: 'great',
      label: 'Great',
      icon: Sun,
      color: 'mood-great',
      description: 'Feeling amazing and energetic!',
      tips: ['Keep up the great energy!', 'Share your joy with others', 'Document what made today special']
    },
    {
      id: 'good',
      label: 'Good',
      icon: Zap,
      color: 'mood-good',
      description: 'Pretty good overall',
      tips: ['Maintain this positive momentum', 'Try a gratitude practice', 'Connect with a friend']
    },
    {
      id: 'okay',
      label: 'Okay',
      icon: Cloud,
      color: 'mood-okay',
      description: 'Neutral, neither good nor bad',
      tips: ['Take a mindful walk', 'Listen to calming music', 'Practice deep breathing']
    },
    {
      id: 'low',
      label: 'Low',
      icon: CloudRain,
      color: 'mood-low',
      description: 'Not feeling my best',
      tips: ['Be gentle with yourself', 'Try a 5-minute meditation', 'Reach out to someone you trust']
    },
    {
      id: 'difficult',
      label: 'Struggling',
      icon: Moon,
      color: 'mood-difficult',
      description: 'Having a tough time',
      tips: ['You\'re not alone in this', 'Consider talking to a counselor', 'Focus on small, manageable steps']
    }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      setIsSubmitted(true);
      // In real app, save to database
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedMood(null);
        setNotes("");
      }, 3000);
    }
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center shadow-card">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-4">
              Your mood has been logged. Every check-in helps us understand you better.
            </p>
            <Badge variant="secondary" className="gradient-wellness">
              +10 wellness points earned! 🌟
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            How are you feeling today? 💙
          </h1>
          <p className="text-muted-foreground">
            आज आपका मन कैसा है? - Take a moment to check in with yourself
          </p>
        </div>

        {/* Mood Selection */}
        <Card className="mb-8 shadow-soft slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Mood Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {moods.map((mood, index) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={`h-32 flex-col gap-3 p-4 slide-in ${
                    selectedMood === mood.id 
                      ? 'gradient-primary text-primary-foreground shadow-glow' 
                      : 'hover:shadow-soft'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleMoodSelect(mood.id)}
                >
                  <mood.icon className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">{mood.label}</div>
                    <div className="text-xs opacity-75">{mood.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mood Details & Tips */}
        {selectedMoodData && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-soft fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <selectedMoodData.icon className={`w-5 h-5 text-${selectedMoodData.color}`} />
                  Feeling {selectedMoodData.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  It's completely normal to feel this way. Here are some gentle suggestions:
                </p>
                <ul className="space-y-2">
                  {selectedMoodData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-soft fade-in">
              <CardHeader>
                <CardTitle>Optional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's on your mind? Share anything you'd like to remember about today... (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-32 mb-4"
                />
                <p className="text-xs text-muted-foreground">
                  Your notes are private and help you track patterns over time.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submit Button */}
        {selectedMood && (
          <div className="text-center fade-in">
            <Button 
              onClick={handleSubmit}
              size="lg"
              className="gradient-primary hover:shadow-glow transition-all duration-300 px-12"
            >
              Log My Mood
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Building healthy habits, one check-in at a time 🌱
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;