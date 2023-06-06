import { useQuery } from '@tanstack/react-query';
import {
  client,
  RAID_BY_ID_QUERY,
  RAID_BY_V1_ID_QUERY,
} from '@raidguild/dm-graphql';

const useRaidValidate = ({
  token,
  raidId,
}: {
  token: string;
  raidId: string;
}) => {
  const raidValidResults = async () => {
    if (!raidId) return null;
    const v2Id = raidId.includes('-');
    const variables = {} as any;
    if (v2Id) {
      variables.raidId = raidId;
    } else {
      variables.v1Id = raidId;
    }

    const result = await client({ token }).request(
      v2Id ? RAID_BY_ID_QUERY : RAID_BY_V1_ID_QUERY,
      {
        ...variables,
      }
    );
    console.log('useRaidValidate result', result);
    return result?.raids;
  };

  const { status, error, data, isLoading } = useQuery<any, Error>({
    queryKey: ['raidValidate', raidId],
    queryFn: raidValidResults,
    enabled: !!token && !!raidId,
  });

  return { status, error, data, isLoading };
};

export default useRaidValidate;
