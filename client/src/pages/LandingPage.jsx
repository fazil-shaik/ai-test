import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Navigation */}
      <nav className="relative px-4 py-4 flex justify-between items-center bg-white bg-opacity-10 backdrop-blur-md">
        <div className="text-3xl font-bold text-white">
          InventoryPro
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-white text-purple-900 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:text-gray-200 transition duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-white text-purple-900 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Master Your
            <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
              {' '}Inventory
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Streamline your business operations with our comprehensive ERP inventory management system. 
            Track products, manage suppliers, and get powerful insights all in one place.
          </p>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-violet-600 transform hover:scale-105 transition duration-300 shadow-lg"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-violet-600 transform hover:scale-105 transition duration-300 shadow-lg"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  className="inline-block px-8 py-4 bg-white bg-opacity-20 text-white font-bold rounded-lg hover:bg-opacity-30 transition duration-300 backdrop-blur-md"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white bg-opacity-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Everything You Need to Manage Inventory
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur-md">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Product Management</h3>
              <p className="text-gray-200">
                Easily add, edit, and track all your products with detailed information, SKUs, and stock levels.
              </p>
            </div>
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur-md">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Supplier Management</h3>
              <p className="text-gray-200">
                Maintain detailed supplier records and manage relationships for better procurement processes.
              </p>
            </div>
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-xl backdrop-blur-md">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analytics & Reports</h3>
              <p className="text-gray-200">
                Get powerful insights with detailed reports, sales analytics, and inventory performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of businesses already using InventoryPro to streamline their operations.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition duration-300 shadow-lg text-lg"
            >
              Get Started Now - It's Free!
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white bg-opacity-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-white">
            <p>&copy; 2024 InventoryPro. All rights reserved.</p>
            <p className="mt-2 text-gray-300">Built with modern technology for modern businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
