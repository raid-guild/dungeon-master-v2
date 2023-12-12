import {
  Button,
  Input,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
  VStack
} from '@raidguild/design-system';
import { usePortfolioDetails,usePortfolioUpdate } from '@raidguild/dm-hooks';
import { IPortfolioUpdate, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

interface PortfolioUpdateProps {
  raidId?: string;
  closeModal?: () => void;
  raid: Partial<IRaid>;
  // consultation:  Partial<IConsultation>;
}

const questions = [
  {
    label: 'The Challenge',
    name: 'challenge'
  },
  {
    label: 'The Approach',
    name: 'approach'
  },
  {
    label: 'The Results',
    name: 'result'
  }
];

const categoryOptions = [
  {
    label: 'Design Sprint',
    value: 'DESIGN_SPRINT'
  },
  {
    label: 'Backend',
    value: 'BACKEND'
  },
  {
    label: 'Frontend',
    value: 'FRONTEND'
  },
  {
    label: 'Full Stack',
    value: 'FULL_STACK'
  },
  {
    label: 'Marketing',
    value: 'MARKETING'
  },
  {
    label: 'Smart Cpntracts',
    value: 'SMART_CONTRACTS'
  }
];

const PortfolioUpdateForm: React.FC<PortfolioUpdateProps> = ({
  raidId,
  closeModal,
  raid
}: PortfolioUpdateProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const localForm = useForm({
    mode: 'all'
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting }
  } = localForm;

  const [sending, setSending] = useState(false);

  const [isPublished, setIsPublished] = useState(true);

  const {data} = usePortfolioDetails({raidId, token});

  const portfolio = data?.portfolio ?? {};
  console.log(portfolio);

  const { mutateAsync: updatePortfolio } = usePortfolioUpdate(token);

  const onSubmit = (values) => {
    
    console.log(values);


    setSending(true);
    updatePortfolio({
      portfolio: {
        raid_id: raidId,
        name: values.projectName ?? portfolio?.name,
        slug: values.slug ?? portfolio?.slug,
        repo_link: values.githubUrl ?? portfolio?.repoLink,
        description: values.description ?? portfolio?.description,
        challenge: {
          content: [values.challenge ?? portfolio?.challenge.content[0]]
        },
        approach: {
          content: [values.approach ?? portfolio?.approach.content[0]]
        },
        result: {
          content: [values.result ?? portfolio?.result.content[0]]
        },
        category: values.categoryOptions.value ?? portfolio?.category.category,
        result_link: values.resultLink ?? portfolio?.result_link,
        image_url: ''
      },
      
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <VStack width='full' gap={14} fontFamily='texturina'>
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
        defaultValue={portfolio?.repoLink ?? ''}
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
        {/*  handle Image upload */}
        {/* <ImageUpload
        name='imageUrl'
        label='Project Logo:'
        localForm={localForm}
        defaultValue={ portfolio?.imageUrl}
      /> */}
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
        localForm={localForm}
        options={categoryOptions}
        variant='outline'
      />

      <Button
        isLoading={isSubmitting || sending}
        type='submit'
        width='full'
        color='raid'
        borderColor='raid'
        border='1px solid'
        size='md'
        textTransform='uppercase'
        fontSize='sm'
        fontWeight='bold'
      >
  
          {portfolio ? 'Unpublish' : 'Publish Portfolio Updates'}
  
      </Button>
    </VStack>
    </form>
  );
};

export default PortfolioUpdateForm;