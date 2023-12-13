import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  DatePicker,
  Flex,
  HStack,
  Input,
  Stack,
  Textarea,
} from '@raidguild/design-system';
import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';

const DEFAULT_AGREEMENT_URL = 'https://urlToAgreement.com';

const sevenDaysFromNow = new Date();
sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

const validationSchema = Yup.object().shape({
  projectName: Yup.string().required('Project Name is required'),
  projectDescription: Yup.string().required('Project Description is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
});

const ProjectDetailsForm = ({
  escrowForm,
  updateStep,
}: {
  escrowForm: UseFormReturn;
  updateStep: () => void;
}) => {
  const { setValue, watch } = escrowForm;
  const { projectName, projectDescription, startDate, endDate } = watch();
  const localForm = useForm({
    resolver: yupResolver(validationSchema),
  });
  const {
    handleSubmit,
    setValue: localSetValue,
    watch: localWatch,
  } = localForm;
  const { startDate: localStartDate, endDate: localEndDate } = localWatch();

  const onSubmit = (values: any) => {
    console.log('submitting');
    setValue('projectName', values.projectName);
    setValue('projectDescription', values.projectDescription);
    setValue('projectAgreement', [
      {
        type: 'https',
        src: DEFAULT_AGREEMENT_URL, // lexdao default agreement
        createdAt: Math.floor(Date.now() / 1000),
      },
    ]);
    setValue('startDate', values.startDate);
    setValue('endDate', values.endDate);

    // move form
    updateStep();
  };

  useEffect(() => {
    console.log(projectName, projectDescription, startDate, endDate);
    localSetValue('projectName', projectName || '');
    localSetValue('projectDescription', projectDescription || '');
    localSetValue('startDate', startDate || new Date());
    localSetValue('endDate', endDate || sevenDaysFromNow);
  }, [localSetValue]);

  return (
    <Card as='form' variant='filled' onSubmit={handleSubmit(onSubmit)} p={6}>
      <Stack spacing={6} w='100%'>
        <Input
          label='Project Name'
          name='projectName'
          placeholder='An adventure slaying Moloch'
          localForm={localForm}
        />
        <Textarea
          label='Description'
          name='projectDescription'
          placeholder='Describe the project in detail. What is the scope? What are the deliverables? What are the milestones? What are the expectations?'
          variant='outline'
          localForm={localForm}
        />
        <HStack>
          <Box w='45%'>
            <DatePicker
              label='Start Date'
              name='startDate'
              localForm={localForm}
              selected={localStartDate}
              onChange={(date) => {
                localSetValue('startDate', date as Date);
              }}
            />
          </Box>
          <Box w='50%'>
            <DatePicker
              label='Estimated End Date'
              name='endDate'
              localForm={localForm}
              selected={localEndDate}
              onChange={(date) => {
                localSetValue('endDate', date as Date);
              }}
            />
          </Box>
        </HStack>

        <Flex justify='center'>
          <Button type='submit'>Next: Escrow Details</Button>
        </Flex>
      </Stack>
    </Card>
  );
};

export default ProjectDetailsForm;
