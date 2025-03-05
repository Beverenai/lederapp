
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/hooks/useLoginForm';
import { AlertCircle } from 'lucide-react';
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
    
    // Validate email
    if (!email) {
      setEmailError('E-post er påkrevd');
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
    if (!validateInputs()) {
      e.preventDefault();
      return;
    }
    
    try {
      setLoginError('');
      await handleLogin(e);
    } catch (error: any) {
      console.error('Login form submission error:', error);
      setLoginError(error.message || 'Kunne ikke logge inn. Vennligst prøv igjen.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-post</Label>
        <Input
          id="email"
          type="email"
          placeholder="Din e-postadresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full ${emailError ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
          autoComplete="email"
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
          E-post: <strong>admin</strong>, Passord: <strong>admin</strong>
        </span>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-oksnoen-red hover:bg-oksnoen-red/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logger inn...' : 'Logg inn'}
      </Button>
    </form>
  );
};

export default LoginFormContent;
