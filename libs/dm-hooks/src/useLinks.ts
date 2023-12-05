import { client, LINKS_BY_CONSULTATION_QUERY, LINKS_BY_RAID_QUERY } from '@raidguild/dm-graphql';
import { useQuery } from '@tanstack/react-query';

const useLinks = (query, id, token) => {
  const linksQueryResult = async () => {
    if (!id || !token) return null;

    const result = await client({ token }).request(query, {
      [id.endsWith('ionId') ? 'consultation_id' : 'raid_id']: id,
    });

    return result;
  };

  const { isLoading, isFetching, isError, error, data } = useQuery(
    [id],
    linksQueryResult,
    {
      enabled: Boolean(token) && Boolean(id),
    }
  );

  return { isLoading, isFetching, isError, error, data };
};

export const useLinksByConsultation = ({ consultationId, token }) =>
  useLinks(LINKS_BY_CONSULTATION_QUERY, consultationId, token);

export const useLinksByRaid = ({ raidId, token }) =>
  useLinks(LINKS_BY_RAID_QUERY, raidId, token);
