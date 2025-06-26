import _ from 'lodash';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import useMediaQuery from '../hooks/useMediaQuery';
import RaidGuild from './icons/RaidGuild';

const links = [
  // { label: 'Consultation Queue', link: 'https://www.raidguild.org/hire/1' },
  { label: 'Handbook', link: 'https://handbook.raidguild.org' },
  { label: 'Smart Invoice', link: 'https://smartinvoice.xyz' },
  { label: 'Origins', link: 'https://origins.raidguild.org' },
  {
    label: 'Valhalla',
    link: 'https://the-valhalla.vercel.app',
    type: 'member',
  },
];

const Footer = () => {
  const matches = useMediaQuery('(max-width: 780px)');
  const { data: session } = useSession();

  const filteredLinks = !session ? _.reject(links, ['type', 'member']) : links;

  return (
    <div className='flex w-full items-center justify-around mb-20 mt-40'>
      {!matches ? (
        <div className='my-6 mr-48'>
          <Link
            className='flex flex-col items-center justify-center gap-1.5'
            href='https://raidguild.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            <h1 className='font-uncial text-xl font-semibold text-white'>
              Brought to you by:
            </h1>
            <RaidGuild className='text-primary h-14 w-50' />
          </Link>
        </div>
      ) : (
        <h1 className='text-sm'>RaidGuild</h1>
      )}
      <div className='flex flex-col'>
        {_.map(filteredLinks, (link) => (
          <Link
            className='text-sm text-white hover:underline'
            href={link.link}
            target='_blank'
            key={link.link}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
