import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sun, Zap, Cloud, CloudRain, Moon, Calendar } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MoodTrackerProps {
  onBack: () => void;
}

const MoodTracker = ({ onBack }: MoodTrackerProps) => {
  const { translate } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [todayEntry, setTodayEntry] = useState<any>(null);

  useEffect(() => {
    fetchTodayEntry();
  }, [user?.id]);

  const fetchTodayEntry = async () => {
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (!error && data) {
      setTodayEntry(data);
      setSelectedMood(data.mood_type);
      setNotes(data.notes || '');
    }
  };

  const moodOptions = [
    {
      id: 'great',
      label: 'Great / बहुत अच्छा',
      icon: Sun,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: 'Feeling amazing and energetic! / अद्भुत और ऊर्जावान महसूस कर रहे हैं!',
      level: 5
    },
    {
      id: 'good',
      label: 'Good / अच्छा',
      icon: Zap,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'Having a positive day / सकारात्मक दिन बिता रहे हैं',
      level: 4
    },
    {
      id: 'okay',
      label: 'Okay / ठीक',
      icon: Cloud,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Feeling neutral or balanced / तटस्थ या संतुलित महसूस कर रहे हैं',
      level: 3
    },
    {
      id: 'low',
      label: 'Low / उदास',
      icon: CloudRain,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      description: 'Feeling a bit down today / आज थोड़ा उदास महसूस कर रहे हैं',
      level: 2
    },
    {
      id: 'difficult',
      label: 'Difficult / कठिन',
      icon: Moon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Having a tough time right now / अभी कठिन समय से गुजर रहे हैं',
      level: 1
    }
  ];

  const handleSaveMood = async () => {
    if (!selectedMood) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select your mood first",
      });
      return;
    }

    setLoading(true);

    try {
      const moodData = {
        user_id: user?.id,
        mood_level: moodOptions.find(m => m.id === selectedMood)?.level || 3,
        mood_type: selectedMood,
        notes: notes.trim() || null,
        date: new Date().toISOString().split('T')[0]
      };

      if (todayEntry) {
        const { error } = await supabase
          .from('mood_entries')
          .update(moodData)
          .eq('id', todayEntry.id);

        if (error) throw error;
        
        toast({
          title: "Mood Updated!",
          description: "Your mood check-in has been updated for today.",
        });
      } else {
        const { error } = await supabase
          .from('mood_entries')
          .insert([moodData]);

        if (error) throw error;
        
        toast({
          title: "Mood Saved!",
          description: "Thank you for checking in today. Keep taking care of yourself!",
        });
      }

      onBack();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{translate('features.moodTracker')}</h1>
            <p className="text-muted-foreground">{translate('features.moodTrackerDesc')}</p>
            {todayEntry && (
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {todayEntry ? 'Updating today\'s entry' : 'Today\'s mood check-in'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mood Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={`h-24 flex-col gap-2 ${selectedMood === mood.id ? 'bg-primary' : ''}`}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <mood.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{mood.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Optional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How was your day? Any thoughts you'd like to share..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button 
            onClick={handleSaveMood} 
            disabled={!selectedMood || loading}
            className="w-full"
          >
            {loading ? "Saving..." : (todayEntry ? "Update Mood" : "Save Mood Check-in")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;