import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User, Heart, Lightbulb, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ChatBotProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const ChatBot = ({ onBack }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "नमस्ते! I'm your YourMannMitra AI companion. I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date(),
      suggestions: [
        "I'm feeling stressed about exams",
        "I'm having trouble sleeping",
        "I feel anxious about the future",
        "I'm feeling lonely"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    // Simple response generation - in real app, this would use actual AI
    let response = "";
    let suggestions: string[] = [];

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('exam')) {
      response = "मैं समझ सकता हूँ कि परीक्षा का तनाव कितना कठिन हो सकता है। (I understand how difficult exam stress can be.) Let's try some breathing exercises together. Take a deep breath in for 4 counts, hold for 4, then exhale for 6. Remember, you've prepared as best you can. 🌸";
      suggestions = [
        "Can you guide me through a meditation?",
        "What are some study break activities?",
        "How can I manage my time better?"
      ];
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      response = "Sleep troubles are common, especially during stressful times. नींद का न आना बहुत परेशान करने वाला है। (Not being able to sleep is very troubling.) Let's create a calming bedtime routine. Have you tried the 4-7-8 breathing technique? 🌙";
      suggestions = [
        "Tell me about the 4-7-8 technique",
        "What should I avoid before bedtime?",
        "Can you suggest some relaxing activities?"
      ];
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      response = "आपकी चिंता स्वाभाविक है। (Your anxiety is natural.) Anxiety about the future is something many students experience. Let's ground ourselves in the present moment. Can you name 5 things you can see around you right now? This helps bring us back to the here and now. 💙";
      suggestions = [
        "Help me with grounding techniques",
        "What causes anxiety?",
        "How can I calm my racing thoughts?"
      ];
    } else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
      response = "Feeling lonely is deeply human, and you're not alone in feeling this way. आप अकेले नहीं हैं। (You are not alone.) Even when we feel isolated, there are people who care. Would you like to explore ways to connect with others or find comfort in solitude? 🤗";
      suggestions = [
        "How can I make new friends?",
        "What about online communities?",
        "How do I enjoy my own company?"
      ];
    } else {
      response = "Thank you for sharing that with me. मैं यहाँ आपके साथ हूँ। (I am here with you.) Your feelings are valid, and it's okay to experience them. Would you like to talk more about what's on your mind, or shall we try a mindfulness exercise together? 🌺";
      suggestions = [
        "Let's try a mindfulness exercise",
        "I want to talk more about my feelings",
        "Can you suggest some self-care activities?"
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(content);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 bg-card border-b fade-in">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Wellness Companion</h1>
              <p className="text-sm text-muted-foreground">
                मैं आपका मित्र हूँ - Always here to listen and support
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto gradient-wellness">
              Online 24/7
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 slide-in ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'gradient-wellness'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <div className={`max-w-md ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <Card className={`${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'shadow-soft'
                }`}>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardContent>
                </Card>

                {/* Bot Suggestions */}
                {message.type === 'bot' && message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs hover:shadow-soft"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 fade-in">
              <div className="w-8 h-8 gradient-wellness rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <Card className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-card border-t">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message... मुझसे कुछ भी पूछें"
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              className="gradient-primary hover:shadow-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick("I need urgent help")}
              className="text-xs"
            >
              <Phone className="w-3 h-3 mr-1" />
              Emergency Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick("Can you help me relax?")}  
              className="text-xs"
            >
              <Heart className="w-3 h-3 mr-1" />
              Relaxation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick("Give me some study tips")}
              className="text-xs"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Study Tips
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;