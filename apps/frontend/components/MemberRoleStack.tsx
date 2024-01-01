import { Box, Flex } from '@raidguild/design-system';
import { IMember } from '@raidguild/dm-types';
import _ from 'lodash';
import { ReactNode } from 'react';

import ChakraNextLink from './ChakraNextLink';

type MemberRoleStackProps = {
  member?: Partial<IMember>;
  withLink?: boolean;
  button?: ReactNode;
  children: ReactNode;
};

const MemberRoleStack = ({
  member,
  withLink,
  button,
  children,
}: MemberRoleStackProps) => (
  <Flex
    key={_.get(member, 'id', 'roles')}
    justify='space-between'
    align='center'
  >
    {!withLink ? (
      <>
        {children}

        <Box ml={2}>{button}</Box>
      </>
    ) : (
      <>
        <ChakraNextLink href={`/members/${member?.ethAddress}/`}>
          {children}
        </ChakraNextLink>
        {button}
      </>
    )}
  </Flex>
);

export default MemberRoleStack;
