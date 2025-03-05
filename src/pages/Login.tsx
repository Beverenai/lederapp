
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Logo and branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-oksnoen-red to-oksnoen-green p-8 flex flex-col justify-center items-center">
        <div className="max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <img 
              src="/lovable-uploads/91dc8516-a852-46c0-8f93-11206371545a.png" 
              alt="Oksnøen Sommerleir Logo" 
              className="w-40 h-40 object-contain animate-fade-in"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 text-balance">
            Oksnøen Leder app
          </h1>
          <p className="text-white/90 mb-8 max-w-sm mx-auto text-balance">
            Administrer sommerleiren, deltakerne og aktivitetene enkelt og effektivt
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
