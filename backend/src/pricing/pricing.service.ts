import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  private nicheMultipliers: Record<string, number> = {
    'Tech': 1.6,
    'Finance': 1.8,
    'Fashion': 1.3,
    'Health': 1.4,
    'General': 1.0,
    'Entertainment': 1.1,
    'Comedy': 1.0,
    'Food': 1.2,
    'Gaming': 1.1,
  };

  private platformFactors: Record<string, number> = {
    'YouTube': 1.2,
    'Instagram': 1.0,
    'Facebook': 0.8,
    'X': 0.9,
    'LinkedIn': 1.5,
  };

  calculatePrice(data: {
    followers: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    platform: string;
    niche: string;
  }) {
    const { followers, avgViews, avgLikes, avgComments, platform, niche } = data;

    // 1. Engagement Rate (Likes + Comments / Followers)
    const engagementRate = followers > 0 ? (avgLikes + avgComments) / followers : 0;
    
    // 2. Platform Factor
    const pf = this.platformFactors[platform] || 1.0;
    
    // 3. Niche Multiplier
    const nm = this.nicheMultipliers[niche] || 1.0;

    // 4. Base Score (Followers + weighted views)
    // We weight views at 10% because they are usually 10x more frequent than followers for viral creators
    const weightedBase = (followers * 1.0) + (avgViews * 0.2);

    // 5. Price Score
    // Formula: (weightedBase) * EngagementRate * Niche * Platform
    // We multiply by a factor (e.g., 0.5) to keep prices realistic in INR/USD
    // For India market: approx ₹0.5 - ₹2 per follower depending on engagement
    const baseScore = weightedBase * (engagementRate * 50 + 0.1) * nm * pf;
    
    const recommended = Math.round(baseScore);
    const min = Math.round(recommended * 0.75);
    const premium = Math.round(recommended * 1.6); // Premium for 100% rights/multiple posts

    // Confidence Score (%)
    const confidence = Math.min(Math.round(40 + (engagementRate * 200) + (followers > 10000 ? 20 : 0)), 98);

    return {
      ranges: {
        min,
        recommended,
        premium,
      },
      confidence,
      explanation: `Calculated using ${platform} factor (${pf}x) for ${niche} niche (${nm}x). ` +
                   `Engagement rate of ${(engagementRate * 100).toFixed(1)}% heavily influenced the price.`,
      metrics: {
        engagementRate: (engagementRate * 100).toFixed(2),
        basePower: weightedBase,
      }
    };
  }
}
