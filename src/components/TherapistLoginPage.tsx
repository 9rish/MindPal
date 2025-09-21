import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { User } from '../types';
import { ArrowLeft } from 'lucide-react';

interface TherapistLoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: User) => void;
}

export function TherapistLoginPage({ onBack, onLoginSuccess }: TherapistLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [crrNumber, setCrrNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hardcoded therapist credentials
  const THERAPIST_EMAIL = 'therapist@mindpal.app';
  const THERAPIST_PASSWORD = 'supersecretpassword';
  const THERAPIST_CRR = '12345';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate an authentication check
    setTimeout(() => {
      if (
        email === THERAPIST_EMAIL &&
        password === THERAPIST_PASSWORD &&
        crrNumber === THERAPIST_CRR
      ) {
        // Hardcoded user object for therapist
        const therapistUser: User = {
          id: 'therapist-123',
          email: THERAPIST_EMAIL,
          name: 'Dr. Sarah Mitchell',
          username: 'sarah.m',
          user_type: 'therapist',
          is_Premium: true, // Therapists have premium access
          createdAt: new Date(),
          selected_pet: null,
          coins: 0,
          journal_entries: [],
          pet_mood: 'calm',
        };
        onLoginSuccess(therapistUser);
      } else {
        setError('Invalid credentials');
      }
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-violet-100 via-blue-50 to-teal-100 p-6">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </Button>
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Therapist Login
          </h1>
          <p className="text-gray-600">
            Secure access for licensed professionals
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Central Rehabilitation Register (CRR) Number
              </label>
              <input
                type="text"
                value={crrNumber}
                onChange={(e) => setCrrNumber(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your CRR Number"
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-1000 text-white rounded-xl font-medium text-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging In...</span>
                </div>
              ) : (
                'Login as Therapist'
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}