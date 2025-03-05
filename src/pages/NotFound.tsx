
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-oksnoen-light to-white p-4">
      <div className="glass-card p-8 max-w-md mx-auto text-center">
        <h1 className="text-6xl font-bold mb-4 text-oksnoen-red">404</h1>
        <h2 className="text-2xl font-semibold mb-6 text-oksnoen-dark">Side ikke funnet</h2>
        <p className="text-gray-600 mb-8">
          Beklager, men siden du leter etter eksisterer ikke.
        </p>
        
        <Button asChild className="bg-oksnoen-red hover:bg-oksnoen-red/90 text-white">
          <Link to="/">Tilbake til forsiden</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
