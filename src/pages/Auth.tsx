import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MatrixRain } from '@/components/MatrixRain';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { Chrome, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate(user.is_admin ? '/admin' : '/chat');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
      setSigningIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Signed in successfully');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Account created! Please sign in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-b from-background to-background-secondary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-background to-background-secondary">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-glow-blue/10 blur-[80px] md:blur-[120px] animate-volumetric-pulse" />
      </div>

      <MatrixRain />
      <ParticleCanvas />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12 space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-bold text-neon-cyan blur-md opacity-50 -z-10 animate-neon-pulse">
                Pro Builder
              </div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-logo-rotate"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 900,
                  letterSpacing: '0.02em',
                  textShadow:
                    '0 0 10px rgba(106, 220, 255, 0.6), 0 0 20px rgba(106, 220, 255, 0.4)',
                }}
              >
                Pro Builder
              </h1>
            </div>
            <p className="text-lg text-neon-blue/80 animate-pulse">
              Build Your Dream App with AI
            </p>
          </div>

          <div className="bg-background/40 backdrop-blur-xl border border-neon-cyan/20 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isLogin ? 'Access your builder' : 'Start building your app'}
                </p>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-neon-cyan">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-neon-cyan/60" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10 bg-background/60 border-neon-cyan/20 focus:border-neon-cyan text-white placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-neon-cyan">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-neon-cyan/60" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-background/60 border-neon-cyan/20 focus:border-neon-cyan text-white placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-cyan/80 hover:to-neon-blue/80 text-background font-semibold transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neon-cyan/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background/40 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full h-12 text-base font-semibold bg-white hover:bg-gray-100 text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {signingIn ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPassword('');
                  }}
                  className="text-neon-cyan hover:text-neon-blue transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>

              <div className="pt-4 border-t border-neon-cyan/10">
                <p className="text-xs text-center text-muted-foreground">
                  By continuing, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span className="text-sm text-neon-cyan">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80 pointer-events-none" />
    </div>
  );
};

export default Auth;
