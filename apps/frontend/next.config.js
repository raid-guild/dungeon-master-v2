// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nx/next/plugins/with-nx');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
  transpilePackages: [
    '@raidguild/dm-graphql',
    '@raidguild/dm-hooks',
    '@raidguild/dm-types',
    '@raidguild/dm-utils',
    '@raidguild/escrow-utils',
    '@raidguild/escrow-gql',
    '@raidguild/ui',
    '@raidguild/utils'
  ],
};

module.exports = withNx(nextConfig);
