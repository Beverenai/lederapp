
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginFormContent from './LoginFormContent';
import RegisterFormContent from './RegisterFormContent';

const LoginForm: React.FC = () => {
  const loginTabRef = useRef<HTMLButtonElement>(null);
  
  const handleRegistrationSuccess = () => {
    // Switch to login tab
    loginTabRef.current?.click();
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
            <TabsTrigger id="login-tab" value="login" ref={loginTabRef}>Logg inn</TabsTrigger>
            <TabsTrigger value="register">Registrer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginFormContent />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterFormContent onSuccess={handleRegistrationSuccess} />
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
