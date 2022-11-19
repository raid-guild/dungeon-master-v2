import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useApplicationDetail from '../../hooks/useApplicationDetail';

const Application = () => {
  const { data: application } = useApplicationDetail();
  console.log(application);

  return (
    <>
      <NextSeo title="Application" />

      <Stack spacing={8} align="center">
        <Heading>Application Detail</Heading>
        <Heading size="md">{_.get(application, 'name')}</Heading>
      </Stack>
    </>
  );
};

export default Application;
