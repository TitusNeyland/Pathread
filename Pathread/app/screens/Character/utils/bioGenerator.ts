import { ZODIAC_SIGNS } from '../../SignUp/constants/zodiac';

export type CharacterBio = {
  name: string;
  title: string;
  description: string;
  tags: string[];
  backstory: string;
};

// Generate a unique character name based on zodiac sign
const generateCharacterName = (zodiacSign: string): string => {
  const nameMap: Record<string, string[]> = {
    'Aries': ['Aria', 'Axel', 'Aurora', 'Atlas', 'Aria'],
    'Taurus': ['Terra', 'Theo', 'Talia', 'Tristan', 'Tara'],
    'Gemini': ['Gemma', 'Galen', 'Grace', 'Gideon', 'Gia'],
    'Cancer': ['Cora', 'Caleb', 'Celia', 'Caspian', 'Cara'],
    'Leo': ['Leo', 'Luna', 'Liam', 'Lydia', 'Luca'],
    'Virgo': ['Vera', 'Victor', 'Violet', 'Vaughn', 'Vera'],
    'Libra': ['Luna', 'Liam', 'Lydia', 'Luca', 'Luna'],
    'Scorpio': ['Scarlett', 'Sebastian', 'Sage', 'Silas', 'Sera'],
    'Sagittarius': ['Sage', 'Soren', 'Serena', 'Silas', 'Sage'],
    'Capricorn': ['Cora', 'Caleb', 'Celia', 'Caspian', 'Cara'],
    'Aquarius': ['Aria', 'Axel', 'Aurora', 'Atlas', 'Aria'],
    'Pisces': ['Pia', 'Phoenix', 'Penelope', 'Preston', 'Pia']
  };
  
  const names = nameMap[zodiacSign] || ['Aria', 'Axel', 'Aurora', 'Atlas', 'Aria'];
  return names[Math.floor(Math.random() * names.length)];
};

// Generate character tags based on interests
const generateCharacterTags = (interests: string[]): string[] => {
  const tagMap: Record<string, string[]> = {
    'Art & Design': ['Creative', 'Artistic', 'Visionary'],
    'Gaming': ['Strategic', 'Competitive', 'Adventurous'],
    'Hiking': ['Nature-Lover', 'Explorer', 'Adventurous'],
    'Exercising': ['Determined', 'Strong', 'Disciplined'],
    'Music': ['Melodic', 'Expressive', 'Harmonious'],
    'Photography': ['Observant', 'Artistic', 'Detail-Oriented'],
    'Cooking': ['Nurturing', 'Creative', 'Patient'],
    'Travel': ['Wanderer', 'Curious', 'Adventurous'],
    'Reading': ['Wise', 'Thoughtful', 'Imaginative'],
    'Movies': ['Storyteller', 'Imaginative', 'Entertaining'],
    'Sports': ['Competitive', 'Team Player', 'Determined'],
    'Dancing': ['Expressive', 'Graceful', 'Energetic'],
    'Writing': ['Storyteller', 'Thoughtful', 'Expressive'],
    'Technology': ['Innovative', 'Logical', 'Forward-Thinking'],
    'Nature': ['Peaceful', 'Connected', 'Grounded'],
    'Fashion': ['Stylish', 'Confident', 'Creative'],
    'Meditation': ['Peaceful', 'Wise', 'Centered'],
    'Gardening': ['Patient', 'Nurturing', 'Connected'],
    'Crafting': ['Creative', 'Patient', 'Detail-Oriented'],
    'Astronomy': ['Curious', 'Wise', 'Dreamy'],
    'History': ['Wise', 'Thoughtful', 'Knowledgeable'],
    'Science': ['Analytical', 'Curious', 'Logical'],
    'Languages': ['Communicative', 'Cultural', 'Adaptable'],
    'Volunteering': ['Compassionate', 'Selfless', 'Caring'],
    'Collecting': ['Detail-Oriented', 'Passionate', 'Organized'],
    'Theater': ['Expressive', 'Confident', 'Artistic'],
    'Comedy': ['Witty', 'Entertaining', 'Lighthearted'],
    'Fitness': ['Determined', 'Strong', 'Disciplined'],
    'Yoga': ['Peaceful', 'Flexible', 'Centered'],
    'Puzzles': ['Analytical', 'Patient', 'Problem-Solver']
  };

  const selectedTags = interests.slice(0, 3).map(interest => {
    const tags = tagMap[interest] || ['Unique', 'Special', 'Interesting'];
    return tags[Math.floor(Math.random() * tags.length)];
  });

  return selectedTags;
};

