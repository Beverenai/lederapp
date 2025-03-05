
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/hooks/useLoginForm';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LoginFormContent: React.FC = () => {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    isSubmitting, 
    handleLogin 
  } = useLoginForm();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateInputs = () => {
    let valid = true;
    
    // Reset error states
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    
    // Validate email/username
    if (!email) {
      setEmailError('Brukernavn eller e-post er påkrevd');
      valid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Passord er påkrevd');
      valid = false;
    }
    
    return valid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring');
      return;
    }
    
    if (!validateInputs()) {
      return;
    }
    
    try {
      setLoginError('');
      console.log('Form validation passed, attempting login');
      toast.info('Logger inn, vennligst vent...');
      await handleLogin(e);
    } catch (error: any) {
      console.error('Login form submission error:', error);
      setLoginError(error.message || 'Kunne ikke logge inn. Vennligst prøv igjen.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">Brukernavn eller E-post</Label>
        <Input
          id="email"
          type="text" 
          placeholder="Brukernavn eller e-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full ${emailError ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
          autoComplete="username email"
        />
        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Passord</Label>
          <a href="#" className="text-sm text-oksnoen-red hover:underline">
            Glemt passord?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Ditt passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full ${passwordError ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
          autoComplete="current-password"
        />
        {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
      </div>
      
      {loginError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{loginError}</span>
          </div>
        </div>
      )}
      
      {/* Info about test account */}
      <div className="text-xs text-gray-500 italic flex items-start gap-1">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          Du kan også logge inn med testkonto:<br />
          Brukernavn: <strong>admin</strong>, Passord: <strong>admin</strong>
        </span>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-oksnoen-red hover:bg-oksnoen-red/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Logger inn...
          </span>
        ) : 'Logg inn'}
      </Button>
    </form>
  );
};

export default LoginFormContent;
