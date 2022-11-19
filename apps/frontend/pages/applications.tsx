import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useApplicationList from '../hooks/useApplicationList';
import Link from '../components/ChakraNextLink';

const ApplicationList = () => {
  const { data: applications } = useApplicationList();

  return (
    <>
      <NextSeo title="Applications" />

      <Stack spacing={8} align="center">
        <Heading>Application List</Heading>
        <Stack spacing={4}>
          {_.map(applications, (application) => (
            <Link
              href={`/applications/${_.get(application, 'id')}`}
              key={_.get(application, 'id')}
            >
              <Heading size="md">{_.get(application, 'name')}</Heading>
            </Link>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default ApplicationList;
