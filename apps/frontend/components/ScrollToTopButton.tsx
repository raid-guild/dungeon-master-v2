import { Button } from '@raidguild/ui';
import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const handleScroll = () => {
  if (window !== null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const buttonVisibility = () => {
      // eslint-disable-next-line no-unused-expressions
      window.scrollY > 100 ? setVisible(true) : setVisible(false);
    };
    window.addEventListener('scroll', buttonVisibility);
    return () => {
      window.removeEventListener('scroll', buttonVisibility);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-20 right-4 z-10 ${visible ? 'block' : 'hidden'}`}
    >
      <Button
        aria-label='Scroll to Top of Page Button'
        size='icon'
        className='text-xl lg:text-2xl rounded-full shadow-xl transition-all duration-250 ease-in-out transform hover:translate-y-[-4px]'
        onClick={handleScroll}
      >
        <ChevronUp />
      </Button>
    </div>
  );
};

export default ScrollToTopButton;
