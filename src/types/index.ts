export type Word = {
  id: number;
  word: string;
  arabic: string;
  meanings: {
    english: string;
    urdu: string;
    hinglish: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
};
