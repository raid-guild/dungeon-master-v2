/* eslint-disable no-use-before-define */

// TODO: Finish this file

import _ from 'lodash';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { RIP_DETAIL_QUERY } from '@raidguild/dm-graphql';
import { raidSortKeys } from '@raidguild/dm-types';
import { camelize, IRaid } from '@raidguild/dm-utils';

type RipDetailType = {
  token: string;
  repositoryOwner: string;
  repositoryName: string;
  projectNumber: number;
  projectColumns: number;
  cardsToGet: number;
};

const useRipList = ({
  token,
  repositoryOwner = 'raid-guild',
  repositoryName = 'RIPs',
  projectNumber = 1,
  projectColumns = 6,
  cardsToGet = 50,
}: RipDetailType) => {
  const ripQueryResult = async () => {
    if (!token) return null;

    const result = await
  }


  return {
    status,
    error,
    data,
  };

};
