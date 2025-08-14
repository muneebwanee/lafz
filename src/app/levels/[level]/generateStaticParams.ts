import { words } from '@/data/words';

export default function generateStaticParams() {
  const levels = Array.from(new Set(words.map(w => w.level)));
  return levels.map(level => ({
    level: String(level)
  }));
}
