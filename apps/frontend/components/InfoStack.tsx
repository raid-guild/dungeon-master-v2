/* eslint-disable no-nested-ternary */
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@raidguild/ui';
import _, { isString } from 'lodash';
import Link from 'next/link';
import { ReactElement } from 'react';
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'sonner';

import useClipboard from '../hooks/useClipboard';

interface InfoStackProps {
  label: string;
  details: string | ReactElement | React.ReactNode;
  fullDetails?: string;
  link?: string;
  tooltip?: string;
  copy?: boolean;
  truncate?: boolean;
}

const InfoStack = ({
  label,
  details,
  fullDetails,
  link,
  tooltip,
  copy,
  truncate = false,
}: InfoStackProps) => {
  const [copyText, onCopy] = useClipboard();

  const handleCopy = () => {
    if (link || !isString(details)) return;

    onCopy(_.isString(details) ? details : '');
    toast.info('Copied to clipboard!', {
      // description: details,
      duration: 2000,
    });
  };

  const isExternal = link && link.startsWith('http');

  return (
    <div className='flex items-center min-w-px gap-px'>
      <div className='flex flex-col items-center gap-1'>
        <p className='text-sm text-purple-200 capitalize'>{label}</p>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger aria-label={tooltip}>
              <span>
                <FaInfoCircle className='text-gray-400' />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Tooltip>
        <TooltipTrigger
          aria-label={
            link || typeof fullDetails === 'string'
              ? fullDetails
              : typeof details === 'string'
              ? details
              : ''
          }
        >
          {link && isString(details) ? (
            <Link href={link} hidden={!link}>
              <div className='flex items-center gap-1'>
                <p className='font-mono'>
                  {details.replace(/https?:\/\//g, '')}
                </p>
                {isExternal && <FaExternalLinkAlt className='text-gray-400' />}
              </div>
            </Link>
          ) : (
            <Button
              type='button'
              className={`${
                copy ? 'cursor-pointer' : ''
              } line-clamp-1 font-mono text-left`}
              onClick={() => copy && handleCopy()}
              onKeyDown={(e) => copy && e.key === 'Enter' && handleCopy()}
              disabled={!copy}
            >
              {details || '-'}
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          {link || typeof fullDetails === 'string'
            ? fullDetails
            : typeof details === 'string'
            ? details
            : ''}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default InfoStack;
