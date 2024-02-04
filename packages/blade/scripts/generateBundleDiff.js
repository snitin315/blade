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

  bundleDiff.forEach((component) => {
    const currentComponent = currentBundleSizeStats.find((stat) => stat.name === component.name);
    const baseComponent = baseBundleSizeStats.find((stat) => stat.name === component.name);

    if (baseComponent && !currentComponent) {
      component.diffSize = -baseComponent.size;
      component.baseSize = baseComponent.size;
      component.prSize = 0;
    } else if (!baseComponent && currentComponent) {
      component.diffSize = currentComponent.size;
      component.baseSize = 0;
      component.prSize = currentComponent.size;
    } else {
      component.diffSize = currentComponent.size - baseComponent.size;
      component.baseSize = baseComponent.size;
      component.prSize = currentComponent.size;
    }
  });

  const diffTable = `
  | Component | Base Size | Current Size | Diff |
  | --- | --- | --- | --- |
  ${bundleDiff
    .map(
      ({ name, baseSize, prSize, diffSize }) =>
        `| ${name} | ${baseSize / 1000} | ${prSize / 1000} | ${diffSize / 1000} kb |`,
    )
    .join('\n')}
  `;

  return { diffTable };
};

module.exports = generateBundleDiff;
