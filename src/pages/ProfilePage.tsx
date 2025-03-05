
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/models';
import ProfileForm from '@/components/profile/ProfileForm';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: 'Ikke pålogget',
        description: 'Du må være pålogget for å se din profil.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, isLoading, navigate, toast]);
  
  if (isLoading) {
    return <div className="container mx-auto max-w-4xl py-8 px-4">Laster profil...</div>;
  }
  
  if (!user) {
    return null; // Will redirect due to the useEffect
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Min Profil</CardTitle>
          <CardDescription>
            Se og rediger din profilinformasjon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialUser={user} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
