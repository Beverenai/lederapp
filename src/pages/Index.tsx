
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-oksnoen-light to-white">
      <div className="glass-card p-8 max-w-3xl mx-auto text-center">
        <img 
          src="/lovable-uploads/91dc8516-a852-46c0-8f93-11206371545a.png" 
          alt="Oksnøen Logo" 
          className="h-32 mx-auto mb-6" 
        />
        <h1 className="text-4xl font-bold mb-4 text-oksnoen-dark">Velkommen til Oksnøen Leder App</h1>
        <p className="text-xl text-gray-600 mb-8">
          Administrer lederen, hytter, barn og aktiviteter for sommerleirene på Oksnøen
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-oksnoen-red hover:bg-oksnoen-red/90 text-white">
            <Link to="/login">Logg inn</Link>
          </Button>
          
          <Button asChild variant="outline" className="border-oksnoen-green text-oksnoen-green hover:bg-oksnoen-green/10">
            <Link to="/dashboard">Gå til Dashbord</Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        <FeatureCard 
          icon="👥" 
          title="Administrer Ledere" 
          description="Håndter lederprofiler, tilgangsnivåer og arbeidsoppgaver" 
        />
        <FeatureCard 
          icon="🏕️" 
          title="Hytte Oversikt" 
          description="Se oversikt over hytter og tilordne ledere til hver hytte" 
        />
        <FeatureCard 
          icon="🧒" 
          title="Barneprofiler" 
          description="Administrer barneprofiler med bilder og personlig informasjon" 
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <div className="glass-card p-6 hover-scale">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-oksnoen-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
