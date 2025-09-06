"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Prayer {
  id: number;
  title: string;
  content: string;
  category: string;
  submitted_by: string;
  created_at: string;
  is_anonymous: boolean;
}

interface JoinRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  interests: string;
  volunteer_areas: string;
  message: string;
  submitted_at: string;
}

export default function AdminPage() {
  const [pendingPrayers, setPendingPrayers] = useState<Prayer[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Event creation form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_type: '',
    date: '',
    time: '',
    location: '',
    contact_info: '',
    registration_required: false,
    max_participants: ''
  });

  // Reflection creation form
  const [reflectionForm, setReflectionForm] = useState({
    title: '',
    content: '',
    scripture_reference: '',
    category: '',
    is_daily: false,
    publish_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadPendingPrayers();
    loadJoinRequests();
  }, []);

  const loadPendingPrayers = async () => {
    try {
      // Note: In a real app, you'd need authentication
      const response = await fetch('/api/prayers?pending=true');
      const data = await response.json();
      if (response.ok) {
        setPendingPrayers(data.prayers);
      }
    } catch (error) {
      console.error('Error loading pending prayers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJoinRequests = async () => {
    try {
      // Note: In a real app, you'd need authentication
      const response = await fetch('/api/join');
      const data = await response.json();
      if (response.ok) {
        setJoinRequests(data.join_requests);
      }
    } catch (error) {
      console.error('Error loading join requests:', error);
    }
  };

  const approvePrayer = async (prayerId: number) => {
    try {
      const response = await fetch('/api/prayers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prayer_id: prayerId,
          action: 'approve'
        }),
      });

      if (response.ok) {
        setMessage('Prayer approved successfully');
        setMessageType('success');
        loadPendingPrayers();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to approve prayer');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventForm,
          max_participants: eventForm.max_participants ? parseInt(eventForm.max_participants) : null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Event created successfully');
        setMessageType('success');
        setEventForm({
          title: '',
          description: '',
          event_type: '',
          date: '',
          time: '',
          location: '',
          contact_info: '',
          registration_required: false,
          max_participants: ''
        });
      } else {
        setMessage(data.error || 'Failed to create event');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
  };

  const createReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reflectionForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Reflection created successfully');
        setMessageType('success');
        setReflectionForm({
          title: '',
          content: '',
          scripture_reference: '',
          category: '',
          is_daily: false,
          publish_date: new Date().toISOString().split('T')[0]
        });
      } else {
        setMessage(data.error || 'Failed to create reflection');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-800 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Admin Panel</h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Manage community content, approve prayer requests, create events, and oversee the Bellator Christo platform.
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

          <Tabs defaultValue="prayers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="prayers">Prayer Requests</TabsTrigger>
              <TabsTrigger value="events">Create Event</TabsTrigger>
              <TabsTrigger value="reflections">Create Reflection</TabsTrigger>
              <TabsTrigger value="members">Join Requests</TabsTrigger>
            </TabsList>

            {/* Prayer Requests Management */}
            <TabsContent value="prayers">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Prayer Requests</CardTitle>
                  <CardDescription>
                    Review and approve prayer requests before they appear publicly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse border rounded-lg p-4">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingPrayers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No pending prayer requests</p>
                      ) : (
                        pendingPrayers.map((prayer) => (
                          <div key={prayer.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-orange-100 text-orange-800">
                                {prayer.category.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatDate(prayer.created_at)}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold">{prayer.title}</h3>
                            <p className="text-gray-700">{prayer.content}</p>
                            
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-sm text-gray-600">
                                By: {prayer.is_anonymous ? 'Anonymous' : prayer.submitted_by}
                              </span>
                              <Button
                                onClick={() => approvePrayer(prayer.id)}
                                size="sm"
                              >
                                Approve Prayer
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Event Creation */}
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Event</CardTitle>
                  <CardDescription>
                    Add upcoming retreats, prayer meetings, and community events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createEvent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          placeholder="Event Title *"
                          value={eventForm.title}
                          onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Select
                          value={eventForm.event_type}
                          onValueChange={(value) => setEventForm(prev => ({ ...prev, event_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Event Type *" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retreat">Retreat</SelectItem>
                            <SelectItem value="prayer-meeting">Prayer Meeting</SelectItem>
                            <SelectItem value="outreach">Outreach Program</SelectItem>
                            <SelectItem value="fellowship">Fellowship</SelectItem>
                            <SelectItem value="service">Service Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Textarea
                        placeholder="Event Description *"
                        value={eventForm.description}
                        onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Input
                          type="time"
                          value={eventForm.time}
                          onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Input
                        placeholder="Event Location *"
                        value={eventForm.location}
                        onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Contact Information (Email/Phone)"
                        value={eventForm.contact_info}
                        onChange={(e) => setEventForm(prev => ({ ...prev, contact_info: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="registration"
                          checked={eventForm.registration_required}
                          onCheckedChange={(checked) => 
                            setEventForm(prev => ({ ...prev, registration_required: checked as boolean }))
                          }
                        />
                        <label htmlFor="registration" className="text-sm">
                          Registration Required
                        </label>
                      </div>

                      {eventForm.registration_required && (
                        <div>
                          <Input
                            type="number"
                            placeholder="Maximum Participants (Optional)"
                            value={eventForm.max_participants}
                            onChange={(e) => setEventForm(prev => ({ ...prev, max_participants: e.target.value }))}
                            min="1"
                          />
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      Create Event
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reflection Creation */}
            <TabsContent value="reflections">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Reflection</CardTitle>
                  <CardDescription>
                    Write daily reflections, meditations, and spiritual insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createReflection} className="space-y-6">
                    <div>
                      <Input
                        placeholder="Reflection Title *"
                        value={reflectionForm.title}
                        onChange={(e) => setReflectionForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Select
                          value={reflectionForm.category}
                          onValueChange={(value) => setReflectionForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category *" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="youth">Youth</SelectItem>
                            <SelectItem value="meditation">Meditation</SelectItem>
                            <SelectItem value="scripture">Scripture</SelectItem>
                            <SelectItem value="inspiration">Inspiration</SelectItem>
                            <SelectItem value="teaching">Teaching</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Input
                          type="date"
                          value={reflectionForm.publish_date}
                          onChange={(e) => setReflectionForm(prev => ({ ...prev, publish_date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Input
                        placeholder="Scripture Reference (e.g., Matthew 5:16)"
                        value={reflectionForm.scripture_reference}
                        onChange={(e) => setReflectionForm(prev => ({ ...prev, scripture_reference: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Textarea
                        placeholder="Reflection Content *"
                        value={reflectionForm.content}
                        onChange={(e) => setReflectionForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="daily"
                        checked={reflectionForm.is_daily}
                        onCheckedChange={(checked) => 
                          setReflectionForm(prev => ({ ...prev, is_daily: checked as boolean }))
                        }
                      />
                      <label htmlFor="daily" className="text-sm">
                        Set as Daily Reflection
                      </label>
                    </div>

                    <Button type="submit" className="w-full">
                      Publish Reflection
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Join Requests */}
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>New Member Requests</CardTitle>
                  <CardDescription>
                    Review applications from people who want to join the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {joinRequests.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No pending join requests</p>
                    ) : (
                      joinRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{request.name}</h3>
                              <p className="text-gray-600">{request.email}</p>
                              {request.phone && (
                                <p className="text-gray-600">{request.phone}</p>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(request.submitted_at)}
                            </span>
                          </div>

                          {request.age && (
                            <p className="text-sm text-gray-600">
                              <strong>Age:</strong> {request.age}
                            </p>
                          )}

                          {request.interests && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Interests:</h4>
                              <p className="text-gray-700 text-sm">{request.interests}</p>
                            </div>
                          )}

                          {request.volunteer_areas && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Volunteer Areas:</h4>
                              <p className="text-gray-700 text-sm">{request.volunteer_areas}</p>
                            </div>
                          )}

                          {request.message && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Message:</h4>
                              <p className="text-gray-700 text-sm">{request.message}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button size="sm">Contact Member</Button>
                            <Button variant="outline" size="sm">Mark as Processed</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}