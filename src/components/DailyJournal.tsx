import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BookOpen, Plus, Search, Calendar, Heart, Trash2, Edit } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DailyJournalProps {
  onBack: () => void;
}

export default function DailyJournal({ onBack }: DailyJournalProps) {
  const { translate } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  useEffect(() => {
    fetchEntries();
  }, [user?.id]);

  const fetchEntries = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    setLoading(true);

    try {
      const entryData = {
        user_id: user?.id,
        title: title.trim(),
        content: content.trim(),
        mood: mood || null,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      };

      if (editingEntry) {
        const { error } = await supabase
          .from('journal_entries')
          .update(entryData)
          .eq('id', editingEntry.id);

        if (error) throw error;
        
        toast({
          title: "Entry Updated!",
          description: "Your journal entry has been saved.",
        });
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .insert([entryData]);

        if (error) throw error;
        
        toast({
          title: "Entry Saved!",
          description: "Your journal entry has been saved.",
        });
      }

      // Reset form
      setTitle('');
      setContent('');
      setMood('');
      setTags('');
      setEditingEntry(null);
      setIsDialogOpen(false);
      fetchEntries();
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

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || '');
    setTags(entry.tags ? entry.tags.join(', ') : '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      });

      fetchEntries();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.tags && entry.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const moodEmojis = {
    'great': '😊',
    'good': '🙂',
    'okay': '😐',
    'low': '😔',
    'difficult': '😢'
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
    setTags('');
    setEditingEntry(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{translate('features.dailyJournal')}</h1>
              <p className="text-muted-foreground">{translate('features.dailyJournalDesc')}</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                </DialogTitle>
                <DialogDescription>
                  Express your thoughts and feelings in your personal space
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind today?"
                    rows={8}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mood">How are you feeling?</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="great">😊 Great</SelectItem>
                        <SelectItem value="good">🙂 Good</SelectItem>
                        <SelectItem value="okay">😐 Okay</SelectItem>
                        <SelectItem value="low">😔 Low</SelectItem>
                        <SelectItem value="difficult">😢 Difficult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="gratitude, reflection, goals..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : (editingEntry ? "Update" : "Save Entry")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search your entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="group hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {entry.mood && (
                        <span className="text-lg">{moodEmojis[entry.mood as keyof typeof moodEmojis]}</span>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{entry.title}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {entry.content}
                  </p>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {entry.tags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No journal entries yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No entries match your search." : "Start your journaling journey today!"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Entry
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Inspirational Quote */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-4 text-primary" />
            <blockquote className="text-lg font-medium mb-2">
              "जर्नलिंग आत्मा की आवाज़ सुनने का एक तरीका है।"
            </blockquote>
            <p className="text-sm text-muted-foreground">
              "Journaling is a way to listen to the voice of the soul."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}