"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Reflection {
  id: number;
  title: string;
  content: string;
  scripture_reference: string;
  category: string;
  author: string;
  is_daily: number;
  publish_date: string;
  created_at: string;
}

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [dailyReflection, setDailyReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadReflections();
    loadDailyReflection();
  }, []);

  const loadReflections = async () => {
    try {
      const response = await fetch('/api/reflections');
      const data = await response.json();
      if (response.ok) {
        setReflections(data.reflections);
      }
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyReflection = async () => {
    try {
      const response = await fetch('/api/reflections?daily=true');
      const data = await response.json();
      if (response.ok) {
        setDailyReflection(data.reflection);
      }
    } catch (error) {
      console.error('Error loading daily reflection:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-blue-100 text-blue-800',
      youth: 'bg-purple-100 text-purple-800',
      meditation: 'bg-green-100 text-green-800',
      scripture: 'bg-yellow-100 text-yellow-800',
      inspiration: 'bg-pink-100 text-pink-800',
      teaching: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = ['all', 'daily', 'youth', 'meditation', 'scripture', 'inspiration', 'teaching'];

  const filteredReflections = selectedCategory === 'all' 
    ? reflections 
    : reflections.filter(r => r.category === selectedCategory);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Daily Reflections</h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Nourish your soul with daily scripture, meditations, and spiritual insights. 
              Let God's word guide your journey of faith and transformation.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Today's Daily Reflection */}
          {dailyReflection && (
            <div className="mb-12">
              <Card className="border-2 border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-600 text-white">TODAY'S REFLECTION</Badge>
                    <span className="text-sm text-gray-600">
                      {formatDate(dailyReflection.publish_date)}
                    </span>
                  </div>
                  <CardTitle className="text-2xl text-blue-900">
                    {dailyReflection.title}
                  </CardTitle>
                  {dailyReflection.scripture_reference && (
                    <CardDescription className="text-blue-700 font-medium">
                      Scripture: {dailyReflection.scripture_reference}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <img 
                      src="https://placehold.co/800x400?text=Peaceful+sunrise+over+mountains+with+open+Bible+and+golden+light" 
                      alt="Peaceful sunrise over mountains with open Bible and golden light"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {dailyReflection.content}
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                    By {dailyReflection.author}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reflections Archive */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Reflection Archive
            </h2>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-xs sm:text-sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
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
                            <div className="h-32 bg-gray-200 rounded mb-4"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredReflections.length === 0 ? (
                        <div className="col-span-full">
                          <Card>
                            <CardContent className="p-12 text-center text-gray-500">
                              <img 
                                src="https://placehold.co/200x150?text=Open+journal+with+pen+and+peaceful+reading+space" 
                                alt="Open journal with pen and peaceful reading space"
                                className="mx-auto mb-4 rounded-lg"
                              />
                              <p>No reflections found in this category. Check back soon!</p>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        filteredReflections.map((reflection) => (
                          <Card key={reflection.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getCategoryColor(reflection.category)}>
                                  {reflection.category.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatDate(reflection.publish_date)}
                                </span>
                              </div>
                              
                              <CardTitle className="text-xl line-clamp-2">
                                {reflection.title}
                              </CardTitle>
                              
                              {reflection.scripture_reference && (
                                <CardDescription className="text-blue-600 font-medium">
                                  {reflection.scripture_reference}
                                </CardDescription>
                              )}
                            </CardHeader>
                            
                            <CardContent>
                              <div className="mb-4">
                                <img 
                                  src="https://placehold.co/400x200?text=Serene+prayer+corner+with+soft+lighting+and+spiritual+books" 
                                  alt="Serene prayer corner with soft lighting and spiritual books"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                              
                              <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 mb-4">
                                {reflection.content}
                              </p>
                              
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>By {reflection.author}</span>
                                {reflection.is_daily === 1 && (
                                  <Badge variant="outline" className="text-xs">
                                    Daily
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Reflection Categories Info */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Types of Reflections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-blue-800 mb-2">Daily Reflections</h4>
                  <p className="text-sm text-gray-600">
                    Start each day with inspired meditations and scripture
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-purple-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-purple-800 mb-2">Youth Focus</h4>
                  <p className="text-sm text-gray-600">
                    Relevant insights for young people navigating faith and life
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Meditation Guides</h4>
                  <p className="text-sm text-gray-600">
                    Contemplative practices to deepen your spiritual journey
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Scripture Study</h4>
                  <p className="text-sm text-gray-600">
                    Deep dives into God's word with practical applications
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-pink-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-pink-800 mb-2">Inspiration</h4>
                  <p className="text-sm text-gray-600">
                    Uplifting messages to encourage and strengthen your faith
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-6 h-6 bg-indigo-500 rounded"></div>
                  </div>
                  <h4 className="font-semibold text-indigo-800 mb-2">Teaching</h4>
                  <p className="text-sm text-gray-600">
                    Educational content to grow in understanding of the faith
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}