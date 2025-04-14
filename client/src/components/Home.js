import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ total: 0, applied: 0, interviews: 0 });
  const [testimonials] = useState([
    {
      id: 1,
      text: "This tracker helped me land my dream internship at Google. I was able to stay organized throughout the entire process!",
      author: "Alex Johnson",
      role: "Computer Science Student"
    },
    {
      id: 2,
      text: "I applied to over 50 internships and this tool made it so much easier to keep track of everything. Highly recommend!",
      author: "Maya Patel",
      role: "Data Science Major"
    },
    {
      id: 3,
      text: "The reminder feature saved me from missing several application deadlines. This is a must-have for any student.",
      author: "Carlos Rodriguez",
      role: "Engineering Student"
    }
  ]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setStats({
        total: 12,
        applied: 8,
        interviews: 3
      });
    }, 500);
    
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(testimonialTimer);
    };
  }, [testimonials.length]);
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      title: "Application Tracking",
      description: "Keep all your internship applications in one place with status updates and notes."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: "Deadline Reminders",
      description: "Never miss an important deadline with custom email and notification reminders."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: "Interview Preparation",
      description: "Access resources and tips to help you prepare for your upcoming interviews."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar onOpenAddModal={() => {}} />

      <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-indigo-600">Trackship</span>
                <span className="block mt-2">Organize Your Funture</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl">
                Track your applications, stay on top of deadlines, and never miss an opportunity. 
                The smart way to manage your internship search.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/signin')}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2 lg:flex lg:justify-end">
              <div className="relative lg:h-96 lg:w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl transform -rotate-6 rounded-3xl opacity-50"></div>
                <div className="relative bg-white p-8 shadow-lg rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-medium text-gray-900">Your Internship Stats</h3>
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600">{stats.total}</div>
                      <div className="text-sm text-gray-500 mt-1">Total</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{stats.applied}</div>
                      <div className="text-sm text-gray-500 mt-1">Applied</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{stats.interviews}</div>
                      <div className="text-sm text-gray-500 mt-1">Interviews</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Upcoming Deadlines</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Google Summer Internship</p>
                          <p className="text-xs text-gray-500">Application</p>
                        </div>
                        <span className="text-sm text-red-600 font-medium">2 days left</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Microsoft Explore</p>
                          <p className="text-xs text-gray-500">Interview</p>
                        </div>
                        <span className="text-sm text-yellow-600 font-medium">1 week left</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our tools are designed to help you stay organized and focused on what matters.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <div className="w-6 h-6">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mt-4">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-white shadow-xl p-8">
            <div className="absolute top-4 left-4 text-4xl text-indigo-200">"</div>
            
            <div className="relative h-48 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`absolute w-full transition-all duration-1000 transform ${
                    index === currentTestimonial 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-full opacity-0'
                  }`}
                >
                  <p className="text-lg italic text-gray-600 mb-4 mt-4">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-500 font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 h-2 w-2 rounded-full ${
                    index === currentTestimonial ? 'bg-indigo-600' : 'bg-indigo-200'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-50 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-gray-500">
                  Join thousands of students who are using our platform to land their dream internships.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="sm:flex">
                  <button
                    onClick={() => navigate('/signup')}
                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Create Free Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Tips Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
            <p className="mt-4 text-gray-500">Follow these simple steps to make the most of the Internship Tracker</p>
          </div>
          
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">1</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-gray-500">Complete your profile with your skills, education, and preferences to get personalized recommendations.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">2</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add Opportunities</h3>
              <p className="text-gray-500">Click "Add Internship" to start tracking new opportunities you're interested in or have applied to.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">3</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-gray-500">Update application status, add notes, and set reminders to stay on top of your internship search.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;