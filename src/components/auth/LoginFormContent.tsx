
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/hooks/useLoginForm';
import { AlertCircle } from 'lucide-react';

const LoginFormContent: React.FC = () => {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    isSubmitting, 
    handleLogin 
  } = useLoginForm();

  return (
    <form onSubmit={handleLogin} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-post</Label>
        <Input
          id="email"
          type="email"
          placeholder="Din e-postadresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={isSubmitting}
          autoComplete="email"
        />
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
          className="w-full"
          disabled={isSubmitting}
          autoComplete="current-password"
        />
      </div>
      
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
