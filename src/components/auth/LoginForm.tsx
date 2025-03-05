
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(username, password);
      toast({
        title: 'Innlogget',
        description: 'Du er nå logget inn',
      });
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Feil ved innlogging',
        description: error || 'Kunne ikke logge inn. Prøv igjen.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-enter glass-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Logg inn</CardTitle>
        <CardDescription className="text-center">
          Skriv inn dine innloggingsdetaljer nedenfor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Brukernavn</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ditt brukernavn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground text-center mt-2">
          Test brukere:<br />
          Admin User / password<br />
          Nurse User / password<br />
          Leader User / password
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
