import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  ShoppingBagIcon,
  HeartIcon,
  PhotoIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const SimpleLanding: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
  <div className="min-h-screen relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Background accents */}
  <div className="pointer-events-none absolute -top-24 -left-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-indigo-500/20 to-emerald-400/20 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">M</div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Mnada</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/auth/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600">Sign in</Link>
          <Link to="/auth/register" className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">Create account</Link>
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 text-purple-600 text-sm font-medium">
              <SparklesIcon className="h-4 w-4" /> Discover African fashion
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
              African fashion.
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Global vibes.</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Shop authentic styles from talented designers, share your looks with the community, and celebrate the culture.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 font-semibold shadow-sm"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" /> Explore Marketplace
              </Link>
              <Link
                to="/feed"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold"
              >
                <HeartIcon className="h-5 w-5 mr-2" /> Join Community
              </Link>
            </div>

            {/* Feature bullets */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{icon: ShoppingBagIcon, title: 'Curated styles'}, {icon: HeartIcon, title: 'Creator community'}, {icon: PhotoIcon, title: 'Share your looks'}].map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                  <f.icon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual collage */}
          <div className="relative h-[420px] md:h-[520px]">
            <div className="absolute inset-0 -translate-x-4 md:-translate-x-8 -translate-y-2 md:-translate-y-4 rotate-1 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-500/20 blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&h=1200&fit=crop"
              alt="Vibrant African dress"
              loading="lazy"
              className="absolute top-0 left-8 md:left-16 w-56 md:w-72 h-72 md:h-96 object-cover rounded-2xl shadow-xl"
            />
            <img
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&h=1200&fit=crop"
              alt="Tailored blazer"
              loading="lazy"
              className="absolute bottom-4 right-0 w-48 md:w-64 h-60 md:h-80 object-cover rounded-2xl shadow-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=1200&fit=crop"
              alt="Jewelry details"
              loading="lazy"
              className="absolute bottom-24 left-0 w-32 md:w-40 h-40 md:h-48 object-cover rounded-xl shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16 lg:pb-24">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Curated collections</h2>
          <Link to="/marketplace" className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center">
            Browse all <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: 'Traditional Wear', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=900&fit=crop' },
            { title: 'Modern African', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&h=900&fit=crop' },
            { title: 'Accessories', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=900&fit=crop' },
          ].map((c, i) => (
            <Link key={i} to="/marketplace" className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
              <img src={c.img} alt={c.title} loading="lazy" className="w-full h-56 md:h-64 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-gray-900 text-sm font-semibold backdrop-blur">
                  {c.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community highlight */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Join the SnapFit community</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Share your outfits, get inspired, and connect with creators across the continent.</p>
            </div>
            <Link to="/feed" className="inline-flex items-center px-5 py-3 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600">
              Start sharing <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Mnada. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/marketplace" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Marketplace</Link>
            <Link to="/feed" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Community</Link>
            <Link to="/upload" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Upload</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleLanding;
