import { Button, Input, Stack } from '@raidguild/design-system';
import { useLinksUpdate } from '@raidguild/dm-hooks';
import { ILink, IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface RetroLinkProps {
  raidId?: string;
  closeModal?: () => void;
  updateStatus: any;
  raid: Partial<IRaid>;
}

const linkTypes = ['RETROSPECTIVE'];

const RaidRetroModal: React.FC<RetroLinkProps> = ({
  raidId,
  closeModal,
  updateStatus,
  raid,
}: RetroLinkProps) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const [sending, setSending] = useState(false);

  const { links } = raid.consultation;

  const { mutateAsync: updateLinks } = useLinksUpdate({
    token,
    consultationId: raid.consultation.id,
  });

  const localForm = useForm({
    mode: 'all',
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = localForm;

  async function onSubmit(values) {
    setSending(true);

    const linkUpdates = _.map(
      linkTypes,
      (type) =>
        ({
          consultation_id: raid.consultation.id,
          type: type as string,
          link: values[type as string] as string,
        } as unknown as ILink)
    );

    await updateLinks(linkUpdates);
    await updateStatus({
      raid_updates: {
        status_key: 'SHIPPED',
      },
    });
    closeModal();
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4} gap={4}>
        {linkTypes.map((linkType, index) => (
          <Input
            key={linkType}
            name={linkType}
            // eslint-disable-next-line dot-notation
            defaultValue={
              (_.find(links, { type: linkType }) as ILink)?.link || ''
            }
            aria-label={linkType}
            placeholder={_.startCase(_.toLower(linkType))}
            rounded='base'
            label={_.startCase(_.toLower(linkType))}
            localForm={localForm}
          />
        ))}

        <Button isLoading={isSubmitting || sending} type='submit'>
          Update Retro Link
        </Button>
      </Stack>
    </form>
  );
};

export default RaidRetroModal;
