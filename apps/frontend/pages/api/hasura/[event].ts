import { NextApiRequest, NextApiResponse } from 'next';

const EventHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { event } = req.query;
  // eslint-disable-next-line no-console
  console.log(event);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({});
};

export default EventHandler;
