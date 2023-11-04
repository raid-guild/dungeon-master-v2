/* eslint-disable no-use-before-define */
import {
  client,
  RAIDING_RAIDS_BY_LAST_UPDATE,
  RAIDS_COUNT_QUERY,
  RAIDS_LIST_AND_LAST_UPDATE_QUERY,
} from "@raidguild/dm-graphql";
import { raidSortKeys } from "@raidguild/dm-types";
import { camelize, IRaid } from "@raidguild/dm-utils";
import { checkProperties } from "ethers/lib/utils.js";

const where = (
  raidStatusFilterKey: string,
  raidRolesFilterKey: string,
  raidSortKey: raidSortKeys,
) => ({
  ...(raidStatusFilterKey === "ACTIVE" && {
    _or: [
      { status_key: { _eq: "PREPARING" } },
      { status_key: { _eq: "RAIDING" } },
      { status_key: { _eq: "AWAITING" } },
    ],
  }),
  ...(raidStatusFilterKey !== "ACTIVE" &&
    raidStatusFilterKey !== "ALL" && {
    status_key: { _eq: raidStatusFilterKey },
  }),
  ...(raidStatusFilterKey === "ALL" && {}),
  ...(raidSortKey === "oldestComment" && {
    _or: [
      { status_key: { _eq: "PREPARING" } },
      { status_key: { _eq: "RAIDING" } },
      { status_key: { _eq: "AWAITING" } },
    ],
  }),
  ...(raidRolesFilterKey !== "ANY_ROLE_SET" &&
    raidRolesFilterKey !== "ALL" && {
    raids_roles_required: {
      guild_class: { guild_class: { _in: raidRolesFilterKey } },
    },
  }),
  ...(raidRolesFilterKey === "ANY_ROLE_SET" && {
    raids_roles_required_aggregate: { count: { predicate: { _gt: 0 } } },
  }),
  ...(raidRolesFilterKey === "ALL" && {}),
});

const orderBy = (raidSortKey: raidSortKeys) => ({
  ...(raidSortKey === "oldestComment" && {
    updates_aggregate: {
      min: {
        created_at: "asc_nulls_first",
      },
    },
  }),
  ...(raidSortKey === "recentComment" && {
    updates_aggregate: {
      min: {
        created_at: "desc_nulls_last",
      },
    },
  }),
  ...(raidSortKey === "name" && {
    name: "asc",
  }),
  ...(raidSortKey === "createDate" && {
    end_date: "asc",
  }),
  ...(raidSortKey === "startDate" && {
    start_date: "asc",
  }),
  ...(raidSortKey === "endDate" && {
    end_date: "asc",
  }),
  ...(raidSortKey === "recentlyUpdated" && {
    updated_at: "asc",
  }),
});

const latestUpdateOrderBy = (raidSortKey: raidSortKeys) => ({
  ...(raidSortKey === "oldestComment" && {
    latest_update_created_at: "asc_nulls_first",
  }),
  ...(raidSortKey === "recentComment" && {
    latest_update_created_at: "desc_nulls_last",
  }),
});

// return asc_nulls_first or desc_nulls_last
// const latestUpdateOrderBy = (raidSortKey: raidSortKeys) => {
//   if (raidSortKey === 'oldestComment') {
//     return 'asc_nulls_first';
//   } else if (raidSortKey === 'recentComment') {
//     return 'desc_nulls_last';
//   }
// };

type RaidListType = {
  token: string;
  raidStatusFilterKey: string;
  raidRolesFilterKey: string;
  raidSortKey: raidSortKeys;
};

