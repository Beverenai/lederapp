
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginForm: React.FC = () => {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: 'Innlogget',
        description: 'Du er nå logget inn',
      });
      navigate('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Feil ved innlogging',
        description: err.message || 'Kunne ikke logge inn. Prøv igjen.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (regPassword !== confirmPassword) {
      toast({
        title: 'Passordene samsvarer ikke',
        description: 'Vennligst sørg for at passordene er like.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First check if the email already exists in profiles
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', regEmail.toLowerCase());
      
      if (existingProfiles && existingProfiles.length > 0) {
        // Check if names match
        const existingProfile = existingProfiles[0];
        const nameMatches = 
          existingProfile.first_name?.toLowerCase() === firstName.toLowerCase() && 
          existingProfile.last_name?.toLowerCase() === lastName.toLowerCase();
        
        if (nameMatches) {
          // If names match, try to set password for this user
          const { error: signupError } = await supabase.auth.signUp({
            email: regEmail,
            password: regPassword,
            options: {
              data: {
                firstName: firstName,
                lastName: lastName
              }
            }
          });
          
          if (signupError) throw signupError;
          
          toast({
            title: 'Konto oppdatert',
            description: 'Du har lagt til et passord for din eksisterende konto. Du kan nå logge inn.',
          });
          
          // Clear registration form and switch to login tab
          clearRegForm();
          document.getElementById('login-tab')?.click();
        } else {
          // Names don't match - this is a conflict
          toast({
            title: 'E-post allerede i bruk',
            description: 'En bruker med denne e-postadressen finnes allerede med et annet navn.',
            variant: 'destructive',
          });
        }
      } else {
        // Email doesn't exist, create new user
        const { data, error: signupError } = await supabase.auth.signUp({
          email: regEmail,
          password: regPassword,
          options: {
            data: {
              firstName: firstName,
              lastName: lastName
            }
          }
        });
        
        if (signupError) throw signupError;
        
        // If user was created, also create a profile record
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: regEmail.toLowerCase(),
            role: 'leader' // Default role
          });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }
        
        toast({
          title: 'Registrering vellykket',
          description: 'Din konto er opprettet. Du kan nå logge inn.',
        });
        
        // Clear registration form and switch to login tab
        clearRegForm();
        document.getElementById('login-tab')?.click();
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      toast({
        title: 'Feil ved registrering',
        description: err.message || 'Kunne ikke opprette konto. Prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const clearRegForm = () => {
    setFirstName('');
    setLastName('');
    setRegEmail('');
    setRegPassword('');
    setConfirmPassword('');
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-enter glass-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Oksnøen Lederportal</CardTitle>
        <CardDescription className="text-center">
          Logg inn eller opprett en konto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger id="login-tab" value="login">Logg inn</TabsTrigger>
            <TabsTrigger value="register">Registrer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Din e-postadresse"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Fornavn</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Ditt fornavn"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Etternavn</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Ditt etternavn"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regEmail">E-post</Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder="Din e-postadresse"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPassword">Passord</Label>
                <Input
                  id="regPassword"
                  type="password"
                  placeholder="Velg et passord"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bekreft passord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Gjenta passord"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-oksnoen-green hover:bg-oksnoen-green/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrerer...' : 'Registrer'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground text-center mt-2">
          Test brukere:<br />
          Admin Adminsen / password<br />
          Syke Pleier / password<br />
          Lars Leder / password
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
