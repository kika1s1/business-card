import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Palette, 
  Download, 
  Users,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Check
} from 'lucide-react';
import { Button } from '../components/ui';
import { ROUTES } from '../utils/constants';

const Home = () => {
  const features = [
    {
      icon: <Palette className="h-8 w-8 text-primary-600" />,
      title: 'Professional Templates',
      description: 'Choose from 5+ professionally designed templates categorized by industry and profession.'
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: 'Real-time Preview',
      description: 'See your changes instantly with our live preview feature. No waiting, no delays.'
    },
    {
      icon: <Download className="h-8 w-8 text-primary-600" />,
      title: 'High-Quality Export',
      description: 'Download print-ready PNG and PDF files at 300 DPI with perfect dimensions.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Multiple Variations',
      description: 'Create and manage multiple business card variations for different purposes.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Secure & Private',
      description: 'Your data is secure with enterprise-grade security and privacy protection.'
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary-600" />,
      title: 'Easy Customization',
      description: 'Customize colors, fonts, layouts, and content with our intuitive editor.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      content: 'CardBuilder made creating professional business cards so easy. The templates are beautiful and the export quality is perfect.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Designer',
      company: 'Creative Studio',
      content: 'As a designer, I appreciate the attention to detail in the templates. The customization options are exactly what I needed.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Small Business Owner',
      company: 'Local Bakery',
      content: 'Quick, professional, and affordable. I had my business cards ready in minutes instead of days.',
      rating: 5
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '5 business cards per month',
        'Basic templates',
        'PNG export',
        'Standard support'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      features: [
        'Unlimited business cards',
        'All premium templates',
        'PNG & PDF export',
        'Priority support',
        'Custom branding',
        'Batch export'
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Business',
      price: '$29',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin dashboard',
        'Analytics & insights',
        'Custom templates',
        'API access'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Create stunning</span>{' '}
                    <span className="block text-primary-600 xl:inline">business cards</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Design professional business cards in minutes with our easy-to-use editor. 
                    Choose from beautiful templates, customize to your needs, and download 
                    print-ready files instantly.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link to={ROUTES.REGISTER}>
                        <Button size="lg" className="w-full flex items-center justify-center">
                          Get started free
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Button variant="outline" size="lg">
                        View templates
                      </Button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 transform rotate-12 scale-90">
              <div className="bg-white rounded-lg shadow-xl p-6 w-64 h-40">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full"></div>
                  <div className="text-right">
                    <div className="w-20 h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="w-16 h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  <div className="w-28 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 w-64 h-40 transform translate-y-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full"></div>
                  <div className="text-right">
                    <div className="w-20 h-3 bg-gray-700 rounded mb-2"></div>
                    <div className="w-16 h-2 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-600 rounded"></div>
                  <div className="w-24 h-3 bg-gray-700 rounded"></div>
                  <div className="w-28 h-3 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to create perfect business cards
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools and features you need to design, 
              customize, and export professional business cards.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-50">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by professionals worldwide
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                See what our users have to say about CardBuilder
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Choose the right plan for you
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Start free and upgrade as you grow
            </p>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
            {plans.map((plan, index) => (
              <div key={index} className={`rounded-lg shadow-lg divide-y divide-gray-200 ${plan.popular ? 'ring-2 ring-primary-500' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="bg-primary-500 text-white text-center py-2 rounded-t-lg">
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h2>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/{plan.period}</span>
                  </p>
                  <Button className="mt-8 w-full" variant={plan.popular ? 'primary' : 'outline'}>
                    {plan.cta}
                  </Button>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h3>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex space-x-3">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join thousands of professionals who trust CardBuilder for their business card needs.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" variant="secondary">
                Create your first card
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-700">
              View examples
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 