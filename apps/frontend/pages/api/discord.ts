import { Client, GuildMember } from 'discord.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const client = new Client({ intents: [] });
const { DISCORD_BOT_TOKEN, GUILD_ID } = process.env;

client.login(DISCORD_BOT_TOKEN);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { username } = req.query;

  if (typeof username !== 'string') {
    console.log({ message: 'Invalid username' });
    res.status(204).json({ avatarUrl: null });
  }

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const members = await guild.members.fetch();
    const member = members.find(
      (m: GuildMember) => m.user.username === username
    );

    if (!member) {
      console.log({ message: 'User not in discord or incorrect username in database' });
      res.status(204).json({ avatarUrl: null });
    }

    const avatarUrl = member.user.displayAvatarURL();
    res.status(200).json({ avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

  return res.status(500).json({ message: 'Unexpected error occurred' });
}
