import { Button, Input, Link, Select, Stack, Text, Textarea, VStack } from '@raidguild/design-system';
import { IRaid } from "@raidguild/dm-types";
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
    
    const localForm = useForm({
      mode: "all",
    });
    
    const {
      handleSubmit,
      control,
      watch,
      formState: { isSubmitting },
    } = localForm;
  
  const [sending, setSending] = useState(false);
  

  const [isPublished, setIsPublished] = useState(true);




  let portfolio:any
   // ?? usePortfolio(raidId); // todo: usePortfolio hook

  const onSubmit = (data: FieldValues) => {
    
    // submit form
  };


return    (
    <VStack width='full' gap={14} fontFamily='texturina'>
    <Input
      label='Project Name'
      name='projectName'
      localForm={localForm}
      defaultValue={ portfolio?.name ?? ''}
     
    />
    <Input
      label='Project Slug:'
      name='slug'
      localForm={localForm}
      defaultValue={ portfolio?.slug ?? ''}
     
    />
    <Input
      label='Github:'
      name='githubUrl'
      localForm={localForm}
      defaultValue={ portfolio?.repoLink ?? ''}
     
    />
    <Input
      label='Description:'
      name='description'
      localForm={localForm}
      defaultValue={ portfolio?.description ?? ''}
     
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
           ( question.name === 'challenge'
              ? portfolio?.challenge.content[0]
              : question.name === 'approach'
              ? portfolio?.approach.content[0]
              : portfolio?.result.content[0]) ?? ''
          }
  
        />
        <Text fontSize='0.8rem'>
          This textarea accepts{' '}
          <Link href='https://daringfireball.net/projects/markdown/basics' isExternal>
            markdown
          </Link>
        </Text>
      </Stack>
    ))}
    <Select name='categoryOptions' localForm={localForm} options={categoryOptions} variant='outline' />

    <Button
                  isLoading={isSubmitting || sending}
                  type="submit"
                  width="full"
                  color="raid"
                  borderColor="raid"
                  border="1px solid"
                  size="md"
                  textTransform="uppercase"
                  fontSize="sm"
                  fontWeight="bold"
                >
      <Button width='200px'>{isPublished ? 'Unpublish' : 'Publish Update'}</Button>
    </Button>
  </VStack>
  )
}

export default PortfolioUpdateForm;