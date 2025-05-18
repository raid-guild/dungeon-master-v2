import { useToggleInterest } from '@raidguild/dm-hooks';
import { IConsultation, IRaid } from '@raidguild/dm-types';
import {
  BUDGET_DISPLAY,
  GUILD_CLASS_DISPLAY,
  GUILD_CLASS_ICON,
  PROJECT_TYPE_DISPLAY,
  ProjectTypeKey,
  RAID_CATEGORY_DISPLAY,
} from '@raidguild/dm-utils';
import {
  Avatar,
  Button,
  Card,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@raidguild/ui';
import _ from 'lodash';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaCheck } from 'react-icons/fa';

import InfoStack from './InfoStack';
import LinkExternal from './LinkExternal';
import RaidStatusBadge from './RaidStatusBadge';

type DashboardRaidCardProps = {
  consultation?: IConsultation;
  raid?: IRaid;
  newRaid?: boolean;
  noAvatar?: boolean;
  smallHeader?: boolean;
};

const DashboardRaidCard = ({
  consultation,
  raid,
  newRaid,
  noAvatar,
  smallHeader,
}: DashboardRaidCardProps) => {
  const specLink =
    _.chain(consultation?.links)
      .filter(
        (x) =>
          _.get(x, 'linkType.type') === 'SPECIFICATION' && !!_.get(x, 'link')
      )
      .map((x) => _.get(x, 'link'))
      .head()
      .value() ?? consultation?.link;

  const budget =
    BUDGET_DISPLAY[
      _.get(
        raid ? raid?.consultation : consultation,
        'budgetOption.budgetOption'
      )
    ];

  const { data: session } = useSession();
  const { token } = session;
  const memberId = session?.user?.id;

  const { mutateAsync: toggleSignal } = useToggleInterest({
    token,
    memberId,
    consultationId: (raid?.consultation || consultation)?.id,
  });
  const projectType = PROJECT_TYPE_DISPLAY(
    _.get(
      raid?.consultation || consultation,
      'projectType.projectType'
    ) as ProjectTypeKey
  );
  const rolesRequired = _.map(_.get(raid, 'raidsRolesRequired', []), 'role');

  const raidContact = _.first([
    raid
      ? raid.consultation.consultationsContacts
      : consultation?.consultationsContacts,
  ])[0];

  const interestExists = _.find(
    (raid?.consultation || consultation)?.signalledInterests,
    { memberId }
  );

  const action = interestExists ? 'delete' : 'insert';

  // const isMobile = useBreakpointValue({ base: true, md: false });

  // const signalLabel = isMobile ? 'Signal' : 'Signal Interest';

  return (
    <Card className='w-full min-h-[100px]'>
      <div className='flex items-center w-full h-full'>
        <Link
          href={
            raid
              ? `/raids/${_.get(raid, 'id')}`
              : `/consultations/${_.get(consultation, 'id')}`
          }
        >
          <div className='flex flex-col gap-4 w-full space-y-2'>
            <h1 className={`${smallHeader ? 'text-sm' : 'text-md'}`}>
              {_.get(raid, 'name', _.get(consultation, 'name'))}
            </h1>
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
          </div>
        </Link>
        <Tooltip>
          <TooltipTrigger aria-label='Interest Button'>
            <Button
              className='gap-2'
              onClick={() => {
                toggleSignal({ action, id: interestExists?.id });
              }}
              variant='outline'
            >
              {interestExists && <FaCheck />}
              {interestExists ? 'Interested' : 'Signal Interest'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{interestExists ? 'Remove Interest' : 'Add Interest'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='flex space-x-px w-full gap-14'>
        <InfoStack label='Budget' details={budget || '-'} />
        {_.get(raid, 'raidCategory.raidCategory') && (
          <InfoStack
            label='Category'
            details={
              RAID_CATEGORY_DISPLAY[
                _.get(raid, 'raidCategory.raidCategory', '-')
              ]
            }
          />
        )}

        {!_.isEmpty(raid) && (
          <InfoStack
            label='Roles Required'
            details={
              !_.isEmpty(rolesRequired) ? (
                <div className='flex items-center mb-4 md:mb-0 mr-4'>
                  <div>
                    {_.map(rolesRequired, (role: string) => (
                      <div key={role}>
                        <Tooltip>
                          <TooltipTrigger
                            aria-label={GUILD_CLASS_DISPLAY[role]}
                          >
                            <div className='flex items-center justify-center border-2 rounded-full w-10 h-10'>
                              {GUILD_CLASS_ICON[role]}
                            </div>
                            {/* <Avatar
                            <RoleBadge
                              roleName={GUILD_CLASS_ICON[role]}
                              width='44px'
                              height='44px'
                              border='2px solid'
                            />
                            /> */}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{GUILD_CLASS_DISPLAY[role]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                '-'
              )
            }
          />
        )}

        <InfoStack
          label='Submitted By'
          details={
            _.get(raidContact, 'contact.contactInfo.twitter') ||
            _.get(raidContact, 'contact.contactInfo.github') ||
            _.get(raidContact, 'contact.contactInfo.discord') ||
            _.get(raidContact, 'contact.name') ||
            _.get(raidContact, 'contact.contactInfo.email') ||
            '-'
          }
        />
        <InfoStack label='Project Type' details={projectType || '-'} />
      </div>
    </Card>
  );
};

export default DashboardRaidCard;
