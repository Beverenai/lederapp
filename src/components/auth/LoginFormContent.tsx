
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/hooks/useLoginForm';

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
        <Label htmlFor="email">Brukernavn eller e-post</Label>
        <Input
          id="email"
          type="text"
          placeholder="Din e-postadresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
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
        />
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
