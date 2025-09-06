import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <img 
                src="https://placehold.co/400x300?text=Peaceful+church+sanctuary+with+stained+glass+windows+and+warm+golden+light" 
                alt="Peaceful church sanctuary with stained glass windows and warm golden light"
                className="mx-auto rounded-lg shadow-2xl mb-8 max-w-md w-full h-64 object-cover"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Bellator Christo
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Warriors for Christ - A Digital Sanctuary for Faith-Based Community Engagement
            </p>
            <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
              Join our community of believers as we grow together in prayer, service, fellowship, and justice. 
              Experience the power of faith through our interactive prayer wall, digital rosary, and community events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/prayer-wall">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                  Join Prayer Wall
                </Button>
              </Link>
              <Link href="/join">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8">
                  Join Our Community
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Bellator Christo, we are called to be Warriors for Christ, building a vibrant digital community 
              where believers can deepen their faith, support one another in prayer, and actively participate in 
              God's mission of love and justice in the world. Through prayer, service, fellowship, and justice, 
              we strive to create a sanctuary where every soul can encounter the living God and grow in discipleship.
            </p>
          </div>
        </section>

        {/* Four Spiritual Pillars */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Our Four Spiritual Pillars
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              These foundational principles guide our community and shape every aspect of our ministry
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Prayer Pillar */}
              <Card className="text-center border-t-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  </div>
                  <CardTitle className="text-yellow-600">Prayer</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Connect with God through personal and communal prayer. Share your intentions on our prayer wall 
                    and experience the power of community intercession.
                  </CardDescription>
                  <Link href="/prayer-wall" className="inline-block mt-4">
                    <Button variant="outline" size="sm">
                      Prayer Wall
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Service Pillar */}
              <Card className="text-center border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  </div>
                  <CardTitle className="text-green-600">Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Live out Christ's love through acts of service. Join our outreach programs and volunteer 
                    opportunities to make a real difference in our community.
                  </CardDescription>
                  <Link href="/events" className="inline-block mt-4">
                    <Button variant="outline" size="sm">
                      Service Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Fellowship Pillar */}
              <Card className="text-center border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  </div>
                  <CardTitle className="text-blue-600">Fellowship</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Build meaningful relationships with fellow believers. Participate in community events, 
                    prayer meetings, and fellowship gatherings.
                  </CardDescription>
                  <Link href="/events" className="inline-block mt-4">
                    <Button variant="outline" size="sm">
                      Fellowship Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Justice Pillar */}
              <Card className="text-center border-t-4 border-red-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  </div>
                  <CardTitle className="text-red-600">Justice</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    Advocate for the marginalized and work towards a more just society. Stand with the oppressed 
                    and fight for dignity and equality for all God's children.
                  </CardDescription>
                  <Link href="/join" className="inline-block mt-4">
                    <Button variant="outline" size="sm">
                      Join the Fight
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Explore Our Digital Sanctuary
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Prayer Wall Preview */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img 
                    src="https://placehold.co/400x200?text=Hands+joined+in+prayer+circle+with+soft+candlelight" 
                    alt="Hands joined in prayer circle with soft candlelight"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>Interactive Prayer Wall</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Submit your prayer requests and support others in their spiritual journey. 
                    Experience the power of communal prayer and intercession.
                  </CardDescription>
                  <Link href="/prayer-wall" className="inline-block mt-4">
                    <Button>Visit Prayer Wall</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Digital Rosary Preview */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img 
                    src="https://placehold.co/400x200?text=Beautiful+rosary+beads+on+open+Bible+with+peaceful+lighting" 
                    alt="Beautiful rosary beads on open Bible with peaceful lighting"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>Digital Rosary</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Pray the rosary with guided meditations, scripture reflections, and optional audio. 
                    Deepen your Marian devotion with our interactive rosary experience.
                  </CardDescription>
                  <Link href="/rosary" className="inline-block mt-4">
                    <Button>Pray the Rosary</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Daily Reflections Preview */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img 
                    src="https://placehold.co/400x200?text=Open+Bible+with+morning+sunlight+streaming+through+window" 
                    alt="Open Bible with morning sunlight streaming through window"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>Daily Reflections</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Start each day with spiritual nourishment through daily scripture, meditations, 
                    and youth-focused reflections to guide your faith journey.
                  </CardDescription>
                  <Link href="/reflections" className="inline-block mt-4">
                    <Button>Read Reflections</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community Today</h2>
            <p className="text-xl text-blue-100 mb-8">
              Be part of a growing community of faith warriors committed to prayer, service, fellowship, and justice. 
              Together, we can make a difference in the world through Christ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Join Our Mission
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Upcoming Events
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}