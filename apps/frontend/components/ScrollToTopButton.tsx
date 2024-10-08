import { Box, IconButton } from '@raidguild/design-system';
import { useEffect, useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';

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
    <Box
      position='fixed'
      bottom='100px'
      right={['16px', '84px']}
      zIndex={1}
      display={visible ? 'block' : 'none'}
    >
      <IconButton
        aria-label='Scroll to Top of Page Button'
        size='lg'
        fontSize={{ base: 'xl', lg: '2xl' }}
        borderRadius='9999px'
        boxShadow='xl'
        transition='all 100ms ease-in-out transform 250ms ease-in-out'
        _hover={{
          transform: 'translateY(-4px)',
        }}
        icon={<FiChevronUp />}
        onClick={handleScroll}
      />
    </Box>
  );
};

export default ScrollToTopButton;
