import { danger, message } from 'danger';

const generateBundleDiff = require('./packages/blade/scripts/generateBundleDiff');

const showBundleSizeDiff = async () => {
  const { diffTable } = await generateBundleDiff(danger);

  message(`
  ## Bundle Size Diff
  ${diffTable}
  `);
};

showBundleSizeDiff();
