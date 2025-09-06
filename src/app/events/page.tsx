"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  contact_info: string;
  registration_required: number;
  max_participants: number;
  current_participants: number;
  created_at: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          ...registrationData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! You will receive a confirmation email shortly.');
        setMessageType('success');
        setRegistrationData({ name: '', email: '', phone: '', message: '' });
        setIsDialogOpen(false);
        loadEvents(); // Refresh events to update participant count
      } else {
        setMessage(data.error || 'Registration failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const openRegistrationDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
    setMessage('');
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      retreat: 'bg-purple-100 text-purple-800',
      'prayer-meeting': 'bg-blue-100 text-blue-800',
      outreach: 'bg-green-100 text-green-800',
      fellowship: 'bg-yellow-100 text-yellow-800',
      service: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventFull = (event: Event) => {
    return event.max_participants && event.current_participants >= event.max_participants;
  };

  const isEventPassed = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Events</h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join us for retreats, prayer meetings, and outreach programs. 
              Together, we build a stronger community of faith and service.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {message && (
            <Alert className={`mb-6 ${messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
            <p className="text-gray-600">
              Discover opportunities to connect, serve, and grow in faith with our community
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-12 text-center text-gray-500">
                      <img 
                        src="https://placehold.co/200x150?text=Calendar+with+upcoming+events+and+community+activities" 
                        alt="Calendar with upcoming events and community activities"
                        className="mx-auto mb-4 rounded-lg"
                      />
                      <p>No upcoming events scheduled. Check back soon!</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                events.map((event) => (
                  <Card 
                    key={event.id} 
                    className={`hover:shadow-lg transition-shadow ${isEventPassed(event.date) ? 'opacity-75' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={getEventTypeColor(event.event_type)}>
                          {event.event_type.replace('-', ' ').toUpperCase()}
                        </Badge>
                        {isEventFull(event) && (
                          <Badge variant="destructive">FULL</Badge>
                        )}
                        {isEventPassed(event.date) && (
                          <Badge variant="secondary">PAST</Badge>
                        )}
                      </div>
                      
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-blue-100 rounded flex-shrink-0"></span>
                          <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-green-100 rounded flex-shrink-0"></span>
                          <span>{event.location}</span>
                        </div>
                        {event.registration_required === 1 && (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-orange-100 rounded flex-shrink-0"></span>
                            <span>
                              {event.max_participants 
                                ? `${event.current_participants}/${event.max_participants} registered`
                                : `${event.current_participants} registered`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="text-gray-700 mb-4 line-clamp-3">
                        {event.description}
                      </CardDescription>
                      
                      {event.contact_info && (
                        <p className="text-xs text-gray-500 mb-4">
                          Contact: {event.contact_info}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        {event.registration_required === 1 && !isEventPassed(event.date) && !isEventFull(event) && (
                          <Button
                            onClick={() => openRegistrationDialog(event)}
                            className="flex-1"
                            size="sm"
                          >
                            Register Now
                          </Button>
                        )}
                        {!event.registration_required && (
                          <Button variant="outline" className="flex-1" size="sm">
                            No Registration Required
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Event Types Information */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Types of Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-purple-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-purple-800 mb-2">Retreats</h4>
                  <p className="text-sm text-gray-600">Spiritual renewal and reflection</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-blue-800 mb-2">Prayer Meetings</h4>
                  <p className="text-sm text-gray-600">Community prayer and worship</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Outreach</h4>
                  <p className="text-sm text-gray-600">Serving our community</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Fellowship</h4>
                  <p className="text-sm text-gray-600">Building community bonds</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-red-800 mb-2">Service</h4>
                  <p className="text-sm text-gray-600">Acts of love and charity</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Registration Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register for Event</DialogTitle>
              <DialogDescription>
                {selectedEvent?.title}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <Input
                  placeholder="Full Name *"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Any special requirements or questions? (Optional)"
                  value={registrationData.message}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </>
  );
}