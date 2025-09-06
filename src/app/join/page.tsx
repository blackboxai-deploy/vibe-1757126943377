"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function JoinPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    interests: '',
    volunteer_areas: '',
    message: ''
  });

  const [selectedVolunteerAreas, setSelectedVolunteerAreas] = useState<string[]>([]);

  const volunteerOpportunities = [
    { id: 'prayer-ministry', label: 'Prayer Ministry', description: 'Lead prayer groups and intercession' },
    { id: 'youth-ministry', label: 'Youth Ministry', description: 'Mentor and guide young people' },
    { id: 'outreach', label: 'Community Outreach', description: 'Serve the local community' },
    { id: 'events', label: 'Event Planning', description: 'Organize retreats and gatherings' },
    { id: 'music', label: 'Music Ministry', description: 'Lead worship and praise' },
    { id: 'teaching', label: 'Faith Formation', description: 'Teach and share the faith' },
    { id: 'technology', label: 'Technology', description: 'Support digital ministry' },
    { id: 'hospitality', label: 'Hospitality', description: 'Welcome and serve others' }
  ];

  const handleVolunteerAreaChange = (areaId: string, checked: boolean) => {
    if (checked) {
      setSelectedVolunteerAreas(prev => [...prev, areaId]);
    } else {
      setSelectedVolunteerAreas(prev => prev.filter(id => id !== areaId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    if (!formData.name || !formData.email) {
      setMessage('Please fill in your name and email address');
      setMessageType('error');
      setSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        volunteer_areas: selectedVolunteerAreas.join(', ')
      };

      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you for your interest in joining Bellator Christo! We will contact you soon.');
        setMessageType('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          age: '',
          interests: '',
          volunteer_areas: '',
          message: ''
        });
        setSelectedVolunteerAreas([]);
      } else {
        setMessage(data.error || 'Failed to submit request');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Become a Warrior for Christ and join our community of believers dedicated to 
              prayer, service, fellowship, and justice. Your journey of faith starts here.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Join Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Join Bellator Christo</CardTitle>
                  <CardDescription>
                    Fill out this form to become part of our faith community. We'll reach out to welcome you personally.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      
                      <div>
                        <Input
                          placeholder="Full Name *"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Input
                          type="email"
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Input
                          type="tel"
                          placeholder="Phone Number (Optional)"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Input
                          type="number"
                          placeholder="Age (Optional)"
                          value={formData.age}
                          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                          min="13"
                          max="120"
                        />
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Your Interests</h3>
                      <Textarea
                        placeholder="Tell us about your interests in faith, ministry, or community involvement..."
                        value={formData.interests}
                        onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* Additional Message */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Additional Message</h3>
                      <Textarea
                        placeholder="Is there anything specific you'd like us to know about you or how you'd like to get involved?"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {message && (
                      <Alert className={messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                          {message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Join Our Community'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Volunteer Opportunities */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Opportunities</CardTitle>
                  <CardDescription>
                    Discover the many ways you can serve and make a difference in our community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {volunteerOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={opportunity.id}
                          checked={selectedVolunteerAreas.includes(opportunity.id)}
                          onCheckedChange={(checked) => 
                            handleVolunteerAreaChange(opportunity.id, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={opportunity.id} 
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            {opportunity.label}
                          </label>
                          <p className="text-sm text-gray-600 mt-1">
                            {opportunity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Welcome Contact</h4>
                        <p className="text-sm text-gray-600">
                          Someone from our team will reach out within 48 hours to welcome you personally
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Orientation Session</h4>
                        <p className="text-sm text-gray-600">
                          Join our monthly new member orientation to learn more about our mission
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Find Your Place</h4>
                        <p className="text-sm text-gray-600">
                          We'll help you discover where your gifts and passions align with our ministries
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Ongoing Support</h4>
                        <p className="text-sm text-gray-600">
                          Receive mentorship and support as you grow in faith and service
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>Our Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                      <div className="text-sm text-gray-600">Active Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">1,200+</div>
                      <div className="text-sm text-gray-600">Prayer Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">150+</div>
                      <div className="text-sm text-gray-600">Events Hosted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">50+</div>
                      <div className="text-sm text-gray-600">Volunteer Hours</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <img 
                      src="https://placehold.co/400x200?text=Community+volunteers+serving+together+in+joyful+fellowship+with+warm+lighting" 
                      alt="Community volunteers serving together in joyful fellowship with warm lighting"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Ready to Begin Your Journey?
                </h2>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Join hundreds of believers who have found their spiritual home at Bellator Christo. 
                  Together, we're building God's kingdom through prayer, service, fellowship, and justice.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Questions? Contact us at <strong>contact@bellatorchristo.org</strong> or call <strong>(555) 123-4567</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}