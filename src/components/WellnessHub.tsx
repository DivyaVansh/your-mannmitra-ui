import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, Search, Clock, Star, Heart } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface WellnessHubProps {
  onBack: () => void;
}

export default function WellnessHub({ onBack }: WellnessHubProps) {
  const { translate } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const wellnessContent = {
    meditation: [
      {
        id: '1',
        title: 'Morning Mindfulness (सुबह का मन:शांति)',
        description: 'Start your day with 10 minutes of peaceful meditation',
        duration: '10 min',
        level: 'Beginner',
        rating: 4.8,
        thumbnail: '🧘‍♀️',
        type: 'audio'
      },
      {
        id: '2', 
        title: 'Stress Relief Breathing (तनाव मुक्ति)',
        description: 'Quick breathing exercises for instant calm',
        duration: '5 min',
        level: 'Beginner',
        rating: 4.9,
        thumbnail: '🌬️',
        type: 'video'
      },
      {
        id: '3',
        title: 'Body Scan Meditation (शरीर स्कैन)',
        description: 'Release tension with guided body awareness',
        duration: '15 min', 
        level: 'Intermediate',
        rating: 4.7,
        thumbnail: '✨',
        type: 'audio'
      }
    ],
    yoga: [
      {
        id: '4',
        title: 'Gentle Morning Yoga (सुबह का योग)',
        description: 'Easy yoga poses to energize your day',
        duration: '20 min',
        level: 'Beginner',
        rating: 4.6,
        thumbnail: '🕉️',
        type: 'video'
      },
      {
        id: '5',
        title: 'Stress-Relief Asanas (तनाव निवारक आसन)', 
        description: 'Yoga poses specifically for stress relief',
        duration: '15 min',
        level: 'Beginner',
        rating: 4.8,
        thumbnail: '🧘‍♂️',
        type: 'video'
      }
    ],
    sleep: [
      {
        id: '6',
        title: 'Sleep Stories (नींद की कहानियां)',
        description: 'Calming bedtime stories for better sleep',
        duration: '25 min',
        level: 'Beginner',
        rating: 4.9,
        thumbnail: '🌙',
        type: 'audio'
      },
      {
        id: '7',
        title: 'Deep Sleep Meditation (गहरी नींद ध्यान)',
        description: 'Fall asleep faster with this guided meditation',
        duration: '30 min',
        level: 'Beginner', 
        rating: 4.7,
        thumbnail: '😴',
        type: 'audio'
      }
    ],
    motivation: [
      {
        id: '8',
        title: 'Daily Inspiration (दैनिक प्रेरणा)',
        description: 'Motivational shorts for positive mindset',
        duration: '2 min',
        level: 'All',
        rating: 4.8,
        thumbnail: '💪',
        type: 'video'
      },
      {
        id: '9',
        title: 'Student Success Stories (छात्र सफलता)',
        description: 'Real stories from students who overcame challenges',
        duration: '8 min',
        level: 'All',
        rating: 4.9,
        thumbnail: '🎓', 
        type: 'video'
      }
    ]
  };

  const filteredContent = (category: string) => {
    return wellnessContent[category as keyof typeof wellnessContent].filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const ContentCard = ({ content }: { content: any }) => (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="text-4xl mb-2">{content.thumbnail}</div>
          <Badge variant={content.level === 'Beginner' ? 'secondary' : 'outline'}>
            {content.level}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {content.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {content.duration}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {content.rating}
          </div>
        </div>
        <Button className="w-full" size="sm">
          <Play className="w-4 h-4 mr-2" />
          {content.type === 'audio' ? 'Listen' : 'Watch'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{translate('features.wellnessHub')}</h1>
            <p className="text-muted-foreground">{translate('features.wellnessHubDesc')}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search wellness content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <Tabs defaultValue="meditation" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="motivation">Motivation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meditation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent('meditation').map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="yoga">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent('yoga').map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sleep">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent('sleep').map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="motivation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent('motivation').map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Quote */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-4 text-primary" />
            <blockquote className="text-lg font-medium mb-2">
              "Wellness is not a 'medical fix' but a way of living - a lifestyle sensitive and responsive to all the dimensions of body, mind, and spirit."
            </blockquote>
            <p className="text-sm text-muted-foreground">
              - Greg Anderson
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}