// Generate character description based on zodiac and interests
const generateCharacterDescription = (zodiacSign: string, interests: string[], name: string): string => {
  const zodiacData = ZODIAC_SIGNS[zodiacSign];
  if (!zodiacData) return '';

  const interestText = interests.slice(0, 3).join(' and ');
  const zodiacTraits = zodiacData.traits.toLowerCase();
  
  return `As a ${zodiacData.name}, ${name} flows with ${zodiacTraits}. Drawn to ${interestText}, ${name.toLowerCase()} seeks hidden truths in enchanted worlds, always finding wisdom in nature's mysteries.`;
};

// Generate character backstory
const generateCharacterBackstory = (zodiacSign: string, interests: string[], name: string): string => {
  const zodiacData = ZODIAC_SIGNS[zodiacSign];
  if (!zodiacData) return '';

  const backstories: Record<string, string[]> = {
    'Aries': [
      `${name} was born under the first light of spring, when the world awakens with new possibilities. As a natural leader, ${name} discovered their calling early, drawn to adventure and new beginnings.`,
      `From a young age, ${name} showed remarkable courage and determination. Their fiery spirit led them to explore uncharted territories, always seeking the next great adventure.`,
      `The firstborn of their generation, ${name} carries the weight of leadership with grace. Their pioneering spirit has led them to discover new realms and inspire others to follow their dreams.`
    ],
    'Taurus': [
      `${name} found their strength in the stability of the earth. Growing up surrounded by nature's beauty, they learned to appreciate life's simple pleasures and build lasting foundations.`,
      `With roots as deep as ancient oaks, ${name} has always been the steady presence others could rely on. Their connection to the earth has given them wisdom beyond their years.`,
      `Born in the season of growth, ${name} has cultivated their talents with patience and care. Their appreciation for beauty and comfort has made them a beacon of stability in turbulent times.`
    ],
    'Gemini': [
      `${name} was blessed with the gift of duality, able to see multiple perspectives and adapt to any situation. Their curious mind has led them on countless intellectual adventures.`,
      `From the moment they could speak, ${name} was weaving stories and connecting with others. Their natural charm and wit have opened doors to worlds they never knew existed.`,
      `The twin spirits within ${name} have guided them through life's many changes. Their ability to communicate and adapt has made them a bridge between different worlds and cultures.`
    ],
    'Cancer': [
      `${name} was born with an intuitive understanding of emotions and the cycles of life. Their nurturing nature has made them a protector of those they hold dear.`,
      `Like the moon that governs their sign, ${name} has always been attuned to the ebb and flow of life. Their emotional depth has given them insight into the human heart.`,
      `From their earliest memories, ${name} has felt a deep connection to home and family. Their protective instincts have led them to create safe havens for others in need.`
    ],
    'Leo': [
      `${name} was born to shine, with a natural magnetism that draws others to them. Their creative spirit and generous heart have made them a natural leader and performer.`,
      `From childhood, ${name} has been the center of attention, not by seeking it, but by naturally commanding respect and admiration. Their confidence inspires others to reach for their dreams.`,
      `The sun's energy flows through ${name}'s veins, giving them the power to illuminate even the darkest corners of the world. Their warmth and generosity have touched countless lives.`
    ],
    'Virgo': [
      `${name} was born with an eye for detail and a desire to help others. Their analytical mind and practical approach have made them invaluable in solving life's complex puzzles.`,
      `From a young age, ${name} has been the one others turn to for advice and practical solutions. Their methodical approach and attention to detail have led to many breakthroughs.`,
      `The earth's wisdom flows through ${name}, giving them the ability to see patterns others miss. Their dedication to improvement and service has made them a trusted guide.`
    ],
    'Libra': [
      `${name} was born with an innate sense of balance and harmony. Their diplomatic nature and appreciation for beauty have made them a natural peacemaker and artist.`,
      `From childhood, ${name} has been drawn to fairness and justice. Their ability to see all sides of a situation has made them a valuable mediator and friend.`,
      `The scales of justice guide ${name}'s heart, leading them to seek harmony in all things. Their artistic sensibilities and social grace have opened many doors.`
    ],
    'Scorpio': [
      `${name} was born with the power to transform and regenerate. Their intense nature and deep intuition have led them to uncover hidden truths and mysteries.`,
      `From an early age, ${name} has been drawn to life's deeper mysteries. Their penetrating insight and emotional depth have given them access to secrets others cannot see.`,
      `The phoenix spirit within ${name} has led them through many transformations. Their ability to rise from the ashes stronger than before has inspired others to embrace change.`
    ],
    'Sagittarius': [
      `${name} was born with an insatiable thirst for knowledge and adventure. Their philosophical nature and love of travel have led them to explore both inner and outer worlds.`,
      `From childhood, ${name} has been the eternal student, always seeking to expand their horizons. Their optimistic spirit and adventurous nature have taken them to places others only dream of.`,
      `The archer's arrow points ${name} toward distant horizons and higher truths. Their wisdom and humor have made them a beloved teacher and guide.`
    ],
    'Capricorn': [
      `${name} was born with the wisdom of the mountain goat, able to climb to great heights through determination and hard work. Their practical approach has built lasting legacies.`,
      `From a young age, ${name} has understood the value of discipline and perseverance. Their ambitious nature and strong work ethic have led them to achieve remarkable success.`,
      `The mountain's strength flows through ${name}, giving them the endurance to overcome any obstacle. Their leadership and responsibility have made them a pillar of their community.`
    ],
    'Aquarius': [
      `${name} was born with a vision of the future and a desire to help humanity. Their innovative thinking and humanitarian spirit have led them to create positive change.`,
      `From childhood, ${name} has been ahead of their time, seeing possibilities others cannot imagine. Their unique perspective and social consciousness have made them a catalyst for progress.`,
      `The water bearer's gift flows through ${name}, bringing new ideas and hope to those around them. Their independence and originality have inspired others to think differently.`
    ],
    'Pisces': [
      `${name} was born with the sensitivity of the ocean's depths and the imagination of infinite possibilities. Their compassionate nature has made them a healer and dreamer.`,
      `From their earliest memories, ${name} has been attuned to the unseen realms and the emotions of others. Their intuitive gifts and artistic nature have opened doors to mystical experiences.`,
      `The fish swim in ${name}'s soul, carrying them between the worlds of reality and dreams. Their empathy and creativity have made them a bridge between the material and spiritual realms.`
    ]
  };

  const stories = backstories[zodiacSign] || backstories['Aries'];
  return stories[Math.floor(Math.random() * stories.length)];
};

export const generateCharacterBio = (
  zodiacSign: string,
  interests: string[],
  firstName: string
): CharacterBio => {
  const name = generateCharacterName(zodiacSign);
  const title = ZODIAC_SIGNS[zodiacSign]?.name || 'Wanderer';
  const tags = generateCharacterTags(interests);
  const description = generateCharacterDescription(zodiacSign, interests, name);
  const backstory = generateCharacterBackstory(zodiacSign, interests, name);

  return {
    name,
    title,
    description,
    tags,
    backstory
  };
};
