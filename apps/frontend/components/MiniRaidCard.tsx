import { IConsultation, IRaid } from '@raidguild/dm-types';
import { displayDate } from '@raidguild/dm-utils';
import { Card } from '@raidguild/ui';
import _ from 'lodash';
import Link from 'next/link';

import LinkExternal from './LinkExternal';
import RaidStatusBadge from './RaidStatusBadge';

type MiniRaidCardProps = {
  consultation?: IConsultation;
  raid?: IRaid;
  newRaid?: boolean;
  noAvatar?: boolean;
  smallHeader?: boolean;
};

const MiniRaidCard = ({
  consultation,
  raid,
  newRaid,
  noAvatar,
  smallHeader,
}: MiniRaidCardProps) => {
  const specLink =
    _.chain(consultation?.links)
      .filter(
        (x) =>
          _.get(x, 'linkType.type') === 'SPECIFICATION' && !!_.get(x, 'link')
      )
      .map((x) => _.get(x, 'link'))
      .head()
      .value() ?? consultation?.link;
  return (
    <Link
      href={
        raid
          ? `/raids/${_.get(raid, 'id')}`
          : `/consultations/${_.get(consultation, 'id')}`
      }
    >
      <Card className='w-full min-h-[100px]'>
        <div className='flex items-center w-full h-full'>
          <div className='flex flex-col items-center space-x-2 w-full gap-4'>
            <h1 className='text-white text-sm md:text-md line-clamp-1'>
              {_.get(raid, 'name', _.get(consultation, 'name'))}
            </h1>
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center gap-3'>
                {_.get(raid, 'raidStatus.raidStatus') && (
                  <RaidStatusBadge
                    status={_.get(raid, 'raidStatus.raidStatus')}
                  />
                )}
                <div className='z-50'>
                  {specLink && <LinkExternal href={specLink} label='Specs' />}
                </div>
              </div>
              <p className='text-sm text-gray-700'>
                Updated: {displayDate(_.get(raid, 'updatedAt'))}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MiniRaidCard;
