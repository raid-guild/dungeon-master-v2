import _ from 'lodash';
import { Heading, Flex, Spacer, Button } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import useApplicationDetail from '../../hooks/useApplicationDetail';
import SiteLayout from '../../components/SiteLayout';
import MemberDetailsCard from '../../components/MemberDetailsCard';

const Application = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: application } = useApplicationDetail({ token });

  return (
    <>
      <NextSeo title={_.get(application, 'name')} />

      <SiteLayout
        subheader={
          <Flex justify="space-between" align="center" w="100%">
            <Spacer />
            <Spacer />
            <Heading>{_.get(application, 'name')}</Heading>
            <Spacer />
            <Button variant="outline">Create Member</Button>
          </Flex>
        }
      >
        <MemberDetailsCard application={application} />
      </SiteLayout>
    </>
  );
};

export default Application;
