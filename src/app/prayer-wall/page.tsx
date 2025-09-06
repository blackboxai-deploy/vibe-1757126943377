"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Prayer {
  id: number;
  title: string;
  content: string;
  category: string;
  submitted_by: string;
  support_count: number;
  created_at: string;
  is_anonymous: boolean;
}

export default function PrayerWallPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [supportedPrayers, setSupportedPrayers] = useState<Set<number>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    submitted_by: '',
    email: '',
    is_anonymous: false
  });

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      const response = await fetch('/api/prayers');
      const data = await response.json();
      if (response.ok) {
        setPrayers(data.prayers);
      }
    } catch (error) {
      console.error('Error loading prayers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    if (!formData.title || !formData.content || !formData.category || !formData.submitted_by) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Prayer request submitted successfully! It will be reviewed before appearing publicly.');
        setMessageType('success');
        setFormData({
          title: '',
          content: '',
          category: '',
          submitted_by: '',
          email: '',
          is_anonymous: false
        });
      } else {
        setMessage(data.error || 'Failed to submit prayer request');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrayerSupport = async (prayerId: number) => {
    if (supportedPrayers.has(prayerId)) return;

    try {
      const response = await fetch('/api/prayers/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prayer_id: prayerId }),
      });

      const data = await response.json();

      if (response.ok && !data.already_supported) {
        setPrayers(prev => 
          prev.map(prayer => 
            prayer.id === prayerId 
              ? { ...prayer, support_count: prayer.support_count + 1 }
              : prayer
          )
        );
        setSupportedPrayers(prev => new Set(prev).add(prayerId));
      }
    } catch (error) {
      console.error('Error supporting prayer:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: 'bg-red-100 text-red-800',
      family: 'bg-blue-100 text-blue-800',
      guidance: 'bg-purple-100 text-purple-800',
      thanksgiving: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
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
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Interactive Prayer Wall</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Share your prayer requests and support others in their spiritual journey. 
              Together, we lift each other up in faith and love.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prayer Submission Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Submit a Prayer Request</CardTitle>
                  <CardDescription>
                    Share your prayer intention with our community. All requests are reviewed before being posted.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Prayer Title *"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category *" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">Health & Healing</SelectItem>
                          <SelectItem value="family">Family & Relationships</SelectItem>
                          <SelectItem value="guidance">Guidance & Wisdom</SelectItem>
                          <SelectItem value="thanksgiving">Thanksgiving & Praise</SelectItem>
                          <SelectItem value="general">General Prayer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Textarea
                        placeholder="Share your prayer request... *"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Your Name *"
                        value={formData.submitted_by}
                        onChange={(e) => setFormData(prev => ({ ...prev, submitted_by: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email (Optional)"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.is_anonymous}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, is_anonymous: checked as boolean }))
                        }
                      />
                      <label htmlFor="anonymous" className="text-sm text-gray-600">
                        Post anonymously
                      </label>
                    </div>

                    {message && (
                      <Alert className={messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                          {message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Prayer Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Prayer List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Prayer Requests</h2>
                <p className="text-gray-600">
                  {prayers.length} prayer{prayers.length !== 1 ? 's' : ''} shared by our community
                </p>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {prayers.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-gray-500">
                        No approved prayer requests yet. Be the first to share!
                      </CardContent>
                    </Card>
                  ) : (
                    prayers.map((prayer) => (
                      <Card key={prayer.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(prayer.category)}`}>
                              {prayer.category.charAt(0).toUpperCase() + prayer.category.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(prayer.created_at)}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {prayer.title}
                          </h3>
                          
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {prayer.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              ~ {prayer.is_anonymous ? 'Anonymous' : prayer.submitted_by}
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrayerSupport(prayer.id)}
                              disabled={supportedPrayers.has(prayer.id)}
                              className={supportedPrayers.has(prayer.id) ? 'bg-blue-50 text-blue-600' : ''}
                            >
                              {supportedPrayers.has(prayer.id) ? 'Prayed' : 'I Prayed'} ({prayer.support_count})
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}