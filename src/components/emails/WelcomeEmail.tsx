import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  confirmationLink: string;
}

export default function WelcomeEmail({ name, confirmationLink }: WelcomeEmailProps) {
  return (
    <div>
      <h2>Welcome to Repn, {name}! 💪</h2>
      <p>Thanks for signing up. Please confirm your email address to complete your registration.</p>
      <a href={confirmationLink}>Confirm Email</a>
    </div>
  );
} 