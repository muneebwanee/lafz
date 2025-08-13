
export type Word = {
  id: number;
  word: string;
  arabic: string;
  meanings: {
    english: string;
    urdu: string;
    hinglish: string;
  };
  level: number;
  category: 'high-frequency' | 'unique-root';
};
