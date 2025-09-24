import { useState } from "react";
import { Heart, Brain, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-illustration.jpg";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const quotes = [
    {
      text: "मन का शांतिपूर्ण रहना ही जीवन की सबसे बड़ी संपत्ति है।",
      translation: "A peaceful mind is life's greatest treasure.",
      source: "Bhagavad Gita"
    },
    {
      text: "स्वयं को जानना ही सबसे बड़ा ज्ञान है।",
      translation: "Knowing yourself is the greatest wisdom.",
      source: "Ancient Wisdom"
    },
    {
      text: "योग: कर्मसु कौशलम्",
      translation: "Yoga is skill in action.",
      source: "Bhagavad Gita 2.50"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Support",
      description: "24/7 intelligent companion for your mental wellness journey"
    },
    {
      icon: Heart,
      title: "Mindful Living",
      description: "Daily practices for stress relief and inner peace"
    },
    {
      icon: Users,
      title: "Community",
      description: "Anonymous peer support with fellow students"
    },
    {
      icon: Sparkles,
      title: "Growth Tracking",
      description: "Monitor your mood and celebrate small victories"
    }
  ];

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wellness-calm rounded-full blur-xl float" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-wellness-peace rounded-full blur-lg float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent rounded-full blur-md breathe" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Hero Section */}
        <div className="mb-12 fade-in">
          <img 
            src={heroImage} 
            alt="Mental wellness illustration" 
            className="w-full max-w-2xl mx-auto mb-8 rounded-3xl shadow-card"
          />
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            YourMannMitra
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-2">
            Your Mental Wellness Companion
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            आपका मानसिक स्वास्थ्य मित्र - Empowering students with culturally-rooted wellness support
          </p>
        </div>

        {/* Daily Quote */}
        <Card className="mb-12 max-w-2xl mx-auto shadow-soft slide-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-accent">
              <Sparkles className="w-8 h-8 mx-auto" />
            </div>
            <blockquote className="text-lg font-medium text-foreground mb-2">
              "{quotes[currentQuote].text}"
            </blockquote>
            <p className="text-sm text-muted-foreground mb-1">
              {quotes[currentQuote].translation}
            </p>
            <cite className="text-xs text-primary font-medium">
              — {quotes[currentQuote].source}
            </cite>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="shadow-soft hover:shadow-card transition-all duration-300 ease-gentle slide-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 gradient-wellness rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="slide-in" style={{ animationDelay: '0.7s' }}>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="gradient-primary hover:shadow-glow transition-all duration-300 ease-bounce text-lg px-12 py-4"
          >
            Begin Your Wellness Journey
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Safe • Anonymous • Culturally Sensitive • Available 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;