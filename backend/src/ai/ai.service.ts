import { Injectable, Logger } from '@nestjs/common';
import Groq from "groq-sdk";

@Injectable()
export class AiService {
  private groq: Groq;
  private readonly logger = new Logger(AiService.name);

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'gsk_invalid' });
  }

  async generateContract(details: { 
    brandName: string; 
    influencerName: string; 
    platform: string; 
    amount: number; 
    deliverables: string; 
  }) {
    const prompt = `
      Create a professional influencer marketing contract between:
      Brand: ${details.brandName}
      Influencer: ${details.influencerName}
      
      Deal Details:
      Platform: ${details.platform}
      Amount: INR ${details.amount}
      Deliverables: ${details.deliverables}
      
      Include standard clauses for:
      - Content ownership
      - Payment terms (escrow)
      - Exclusivity (simplified)
      - Non-disclosure
      
      Format the output as clear, professional Markdown. Use a bold title "INFLUENCER MARKETING AGREEMENT".
    `;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (err) {
      this.logger.error('Failed to generate contract via Groq:', err);
      // Fallback simple contract
      return `
# INFLUENCER MARKETING AGREEMENT
This agreement is between ${details.brandName} and ${details.influencerName}.
Project: ${details.deliverables} on ${details.platform}.
Amount: INR ${details.amount} (to be paid via Monetize Connect Escrow).
      `;
    }
  }

  async generateBio(details: { 
    name: string; 
    role: 'INFLUENCER' | 'BUSINESS'; 
    niche?: string; 
    details?: string; 
  }) {
    const prompt = `
      Create a highly professional, catchy, and engaging short bio (max 3 sentences) for a ${details.role} on an influencer marketplace.
      Name: ${details.name}
      ${details.niche ? `Niche/Category: ${details.niche}` : ''}
      ${details.details ? `Key Accomplishments/Products: ${details.details}` : ''}
      
      Make it sound ${details.role === 'INFLUENCER' ? 'creative, authentic, and collaborative' : 'premium, results-oriented, and visionary'}.
      DO NOT include placeholders like [Name]. Just return the bio text directly.
    `;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
      });

      return response.choices[0].message.content?.trim();
    } catch (err) {
      this.logger.error('Failed to generate bio via Groq:', err);
      return `Experienced ${details.role} ready for meaningful collaborations.`;
    }
  }
}
