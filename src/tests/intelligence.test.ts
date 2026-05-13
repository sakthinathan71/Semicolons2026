import { describe, it, expect } from 'vitest';
import { synthesizeRecommendation, MarketSignal } from '../lib/intelligence';

describe('synthesizeRecommendation', () => {
  it('should create a pricing recommendation when signal is pricing related', () => {
    const signal: MarketSignal = {
      id: '1',
      brand: 'Gucci',
      event: 'Price Drop (-15%)',
      category: 'Bags',
      details: 'Seasonal sale',
      impact: 'High',
      time: 'Just now'
    };

    const rec = synthesizeRecommendation(signal);
    expect(rec.title).toContain('Price Response');
    expect(rec.urgency).toBe('Immediate');
  });

  it('should create a social recommendation when signal is viral related', () => {
    const signal: MarketSignal = {
      id: '2',
      brand: 'Prada',
      event: 'Viral Post',
      category: 'Marketing',
      details: 'Influencer campaign',
      impact: 'Medium',
      time: '10m ago',
      socialMetrics: { views: '1M', velocity: 85, sentiment: 'Positive' }
    };

    const rec = synthesizeRecommendation(signal);
    expect(rec.title).toContain('Engagement Counter');
    expect(rec.action).toBe('Social Blitz');
  });
});
