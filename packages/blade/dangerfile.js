const { danger, message } = require('danger');
const generateBundleDiff = require('./scripts/generateBundleDiff');

const showBundleSizeDiff = async () => {
  const { diffTable } = await generateBundleDiff(danger);

  message(`
  ## Bundle Size Diff
  ${diffTable}
  `);
};

showBundleSizeDiff();
