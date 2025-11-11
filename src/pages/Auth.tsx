import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MatrixRain } from '@/components/MatrixRain';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { Chrome } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate(user.is_admin ? '/admin' : '/chat');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
      setSigningIn(false);
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
                <h2 className="text-2xl font-bold text-white">Welcome</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to start building your application
                </p>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full h-14 text-lg font-semibold bg-white hover:bg-gray-100 text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {signingIn ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Chrome className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>

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
