const generateBundleDiff = async () => {
  let baseBundleSizeStats = [];
  // Get the base bundle size report from the master branch
  const baseBundleStatsURL =
    process.env.BASE_BUNDLE_SIZE_STATS_URL ||
    'https://raw.githubusercontent.com/razorpay/blade/master/packages/blade/baseBundleSizeStats.json';
  const response = await fetch(baseBundleStatsURL);

  if (response.status === 200) {
    baseBundleSizeStats = await response.json();
  }

  // eslint-disable-next-line import/extensions
  const currentBundleSizeStats = require('../PRBundleSizeStats.json');
  let bundleDiff = currentBundleSizeStats;

  if (baseBundleSizeStats.length > 0) {
    bundleDiff = baseBundleSizeStats.filter(
      ({ size: baseSize }) =>
        !currentBundleSizeStats.some(({ size: currentSize }) => currentSize === baseSize),
    );
  }

  const diffTable = `
  | Component | Base Size | Current Size | Diff |
  | --- | --- | --- | --- |
  ${bundleDiff
    .map(
      ({ name, size: baseSize }) =>
        `| ${name} | ${baseBundleSizeStats.length === 0 ? '-' : baseSize} | ${
          currentBundleSizeStats.find((stat) => stat.name === name).size / 1000
        } | ${
          (currentBundleSizeStats.find((stat) => stat.name === name).size - baseSize) / 1000
        } kb |`,
    )
    .join('\n')}
  `;

  return { diffTable };
};

module.exports = generateBundleDiff;
