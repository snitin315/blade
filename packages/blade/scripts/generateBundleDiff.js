const generateBundleDiff = async (danger) => {
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
  let bundleDiff = [];

  if (baseBundleSizeStats.length > 0) {
    bundleDiff = baseBundleSizeStats.filter(
      ({ size: baseSize }) =>
        !currentBundleSizeStats.some(({ size: currentSize }) => currentSize === baseSize),
    );
  }

  if (bundleDiff.length > 0) {
    const diffTable = `
  | Component | Base Size | Current Size | Diff |
  | --- | --- | --- | --- |
  ${bundleDiff
    .map(
      ({ name, size: baseSize }) =>
        `| ${name} | ${baseSize} | ${
          currentBundleSizeStats.find((stat) => stat.name === name).size
        } | ${currentBundleSizeStats.find((stat) => stat.name === name).size - baseSize} |`,
    )
    .join('\n')}
  `;
    return { bundleDiff, diffTable };
  }

  return { bundleDiff: currentBundleSizeStats, diffTable: 'No bundle size changes detected' };
};

module.exports = generateBundleDiff;
