import {
  Button,
  Input,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@raidguild/design-system';
import { usePortfolioUpdate } from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import ImageUpload from '../ImageUpload';

interface PortfolioUpdateProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
}

const questions = [
  {
    label: 'The Challenge',
    name: 'challenge',
  },
  {
    label: 'The Approach',
    name: 'approach',
  },
  {
    label: 'The Results',
    name: 'result',
  },
];

const categoryOptions = [
  {
    label: 'Design Sprint',
    value: 'DESIGN_SPRINT',
  },
  {
    label: 'Backend',
    value: 'BACKEND',
  },
  {
    label: 'Frontend',
    value: 'FRONTEND',
  },
  {
    label: 'Full Stack',
    value: 'FULL_STACK',
  },
  {
    label: 'Marketing',
    value: 'MARKETING',
  },
  {
    label: 'Smart Cpntracts',
    value: 'SMART_CONTRACTS',
  },
];

const PortfolioUpdateForm: React.FC<PortfolioUpdateProps> = ({
  raidId,
  closeModal,
  raid,
}: PortfolioUpdateProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const localForm = useForm({
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = localForm;

  const [sending, setSending] = useState(false);

  const portfolio = _.first(raid.portfolios);

  const { mutateAsync: updatePortfolio } = usePortfolioUpdate({
    token,
    portfolioId: portfolio?.id ?? '',
  });

  const onSubmit = async (values) => {
    setSending(true);
    await updatePortfolio({
      portfolio: {
        raid_id: raidId,
        name: values.projectName ?? portfolio?.name,
        slug: values.slug ?? portfolio?.slug,
        repo_link: values.githubUrl ?? portfolio?.repo_link,
        description: values.description ?? portfolio?.description,
        challenge: {
          content: [values.challenge ?? portfolio?.challenge.content[0]],
        },
        approach: {
          content: [values.approach ?? portfolio?.approach.content[0]],
        },
        result: {
          content: [values.result ?? portfolio?.result.content[0]],
        },
        category: values.categoryOptions.value ?? portfolio?.category,
        result_link: values.resultLink ?? portfolio?.result_link,
        image_url: '',
      },
    });

    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack width='full' gap={4} mb={4}>
        <Input
          label='Project Name'
          name='projectName'
          localForm={localForm}
          defaultValue={portfolio?.name ?? ''}
          placeholder='Project Name'
        />
        <Input
          label='Project Slug:'
          name='slug'
          localForm={localForm}
          defaultValue={portfolio?.slug ?? ''}
          placeholder='Project Slug'
        />

        <Input
          label='Result Link:'
          name='resultLink'
          localForm={localForm}
          defaultValue={portfolio?.result_link ?? ''}
          placeholder='Result Link'
        />

        <Input
          label='Github:'
          name='githubUrl'
          localForm={localForm}
          defaultValue={portfolio?.repo_link ?? ''}
          placeholder='Github URL'
        />
        <Input
          label='Description:'
          name='description'
          localForm={localForm}
          defaultValue={portfolio?.description ?? ''}
          placeholder='Project Description'
        />

        <VStack alignItems='flex-start' width='100%'>
          <ImageUpload
            name='imageUrl'
            label='Project Logo:'
            localForm={localForm}
            defaultValue={portfolio?.image_url}
          />
        </VStack>
        {questions.map((question) => (
          <Stack width='full' key={question.label}>
            <Textarea
              label={question.label}
              name={question.name}
              localForm={localForm}
              fontFamily='texturina'
              defaultValue={
                // eslint-disable-next-line no-nested-ternary
                (question.name === 'challenge'
                  ? portfolio?.challenge.content[0]
                  : question.name === 'approach'
                  ? portfolio?.approach.content[0]
                  : portfolio?.result.content[0]) ?? ''
              }
            />
            <Text fontSize='0.8rem'>
              This textarea accepts{' '}
              <Link
                href='https://daringfireball.net/projects/markdown/basics'
                isExternal
              >
                markdown
              </Link>
            </Text>
          </Stack>
        ))}

        <Select
          name='categoryOptions'
          label='Project Category'
          defaultValue={_.find(categoryOptions, {
            value: portfolio?.category,
          })}
          options={categoryOptions}
          localForm={localForm}
        />
      </Stack>

      <Button isLoading={isSubmitting || sending} type='submit' w='100%'>
        Publish Portfolio Updates
      </Button>
    </form>
  );
};

export default PortfolioUpdateForm;
