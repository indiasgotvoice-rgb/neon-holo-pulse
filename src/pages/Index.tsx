import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplashScreen } from '@/components/SplashScreen';

const Index = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      navigate('/auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return null;
};

export default Index;
