export type ZodiacSign = {
  emoji: string;
  name: string;
  traits: string;
  archetype: string;
  dateRange: { 
    start: { month: number; day: number }; 
    end: { month: number; day: number } 
  };
};

export const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  'Aries': {
    emoji: '🔥',
    name: 'Flamebearer',
    traits: 'Bold, adventurous, energetic, pioneering.',
    archetype: 'The Hero who sparks journeys.',
    dateRange: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } }
  },
  'Taurus': {
    emoji: '🌿',
    name: 'Earthwarden',
    traits: 'Steadfast, patient, sensual, grounded.',
    archetype: 'The Guardian of comfort and stability.',
    dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } }
  },
  'Gemini': {
    emoji: '🌬',
    name: 'Twinweaver',
    traits: 'Curious, witty, adaptable, sociable.',
    archetype: 'The Trickster who thrives on duality.',
    dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } }
  },
  'Cancer': {
    emoji: '🌊',
    name: 'Tidekeeper',
    traits: 'Nurturing, emotional, intuitive, protective.',
    archetype: 'The Healer or Caretaker of stories.',
    dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } }
  },
  'Leo': {
    emoji: '☀️',
    name: 'Sunforged',
    traits: 'Confident, radiant, expressive, loyal.',
    archetype: 'The Performer who commands the stage.',
    dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } }
  },
  'Virgo': {
    emoji: '🌾',
    name: 'Quillwright',
    traits: 'Analytical, detail-oriented, practical, helpful.',
    archetype: 'The Scholar or Scribe who perfects the tale.',
    dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } }
  },
  'Libra': {
    emoji: '⚖️',
    name: 'Balanceseeker',
    traits: 'Harmonious, diplomatic, aesthetic, fair.',
    archetype: 'The Mediator who restores balance.',
    dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } }
  },
  'Scorpio': {
    emoji: '🦂',
    name: 'Veilbreaker',
    traits: 'Intense, transformative, passionate, mysterious.',
    archetype: 'The Rebel who uncovers hidden truths.',
    dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } }
  },
  'Sagittarius': {
    emoji: '🌌',
    name: 'Pathwanderer',
    traits: 'Adventurous, philosophical, optimistic, free-spirited.',
    archetype: 'The Explorer in search of wisdom.',
    dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
  },
  'Capricorn': {
    emoji: '🪨',
    name: 'Stonebound',
    traits: 'Disciplined, ambitious, responsible, determined.',
    archetype: 'The Builder who creates lasting legacies.',
    dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } }
  },
  'Aquarius': {
    emoji: '🌠',
    name: 'Starborn',
    traits: 'Visionary, unconventional, humanitarian, innovative.',
    archetype: 'The Dreamer who imagines new worlds.',
    dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } }
  },
  'Pisces': {
    emoji: '🌙',
    name: 'Dreamtide',
    traits: 'Compassionate, imaginative, spiritual, empathetic.',
    archetype: 'The Mystic who swims in stories and symbols.',
    dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } }
  }
};

export const getZodiacSign = (month: string, day: string, monthsList: readonly string[]) => {
  const monthNum = monthsList.indexOf(month) + 1;
  const dayNum = parseInt(day, 10);
  
  for (const [signName, signData] of Object.entries(ZODIAC_SIGNS)) {
    const { start, end } = signData.dateRange;
    
    // Handle Capricorn (spans across year)
    if (start.month === 12 && end.month === 1) {
      if ((monthNum === 12 && dayNum >= start.day) || (monthNum === 1 && dayNum <= end.day)) {
        return { signName, ...signData };
      }
    } else {
      // Regular signs
      if (monthNum === start.month && dayNum >= start.day) {
        return { signName, ...signData };
      }
      if (monthNum === end.month && dayNum <= end.day) {
        return { signName, ...signData };
      }
    }
  }
  
  return null;
};
