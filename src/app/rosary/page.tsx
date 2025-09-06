"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { rosaryData, rosaryPrayers, getDailyMystery, RosarySet, RosaryMystery } from '@/lib/rosary-data';

export default function RosaryPage() {
  const [selectedSet, setSelectedSet] = useState<RosarySet>(getDailyMystery());
  const [currentMystery, setCurrentMystery] = useState(0);
  const [currentBead, setCurrentBead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const resetRosary = () => {
    setCurrentMystery(0);
    setCurrentBead(0);
    setTimer(0);
    setTimerActive(false);
    setIsPlaying(false);
  };

  const startTimer = () => {
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const nextBead = () => {
    if (currentBead < 53) { // Total beads in rosary
      setCurrentBead(prev => prev + 1);
    }
  };

  const nextMystery = () => {
    if (currentMystery < 4) {
      setCurrentMystery(prev => prev + 1);
    } else {
      // Completed all mysteries
      setTimerActive(false);
      alert('Congratulations! You have completed the rosary. May God bless you.');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getBeadType = (beadIndex: number) => {
    // Rosary structure: Cross, 3 Hail Marys, Our Father, then 5 decades of (Our Father + 10 Hail Marys)
    if (beadIndex === 0) return 'cross';
    if (beadIndex <= 3) return 'hail-mary';
    if (beadIndex === 4) return 'our-father';
    
    // Calculate decade position
    const decadePosition = (beadIndex - 5) % 11;
    if (decadePosition === 0) return 'our-father';
    return 'hail-mary';
  };

  const getCurrentPrayer = () => {
    const beadType = getBeadType(currentBead);
    switch (beadType) {
      case 'cross':
        return rosaryPrayers.signOfCross;
      case 'our-father':
        return rosaryPrayers.ourFather;
      case 'hail-mary':
        return rosaryPrayers.hailMary;
      default:
        return '';
    }
  };

  const progress = ((currentMystery * 20) + Math.min(currentBead / 53 * 20, 20));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Digital Rosary</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Pray the rosary with guided meditations and scripture reflections. 
              Let Mary lead you closer to her Son, Jesus Christ.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rosary Controls */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Rosary Prayer</CardTitle>
                  <CardDescription>
                    Today's recommended: {selectedSet.name} ({selectedSet.day})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mystery Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Choose Mystery Set
                    </label>
                    <Select
                      value={selectedSet.name}
                      onValueChange={(value) => {
                        const set = rosaryData.find(s => s.name === value);
                        if (set) {
                          setSelectedSet(set);
                          resetRosary();
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rosaryData.map((set) => (
                          <SelectItem key={set.name} value={set.name}>
                            <span className={set.color}>{set.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    <div className="text-3xl font-mono font-bold text-blue-600 mb-2">
                      {formatTime(timer)}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startTimer}
                        disabled={timerActive}
                      >
                        Start
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={pauseTimer}
                        disabled={!timerActive}
                      >
                        Pause
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetRosary}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Current Prayer */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium text-gray-900 mb-2">Current Prayer:</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {getCurrentPrayer()}
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    <Button onClick={nextBead} className="flex-1">
                      Next Bead
                    </Button>
                    <Button onClick={nextMystery} variant="outline" className="flex-1">
                      Next Mystery
                    </Button>
                  </div>

                  {/* Bead Counter */}
                  <div className="text-center text-sm text-gray-600">
                    Bead {currentBead + 1} of 54 | Mystery {currentMystery + 1} of 5
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mystery Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="mystery" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="mystery">Current Mystery</TabsTrigger>
                  <TabsTrigger value="prayers">Common Prayers</TabsTrigger>
                  <TabsTrigger value="beads">Rosary Guide</TabsTrigger>
                </TabsList>

                <TabsContent value="mystery" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${selectedSet.color.replace('text-', 'bg-')}`}></div>
                        <div>
                          <CardTitle className={selectedSet.color}>
                            {selectedSet.name} - Mystery {currentMystery + 1}
                          </CardTitle>
                          <CardDescription>
                            {selectedSet.mysteries[currentMystery]?.name}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedSet.mysteries[currentMystery] && (
                        <div className="space-y-6">
                          <div>
                            <img 
                              src="https://placehold.co/600x300?text=Beautiful+religious+artwork+depicting+the+mystery+with+warm+golden+lighting" 
                              alt={`Religious artwork depicting ${selectedSet.mysteries[currentMystery].name}`}
                              className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Scripture Reference</h4>
                            <p className="text-blue-600 font-medium">
                              {selectedSet.mysteries[currentMystery].scripture}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Reflection</h4>
                            <p className="text-gray-700 leading-relaxed">
                              {selectedSet.mysteries[currentMystery].reflection}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Meditation Questions</h4>
                            <p className="text-gray-700 leading-relaxed">
                              {selectedSet.mysteries[currentMystery].meditation}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="prayers" className="mt-6">
                  <div className="space-y-4">
                    {Object.entries(rosaryPrayers).map(([key, prayer]) => (
                      <Card key={key}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed">{prayer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="beads" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>How to Pray the Rosary</CardTitle>
                      <CardDescription>A step-by-step guide to rosary prayer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">1. Begin with the Cross</h4>
                          <p className="text-gray-700 text-sm">Make the Sign of the Cross and pray the Apostles' Creed</p>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">2. Opening Prayers</h4>
                          <p className="text-gray-700 text-sm">Pray one Our Father, three Hail Marys, and one Glory Be</p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">3. The Five Decades</h4>
                          <p className="text-gray-700 text-sm">For each mystery: announce the mystery, pray one Our Father, ten Hail Marys, and one Glory Be, followed by the Fatima Prayer</p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">4. Conclude</h4>
                          <p className="text-gray-700 text-sm">End with the Hail Holy Queen and closing prayers</p>
                        </div>

                        <div className="mt-6">
                          <img 
                            src="https://placehold.co/500x400?text=Traditional+rosary+diagram+showing+bead+sequence+and+prayer+structure" 
                            alt="Traditional rosary diagram showing bead sequence and prayer structure"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}