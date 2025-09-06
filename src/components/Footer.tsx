import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">BC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Bellator Christo</h3>
                <p className="text-sm text-gray-400">Warriors for Christ</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A digital sanctuary for faith-based community engagement, bringing together believers 
              in prayer, service, fellowship, and justice through our Lord Jesus Christ.
            </p>
            <div className="flex space-x-4">
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Email: contact@bellatorchristo.org
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/prayer-wall" className="text-gray-300 hover:text-white transition-colors">
                  Prayer Wall
                </Link>
              </li>
              <li>
                <Link href="/rosary" className="text-gray-300 hover:text-white transition-colors">
                  Digital Rosary
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/reflections" className="text-gray-300 hover:text-white transition-colors">
                  Daily Reflections
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/join" className="text-gray-300 hover:text-white transition-colors">
                  Join Our Mission
                </Link>
              </li>
              <li>
                <span className="text-gray-300">
                  Volunteer Opportunities
                </span>
              </li>
              <li>
                <span className="text-gray-300">
                  Youth Ministry
                </span>
              </li>
              <li>
                <span className="text-gray-300">
                  Prayer Groups
                </span>
              </li>
              <li>
                <span className="text-gray-300">
                  Outreach Programs
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Bellator Christo. All rights reserved.
            </div>
            
            {/* Four Pillars */}
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <span className="text-yellow-400 font-medium">Prayer</span>
              <span className="text-green-400 font-medium">Service</span>
              <span className="text-blue-400 font-medium">Fellowship</span>
              <span className="text-red-400 font-medium">Justice</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              Built with faith and love
            </div>
          </div>
          
          {/* Bible Verse */}
          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-blue-300 italic text-sm">
              "For where two or three gather in my name, there am I with them." - Matthew 18:20
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}