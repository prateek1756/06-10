export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  revealedFact: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: "The Origin",
    question: "What is universally acknowledged as the undisputed best beverage for late-night brainstorming?",
    options: [
      { id: "a", text: "Lukewarm Earl Grey with way too much honey", isCorrect: false },
      { id: "b", text: "An iced latte brewed with extreme optimism", isCorrect: true },
      { id: "c", text: "Plain tap water (pure survival mode)", isCorrect: false },
      { id: "d", text: "An energy drink that could jumpstart a truck", isCorrect: false }
    ],
    revealedFact: "Correct! Optimism plus caffeine is the secret fuel for genius ideas."
  },
  {
    id: 2,
    category: "The Philosophy",
    question: "When faced with an unexpected weekend road trip, what is the #1 mandatory rule?",
    options: [
      { id: "a", text: "A spreadsheet with 15-minute interval checkpoints", isCorrect: false },
      { id: "b", text: "No plan, an unhinged playlist, and snacks for 4 days", isCorrect: true },
      { id: "c", text: "Refusing to leave until the weather forecast is 100% sunny", isCorrect: false },
      { id: "d", text: "Taking only highways and strictly no scenic detours", isCorrect: false }
    ],
    revealedFact: "Unplanned detours always produce the stories you still laugh about years later."
  },
  {
    id: 3,
    category: "Survival Skills",
    question: "If an epic movie marathon is happening, what is the cardinal sin?",
    options: [
      { id: "a", text: "Finishing the popcorn before the opening logos end", isCorrect: true },
      { id: "b", text: "Pausing the movie to ask 'Wait, who is that guy?'", isCorrect: false },
      { id: "c", text: "Turning on subtitles even though it's in English", isCorrect: false },
      { id: "d", text: "Falling asleep 12 minutes in", isCorrect: false }
    ],
    revealedFact: "Eating all the popcorn during trailers is practically an Olympic sport."
  },
  {
    id: 4,
    category: "The Secret Code",
    question: "What is the true measure of a successful celebration?",
    options: [
      { id: "a", text: "Number of stiff posed photos taken", isCorrect: false },
      { id: "b", text: "Getting at least 8 hours of sleep beforehand", isCorrect: false },
      { id: "c", text: "Uncontrollable laughing until your stomach aches", isCorrect: true },
      { id: "d", text: "Leaving exactly at 9:00 PM on the dot", isCorrect: false }
    ],
    revealedFact: "Stomach-ache laughter beats any formal banquet every single time."
  }
];
