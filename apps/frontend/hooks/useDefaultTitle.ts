import { useRouter } from 'next/router';

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function titleFromPath(path: string): string {
  return capitalize(path.split('/')[1]);
}

export default function useDefaultTitle(): string {
  const router = useRouter();
  return titleFromPath(router.pathname);
}