const useRaidList = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
}: RaidListType) => {
  const limit = 15;

  const raidQueryResult = async (pageParam: number) => {
    if (!token) return null;

    if (raidSortKey === "oldestComment" || raidSortKey === "recentComment") {
      const result = await client({ token }).request(
        RAIDS_LIST_AND_LAST_UPDATE_QUERY,
        {
          where: where(raidStatusFilterKey, raidRolesFilterKey, raidSortKey),
          limit,
          offset: pageParam * limit,
          order_by: orderBy("name"),
          latest_update_order_by: latestUpdateOrderBy(raidSortKey),
        },
      );

      const justLatestUpdates = _.get(result, "raiding_raids_by_last_update");
      console.log("justLatestUpdates", justLatestUpdates);

      // example return from result:
      // {
      //   "data": {
      //     "raids": [
      //       {
      //         "id": "c032b772-627e-4fcb-9e2b-95db3da160d3",
      //         "name": "Owocki's Skunk Squad (Retainer)",
      //         "created_at": "2023-04-20T21:24:21.69644+00:00",
      //         "updated_at": "2023-04-20T21:24:21.69644+00:00",
      //         "start_date": "2023-04-20T21:25:14+00:00",
      //         "end_date": "2023-08-01T21:25:14+00:00",
      //         "updates": [
      //           {
      //             "created_at": "2023-10-17T17:28:07.584924+00:00",
      //             "id": "17b639f4-fb0e-4e4d-a76a-c851d6dda4ec",
      //             "member": {
      //               "name": "Derrek",
      //               "eth_address": "0x2606cb984b962ad4aa1ef00f9af9b654b435ad44",
      //               "id": "a1b8ecd5-5893-4df3-8806-ac7e9f6a03f6"
      //             },
      //             "update": "Retainer model ongoing for Discord support and small dev tweaks. Likely to continue through EOY."
      //           }
      //         ]
      //       },
      //       {
      //         "id": "92744abb-f4bd-42d5-90e1-2463b7ccea65",
      //         "name": "Secret Sauce (partial scope)",
      //         "created_at": "2023-09-07T17:07:36.086061+00:00",
      //         "updated_at": "2023-09-07T17:07:36.086061+00:00",
      //         "start_date": null,
      //         "end_date": null,
      //         "updates": [
      //           {
      //             "created_at": "2023-11-03T08:24:27.500419+00:00",
      //             "id": "a826bda9-1162-49a1-98b3-11602d0b26e0",
      //             "member": {
      //               "name": "Saimano",
      //               "eth_address": "0xe68967c95f5a9bccfdd711a2cbc23ec958f147ef",
      //               "id": "d799afce-895a-44bc-8c44-003ae226f298"
      //             },
      //             "update": "Redesigned the UI/UX & have the testnet global settlement environment configured, triggered and connected to the frontend. Working on the final implementation for withdraw and redeem collateral & coins."
      //           }
      //         ]
      //       },
      //       {
      //         "id": "f247ca6e-3dec-407b-a0d2-3dc488dc65c9",
      //         "name": "Factland",
      //         "created_at": "2023-09-25T22:57:13.608264+00:00",
      //         "updated_at": "2023-09-25T22:57:13.608264+00:00",
      //         "start_date": null,
      //         "end_date": null,
      //         "updates": [
      //           {
      //             "created_at": "2023-10-31T17:20:45.58069+00:00",
      //             "id": "82f752bf-299e-4da7-8e94-c6a8aa5232aa",
      //             "member": {
      //               "name": "Derrek",
      //               "eth_address": "0x2606cb984b962ad4aa1ef00f9af9b654b435ad44",
      //               "id": "a1b8ecd5-5893-4df3-8806-ac7e9f6a03f6"
      //             },
      //             "update": "Holding pattern. Scheduling second scoping session. Pleasantly surprised at enthusiasm from team after last scoping sesh. 🤞"
      //           }
      //         ]
      //       },
      //       {
      //         "id": "dc6aa28a-aac9-4f0b-a820-c9193b38d0a8",
      //         "name": "POKT Website Rebuild",
      //         "created_at": "2023-09-28T21:25:13.93074+00:00",
      //         "updated_at": "2023-09-28T21:25:13.93074+00:00",
      //         "start_date": null,
      //         "end_date": null,
      //         "updates": [
      //           {
      //             "created_at": "2023-10-31T17:17:08.486523+00:00",
      //             "id": "3a0bed5c-6f6b-4df2-9445-77c99b47ef8a",
      //             "member": {
      //               "name": "Sasquatch",
      //               "eth_address": "0x68f272fcaae074cb33e68d88a32c325ed0df8379",
      //               "id": "77611144-571f-4285-9444-398e834b6449"
      //             },
      //             "update": "wireframes are in review, webflow build has commenced. Bennisan and Bingo are OOO, Sass running comms"
      //           }
      //         ]
      //       }
      //     ],
      //     "raids_aggregate": {
      //       "aggregate": {
      //         "count": 4
      //       }
      //     }
      //   }
      // }

      // example return from latestUpdateResult:
      // {
      //   "data": {
      //     "raiding_raids_by_last_update": [
      //       {
      //         "latest_update_created_at": "2023-10-17T17:28:07.584924+00:00",
      //         "latest_update": "Retainer model ongoing for Discord support and small dev tweaks. Likely to continue through EOY.",
      //         "raid_id": "c032b772-627e-4fcb-9e2b-95db3da160d3",
      //         "raid_name": "Owocki's Skunk Squad (Retainer)"
      //       },
      //       {
      //         "latest_update_created_at": "2023-10-31T17:17:08.486523+00:00",
      //         "latest_update": "wireframes are in review, webflow build has commenced. Bennisan and Bingo are OOO, Sass running comms",
      //         "raid_id": "dc6aa28a-aac9-4f0b-a820-c9193b38d0a8",
      //         "raid_name": "POKT Website Rebuild"
      //       },
      //       {
      //         "latest_update_created_at": "2023-10-31T17:20:45.58069+00:00",
      //         "latest_update": "Holding pattern. Scheduling second scoping session. Pleasantly surprised at enthusiasm from team after last scoping sesh. 🤞",
      //         "raid_id": "f247ca6e-3dec-407b-a0d2-3dc488dc65c9",
      //         "raid_name": "Factland"
      //       },
      //       {
      //         "latest_update_created_at": "2023-11-03T08:24:27.500419+00:00",
      //         "latest_update": "Redesigned the UI/UX & have the testnet global settlement environment configured, triggered and connected to the frontend. Working on the final implementation for withdraw and redeem collateral & coins.",
      //         "raid_id": "92744abb-f4bd-42d5-90e1-2463b7ccea65",
      //         "raid_name": "Secret Sauce (partial scope)"
      //       }
      //     ]
      //   }
      // }

      // const filteredAndOrderedResult = _.map(
      //   _.get(latestUpdateResult, 'raiding_raids_by_last_update'),
      //   (lastUpdate) => {
      //     const raid = _.find(
      //       _.get(result, 'raids'),
      //       (raid) => raid.id === lastUpdate.raid_id
      //     );

      //     return {
      //       ...raid,
      //       latest_update_created_at: lastUpdate.latest_update_created_at,
      //       latest_update: lastUpdate.latest_update,
      //     };
      //   }
      // );

      return camelize(_.get(result, "raids"));
    }

    const result = await client({ token }).request(RAIDS_LIST_QUERY, {
      where: where(raidStatusFilterKey, raidRolesFilterKey, raidSortKey),
      limit,
      offset: pageParam * limit,
      order_by: orderBy(raidSortKey),
    });

    return camelize(_.get(result, "raids"));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<Array<IRaid>>, Error>({
    queryKey: [
      "raidsList",
      raidStatusFilterKey,
      raidRolesFilterKey,
      raidSortKey,
    ],
    queryFn: ({ pageParam = 0 }) => raidQueryResult(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      _.isEmpty(lastPage)
        ? undefined
        : _.divide(_.size(_.flatten(allPages)), limit),
    enabled: Boolean(token),
  });

  return {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
  };
};

export default useRaidList;

type RaidsCountType = {
  token: string;
  raidStatusFilterKey: string;
  raidRolesFilterKey: string;
  raidSortKey: raidSortKeys;
};

export const useRaidsCount = ({
  token,
  raidStatusFilterKey,
  raidRolesFilterKey,
  raidSortKey,
}: RaidsCountType) => {
  const raidsCountQuery = async () => {
    const result = await client({ token }).request(RAIDS_COUNT_QUERY, {
      where: where(raidStatusFilterKey, raidRolesFilterKey, raidSortKey),
    });

    return _.get(result, "raids_aggregate.aggregate.count", 0);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["raidsCount", raidStatusFilterKey, raidRolesFilterKey],
    queryFn: raidsCountQuery,
    enabled: Boolean(token),
  });

  return { data, isLoading, error };
};
