
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterForm } from '@/hooks/useRegisterForm';

interface RegisterFormContentProps {
  onSuccess: () => void;
}

const RegisterFormContent: React.FC<RegisterFormContentProps> = ({ onSuccess }) => {
  const {
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
  } = useRegisterForm(onSuccess);

  return (
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="regPassword">Passord</Label>
        <Input
          id="regPassword"
          type="password"
          placeholder="Velg et passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
  );
};

export default RegisterFormContent;
