import { Button, Collapse, Text, VStack } from '@raidguild/design-system';
import React, { useEffect, useRef, useState } from 'react';

const Description = ({
  description,
  startingHeight = 75,
  label,
}: {
  description: string;
  startingHeight?: number;
  label?: string;
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const handleToggleDesc = () => setShowFullDescription(!showFullDescription);

  useEffect(() => {
    if (textRef.current) {
      const { clientHeight } = textRef.current;
      setShowToggle(clientHeight > startingHeight);
    }
  }, [description, startingHeight]);

  return (
    <VStack align='flex-start' width='100%'>
      {label && (
        <Text fontSize='xs' color='purple.200' textTransform='capitalize'>
          {label}
        </Text>
      )}
      <Collapse startingHeight={startingHeight} in={showFullDescription}>
        <div ref={textRef}>
          <Text color='white' fontSize='md'>
            {description}
          </Text>
        </div>
      </Collapse>
      {showToggle && (
        <Button
          onClick={handleToggleDesc}
          color='gray.400'
          size='sm'
          fontWeight='normal'
          variant='link'
        >
          {showFullDescription ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </VStack>
  );
};

export default Description;
