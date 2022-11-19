import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useConsultationList from '../hooks/useConsultationList';
import useDefaultTitle from '../hooks/useDefaultTitle';
import Link from '../components/ChakraNextLink';

const ConsultationList = () => {
  const title = useDefaultTitle();
  const { data: consultations } = useConsultationList();

  return (
    <>
      <NextSeo title="Consultations" />

      <Stack spacing={8} align="center">
        <Heading>{title} List</Heading>
        <Stack spacing={4}>
          {_.map(consultations, (consultation) => (
            <Link
              href={`/consultations/${_.get(consultation, 'id')}`}
              key={_.get(consultation, 'id')}
            >
              <Heading size="md">{_.get(consultation, 'project_name')}</Heading>
            </Link>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default ConsultationList;
