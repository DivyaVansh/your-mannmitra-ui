import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Clock, MapPin, Star, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookCounselorProps {
  onBack: () => void;
}

export default function BookCounselor({ onBack }: BookCounselorProps) {
  const { translate } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const counselors = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialization: 'Student Counseling & Anxiety',
      experience: '8 years',
      rating: 4.9,
      languages: ['English', 'Hindi'],
      location: 'Delhi',
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      image: '👩‍⚕️'
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Depression & Stress Management',
      experience: '12 years',
      rating: 4.8,
      languages: ['English', 'Hindi', 'Bengali'],
      location: 'Mumbai',
      availability: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      image: '👨‍⚕️'
    },
    {
      id: '3',
      name: 'Dr. Anjali Mehta',
      specialization: 'Academic Pressure & Self-Esteem',
      experience: '6 years',
      rating: 4.9,
      languages: ['English', 'Hindi', 'Gujarati'],
      location: 'Bangalore',
      availability: ['09:00', '10:00', '13:00', '14:00', '15:00', '18:00'],
      image: '👩‍💼'
    }
  ];

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  const fetchBookings = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('counselor_bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true });

    if (!error && data) {
      setBookings(data);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedCounselor) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select date, time, and counselor",
      });
      return;
    }

    setLoading(true);
    
    try {
      const counselor = counselors.find(c => c.id === selectedCounselor);
      
      const { error } = await supabase
        .from('counselor_bookings')
        .insert([{
          user_id: user?.id,
          counselor_name: counselor?.name || '',
          appointment_date: selectedDate.toISOString().split('T')[0],
          appointment_time: selectedTime,
          notes: notes,
          status: 'scheduled'
        }]);

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: `Your appointment with ${counselor?.name} is scheduled for ${selectedDate.toDateString()} at ${selectedTime}`,
      });

      // Reset form
      setSelectedTime('');
      setSelectedCounselor('');
      setNotes('');
      fetchBookings();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const availableTimes = selectedCounselor 
    ? counselors.find(c => c.id === selectedCounselor)?.availability || []
    : [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{translate('features.bookCounselor')}</h1>
            <p className="text-muted-foreground">{translate('features.bookCounselorDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Emergency Support</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {translate('dashboard.helpline')}
                </p>
                <Button variant="outline" className="w-full">
                  {translate('dashboard.kiranCall')}
                </Button>
              </CardContent>
            </Card>

            {/* Counselor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Select Counselor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {counselors.map((counselor) => (
                  <Card 
                    key={counselor.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedCounselor === counselor.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCounselor(counselor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{counselor.image}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{counselor.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{counselor.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {counselor.specialization}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>{counselor.experience}</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {counselor.location}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {counselor.languages.map((lang) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
                
                {selectedCounselor && (
                  <div>
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Share any specific concerns or topics you'd like to discuss..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            <Button 
              onClick={handleBooking} 
              disabled={loading || !selectedDate || !selectedTime || !selectedCounselor}
              className="w-full"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>

          {/* My Bookings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>Your upcoming and past appointments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{booking.counselor_name}</h4>
                          <Badge 
                            variant={booking.status === 'scheduled' ? 'default' : 'secondary'}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {new Date(booking.appointment_date).toDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.appointment_time}
                          </div>
                        </div>
                        {booking.notes && (
                          <p className="text-sm mt-2 p-2 bg-muted rounded">
                            {booking.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}