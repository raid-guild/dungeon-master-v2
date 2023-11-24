import { Button, Flex, Heading, Stack } from '@raidguild/design-system';
import { useApplicationDetail, useMemberCreate } from '@raidguild/dm-hooks';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';

import Link from '../../components/ChakraNextLink';
import MemberDetailsCard from '../../components/MemberDetailsCard';
import SiteLayout from '../../components/SiteLayout';

const Application = ({ applicationId }: { applicationId: any }) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: application } = useApplicationDetail({ token, applicationId });
  const { mutateAsync: createCohortMember } = useMemberCreate({ token });

  const handleCreateCohort = async () => {
    await createCohortMember({
      application_id: _.get(application, 'id'),
      name: _.get(application, 'name'),
      contact_info_id: _.get(application, 'contactInfo.id'),
      eth_address: _.get(application, 'ethAddress'),
      member_type_key: 'COHORT',
    });
  };
  const member = _.get(application, 'member.0');

  return (
    <>
      <NextSeo title={_.get(application, 'name')} />

      <SiteLayout
        subheader={
          <Flex justify='center'>
            <Heading>{_.get(application, 'name')}</Heading>
          </Flex>
        }
      >
        <Flex justify='center' gap={6}>
          <MemberDetailsCard application={application} />

          <Stack>
            {_.get(member, 'memberType.memberType') !== 'MEMBER' ? (
              <Button variant='outline'>Create Member</Button>
            ) : (
              <Link href={`/members/${_.get(member, 'ethAddress')}`} w='100%'>
                <Button variant='outline' w='100%'>
                  Member
                </Button>
              </Link>
            )}

            <Button
              variant='outline'
              onClick={handleCreateCohort}
              isDisabled={!_.isEmpty(_.get(application, 'member'))}
            >
              Create Apprentice
            </Button>
          </Stack>
        </Flex>
      </SiteLayout>
    </>
  );
};

// * use SSR to fetch query params for RQ invalidation
export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const { application } = context.query;

  return {
    props: {
      applicationId: application || null,
    },
  };
};

export default Application;
