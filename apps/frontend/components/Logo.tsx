import { Image, Stack } from '@raidguild/design-system';

const Logo = () => (
  <Stack
    direction='row'
    justifyContent='center'
    alignItems='center'
    maxWidth={{ base: '150px', lg: '180px' }}
    width={{ base: '150px', lg: '180px' }}
    height={{ base: 12 }}
  >
    <Image
      src='/raidguild-logo.png'
      alt="Raid Guild logo: Crossed swords with 'Raid Guild'"
      objectFit='contain'
      width={{ base: '150px', lg: '168px' }}
      height={{ base: '4rem' }}
    />
  </Stack>
);

export default Logo;
