import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  BoltIcon,
  LockClosedIcon,
  EyeIcon,
  ServerIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function LandingPage() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Real-Time Detection',
      description: 'Monitor and detect SYN flood attacks in real-time with advanced ML algorithms'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Comprehensive visualizations and insights from your network traffic data'
    },
    {
      icon: BoltIcon,
      title: 'Lightweight & Fast',
      description: 'Optimized for IoT devices with minimal resource consumption'
    },
    {
      icon: LockClosedIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with MongoDB-backed data persistence'
    },
    {
      icon: EyeIcon,
      title: 'Visual Dashboard',
      description: 'Beautiful, intuitive dashboard to track and analyze attack patterns'
    },
    {
      icon: ServerIcon,
      title: 'Scalable Architecture',
      description: 'Built to handle high-volume traffic analysis and multiple attack sessions'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Detection Accuracy' },
    { value: '< 50ms', label: 'Response Time' },
    { value: '24/7', label: 'Monitoring' },
    { value: '170+', label: 'Visualizations' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
            <span className="text-2xl font-bold text-white">IDS</span>
          </div>
          <Link
            to="/login"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
              <CheckCircleIcon className="h-5 w-5 text-indigo-400" />
              <span className="text-sm text-indigo-300">SYN Flood Detection System</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Protect Your IoT
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Infrastructure
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Advanced Intrusion Detection System powered by Machine Learning.
              Detect, analyze, and visualize SYN flood attacks in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="group px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="text-4xl font-bold text-indigo-400 mb-2">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to detect and analyze network intrusions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-indigo-500/50 transition-all transform hover:scale-105"
            >
              <div className="inline-flex p-4 bg-indigo-500/10 rounded-lg mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <feature.icon className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Built with Modern Technology</h2>
            <p className="text-gray-300 text-lg">Leveraging the best tools for performance and reliability</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Machine Learning',
              'React & TypeScript',
              'MongoDB',
              'Express.js',
              'LightGBM',
              'XGBoost',
              'Real-time Analytics',
              'Cloud Ready'
            ].map((tech, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-colors"
              >
                <span className="text-gray-300 font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Start monitoring your network and detecting threats in real-time
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            <span>Access Dashboard</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 Intrusion Detection System. Built with ❤️ for IoT Security.</p>
        </div>
      </footer>
    </div>
  );
}
