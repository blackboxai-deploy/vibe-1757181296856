'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function HomePage() {
  const [email, setEmail] = useState('')

  const features = [
    {
      title: 'AI-Powered Planning',
      description: 'Get personalized travel recommendations based on your preferences, budget, and travel style.',
      icon: '🤖',
      highlight: 'Smart recommendations'
    },
    {
      title: 'Budget Optimization',
      description: 'Real-time budget tracking with cost optimization suggestions to maximize your travel experience.',
      icon: '💰',
      highlight: 'Save up to 40%'
    },
    {
      title: 'Dynamic Itineraries',
      description: 'Auto-generated itineraries that adapt to your schedule, preferences, and local conditions.',
      icon: '📅',
      highlight: 'Fully customizable'
    },
    {
      title: 'Travel Rewards',
      description: 'Earn badges and achievements as you explore the world. Unlock new features and discounts.',
      icon: '🏆',
      highlight: '50+ achievements'
    },
    {
      title: 'Chat Assistant',
      description: 'Get instant answers to travel questions with our AI-powered chat assistant available 24/7.',
      icon: '💬',
      highlight: 'Always available'
    },
    {
      title: 'Offline Access',
      description: 'Download your itineraries and maps for offline access during your travels.',
      icon: '📱',
      highlight: 'No internet needed'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Solo Traveler',
      avatar: '👩‍💼',
      content: 'This app saved me $800 on my European backpacking trip! The budget optimization feature is incredible.',
      rating: 5,
      trip: 'Europe • 3 weeks'
    },
    {
      name: 'Mike Chen',
      role: 'Family Traveler',
      avatar: '👨‍👩‍👧‍👦',
      content: 'Planning our family vacation to Japan was so easy. The kids loved the gamification features!',
      rating: 5,
      trip: 'Japan • 10 days'
    },
    {
      name: 'Emma Davis',
      role: 'Digital Nomad',
      avatar: '👩‍💻',
      content: 'The AI assistant helped me find the perfect co-working spaces and budget accommodations.',
      rating: 5,
      trip: 'Southeast Asia • 6 months'
    }
  ]

  const stats = [
    { label: 'Active Travelers', value: '50K+', icon: '✈️' },
    { label: 'Countries Covered', value: '195', icon: '🌍' },
    { label: 'Money Saved', value: '$2M+', icon: '💸' },
    { label: 'Trips Planned', value: '100K+', icon: '🗺️' }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0">
          <img 
            src="https://placehold.co/1920x1080?text=Beautiful+travel+destination+with+mountains+sunset+and+serene+landscape"
            alt="Beautiful travel destination with mountains, sunset and serene landscape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              🎉 Now with AI Chat Assistant
            </Badge>
            
            <h1 className="text-4xl font-playfair font-bold tracking-tight sm:text-5xl md:text-6xl">
              Plan Your Perfect
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {' '}Budget Trip
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100">
              AI-powered travel planning that optimizes your budget, creates personalized itineraries, 
              and helps you discover amazing destinations while saving money.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3" asChild>
                <Link href="/plan">Start Planning Free</Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
                asChild
              >
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-blue-200">
              ✨ No credit card required • ⚡ Get started in 2 minutes
            </p>
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="relative mx-auto max-w-6xl px-4 -mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transform translate-y-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Smart Budget Planning</h3>
                <p className="text-sm text-blue-100">AI analyzes millions of travel data points</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white transform md:translate-y-4">
              <CardContent className="p-6">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Real-time Optimization</h3>
                <p className="text-sm text-blue-100">Instant updates and cost-saving alerts</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <div className="text-2xl mb-2">🌟</div>
                <h3 className="font-semibold mb-1">Gamified Experience</h3>
                <p className="text-sm text-blue-100">Earn rewards and unlock achievements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              ✨ Features
            </Badge>
            <h2 className="text-3xl font-playfair font-bold text-slate-900 dark:text-white sm:text-4xl">
              Everything You Need for the Perfect Trip
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Comprehensive travel planning tools powered by advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {feature.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              💬 Testimonials
            </Badge>
            <h2 className="text-3xl font-playfair font-bold text-slate-900 dark:text-white sm:text-4xl">
              Loved by Travelers Worldwide
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Real stories from our community of budget-conscious travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center border-slate-200 dark:border-slate-800">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-4 italic">
                    "{testimonial.content}"
                  </p>

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {testimonial.trip}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold sm:text-4xl">
            Ready to Start Your Adventure?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of travelers who have saved money and discovered amazing destinations
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6"
              onClick={() => {
                // Handle email signup
                console.log('Email signup:', email)
              }}
            >
              Get Started
            </Button>
          </div>

          <p className="mt-4 text-sm text-blue-200">
            Free forever. No spam, unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ST</span>
                </div>
                <span className="text-xl font-playfair font-semibold">Smart Travel Planner</span>
              </div>
              <p className="text-slate-400 mb-4">
                AI-powered travel planning for budget-conscious explorers. 
                Discover the world without breaking the bank.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🐦</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📘</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📷</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">💼</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-slate-800" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 Smart Travel Planner. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm">
              Made with ❤️ for travelers worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}