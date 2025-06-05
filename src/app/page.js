'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Globe, Target, Zap, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();

  // Auto-redirect after a brief showcase (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment the line below for auto-redirect
      // router.push('/dashboard');
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [router]);

  const features = [
    {
      icon: BarChart3,
      title: 'Executive Summary',
      description: 'Comprehensive market overview with key metrics and insights'
    },
    {
      icon: Globe,
      title: 'Regional Analysis',
      description: 'Geographic breakdown and regional performance comparison'
    },
    {
      icon: Target,
      title: 'Market Segments',
      description: 'Granular segmentation analysis with growth opportunities'
    },
    {
      icon: TrendingUp,
      title: 'Growth Forecasting',
      description: 'Advanced modeling with scenario-based projections'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative px-6 py-20 mx-auto max-w-7xl">
          <div className="text-center">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900">MarketPro</h1>
                  <p className="text-sm text-gray-600">Research Dashboard</p>
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Professional Market
                <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Research Dashboard
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience comprehensive market analysis with interactive data visualization, 
                competitive intelligence, and advanced forecasting capabilities.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => router.push('/dashboard')}
              >
                Explore Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Sample Market Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              <Card className="bg-white/80 backdrop-blur-sm border-primary-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">$3.2B</div>
                  <div className="text-sm text-gray-600">Market Size 2032</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-secondary-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">11.8%</div>
                  <div className="text-sm text-gray-600">CAGR 2024-2032</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">5</div>
                  <div className="text-sm text-gray-600">Global Regions</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Market Intelligence
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our dashboard provides deep insights across all market dimensions with 
            professional-grade analytics and visualization tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="px-6 py-20 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white mb-8">
              <h4 className="text-2xl font-bold mb-4">
                Global Skin Boosters Market Analysis
              </h4>
              <p className="text-primary-100 mb-6">
                Comprehensive research covering market dynamics, competitive landscape, 
                and growth opportunities across global regions and market segments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">136+</div>
                  <div className="text-primary-200 text-sm">Data Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">25+</div>
                  <div className="text-primary-200 text-sm">Market Segments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">15+</div>
                  <div className="text-primary-200 text-sm">Key Players</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-xl font-semibold text-gray-900">
                What's Inside the Dashboard
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {[
                  'Interactive market size forecasting',
                  'Regional performance comparison',
                  'Segment-wise growth analysis',
                  'Competitive landscape mapping',
                  'Market trend identification',
                  'Export and reporting tools'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Button 
                size="lg" 
                className="px-8 py-3"
                onClick={() => router.push('/dashboard')}
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MarketPro</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional market research dashboard for data-driven decision making
            </p>
            <p className="text-sm text-gray-500">
              © 2024 MarketPro Analytics. Built with Next.js and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}