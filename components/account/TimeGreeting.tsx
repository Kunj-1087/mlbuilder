"use client";

import { useState, useEffect } from 'react';

interface TimeGreetingProps {
  name: string;
  fallbackEmail: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'GOOD MORNING';
  if (hour >= 12 && hour < 17) return 'GOOD AFTERNOON';
  if (hour >= 17 && hour < 22) return 'GOOD EVENING';
  return 'STILL UP';
}

function getFirstName(name: string, email: string): string {
  const first = (name || email.split('@')[0]).trim().split(/\s+/)[0];
  return first.toUpperCase();
}

export default function TimeGreeting({ name, fallbackEmail }: TimeGreetingProps) {
  const [greeting, setGreeting] = useState('HELLO');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const firstName = getFirstName(name, fallbackEmail);

  return (
    <h1 className="font-display text-[48px] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] leading-[0.95] tracking-tight">
      <span className="block">
        <span className="text-ink">{greeting}, </span>
        <span className="text-accent">{firstName}.</span>
      </span>
      <span className="block text-ink">WELCOME BACK.</span>
    </h1>
  );
}

