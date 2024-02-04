const { danger, markdown } = require('danger');
const generateBundleDiff = require('./scripts/generateBundleDiff');

const showBundleSizeDiff = async () => {
  const { diffTable } = await generateBundleDiff(danger);

  markdown(`
  ## Bundle Size Report
  ${diffTable}
  `);
};

showBundleSizeDiff();
