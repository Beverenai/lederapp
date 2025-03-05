
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useRegisterForm = (onSuccess: () => void) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
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
        .eq('email', email.toLowerCase());
      
      if (existingProfiles && existingProfiles.length > 0) {
        // Check if names match
        const existingProfile = existingProfiles[0];
        const nameMatches = 
          existingProfile.first_name?.toLowerCase() === firstName.toLowerCase() && 
          existingProfile.last_name?.toLowerCase() === lastName.toLowerCase();
        
        if (nameMatches) {
          // If names match, try to set password for this user
          const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
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
          clearForm();
          onSuccess();
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
          email: email,
          password: password,
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
            email: email.toLowerCase(),
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
        clearForm();
        onSuccess();
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

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isSubmitting,
    handleRegister
  };
};
