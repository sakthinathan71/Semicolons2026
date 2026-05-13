import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '../components/ui/StatCard';
import { Activity } from 'lucide-react';
import React from 'react';

describe('StatCard', () => {
  it('renders the label and value correctly', () => {
    render(
      <StatCard 
        label="Market Velocity" 
        value="High" 
        trend="up" 
        sub="Live Engagement" 
        icon={Activity} 
      />
    );

    expect(screen.getByText('Market Velocity')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Live Engagement')).toBeInTheDocument();
  });
});
