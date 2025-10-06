export type CharacterBio = {
  name: string;
  title: string;
  description: string;
  tags: string[];
  backstory: string;
};

// Fallback bio generator for when AI service is unavailable
const generateFallbackBio = (zodiacSign: string, interests: string[], firstName: string): CharacterBio => {
  const zodiacTitles: Record<string, string> = {
    'Aries': 'The Natural Leader',
    'Taurus': 'The Reliable Friend',
    'Gemini': 'The Social Connector',
    'Cancer': 'The Caring Soul',
    'Leo': 'The Confident Performer',
    'Virgo': 'The Detail-Oriented Helper',
    'Libra': 'The Peaceful Mediator',
    'Scorpio': 'The Intense Explorer',
    'Sagittarius': 'The Curious Traveler',
    'Capricorn': 'The Ambitious Achiever',
    'Aquarius': 'The Independent Thinker',
    'Pisces': 'The Creative Dreamer'
  };

  const interestTags = interests.slice(0, 3).map(interest => {
    const tagMap: Record<string, string> = {
      'Art & Design': 'Creative',
      'Gaming': 'Strategic',
      'Hiking': 'Adventurous',
      'Exercising': 'Determined',
      'Music': 'Artistic',
      'Photography': 'Observant',
      'Cooking': 'Nurturing',
      'Travel': 'Explorer',
      'Reading': 'Thoughtful',
      'Movies': 'Imaginative',
      'Sports': 'Competitive',
      'Dancing': 'Expressive',
      'Writing': 'Communicative',
      'Technology': 'Innovative',
      'Nature': 'Peaceful',
      'Fashion': 'Stylish',
      'Meditation': 'Mindful',
      'Gardening': 'Patient',
      'Crafting': 'Detail-Oriented',
      'Astronomy': 'Curious',
      'History': 'Knowledgeable',
      'Science': 'Analytical',
      'Languages': 'Cultural',
      'Volunteering': 'Compassionate',
      'Collecting': 'Passionate',
      'Theater': 'Artistic',
      'Comedy': 'Witty',
      'Fitness': 'Strong',
      'Yoga': 'Flexible',
      'Puzzles': 'Problem-Solver'
    };
    return tagMap[interest] || 'Unique';
  });

  return {
    name: firstName,
    title: zodiacTitles[zodiacSign] || 'The Unique Individual',
    description: `As a ${zodiacSign}, ${firstName} brings their natural personality traits to everything they do. With interests in ${interests.slice(0, 2).join(' and ')}, they approach life with enthusiasm and authenticity.`,
    tags: interestTags,
    backstory: `${firstName} has always been known for their ${zodiacSign.toLowerCase()} nature, bringing their unique perspective to their interests in ${interests.slice(0, 2).join(' and ')}. Their journey has been shaped by their natural personality traits and the experiences they've gained through their passions.`
  };
};

export const generateCharacterBio = async (
  zodiacSign: string,
  interests: string[],
  firstName: string
): Promise<CharacterBio> => {
  try {
    // Call the Firebase function to generate AI-powered bio
    const response = await fetch('https://api-tbx2d52hwq-uc.a.run.app/generateCharacterBio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        zodiacSign,
        interests
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.characterBio;
  } catch (error) {
    console.error('Error generating AI character bio:', error);
    // Fallback to local generation if AI service fails
    return generateFallbackBio(zodiacSign, interests, firstName);
  }
};
