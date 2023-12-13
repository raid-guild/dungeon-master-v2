import {
  convertIpfsCidV0ToByte32,
  fetchToken,
  handleDetailsPin,
} from '@raidguild/escrow-utils';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const useDetailsPin = ({
  projectName,
  projectDescription,
  projectAgreement,
  startDate,
  endDate,
}) => {
  const detailsData = useMemo(
    () => ({
      projectName,
      projectDescription,
      projectAgreement,
      startDate,
      endDate,
    }),
    [projectName, projectDescription, projectAgreement, startDate, endDate]
  );

  const detailsPin = async () => {
    const token = await fetchToken();
    const details = await handleDetailsPin({
      details: detailsData,
      name: `${projectName}-${startDate}`,
      token,
    });

    const bytes32hash = convertIpfsCidV0ToByte32(details);

    return bytes32hash;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'detailsPin',
      { projectName, projectDescription, projectAgreement, startDate, endDate },
    ],
    queryFn: detailsPin,
    enabled: !!projectName && !!projectDescription && !!startDate && !!endDate,
  });

  return { data, isLoading, error };
};

export default useDetailsPin;
