import configs from './rollup.config.js';
const appBundleConfig = configs[0];
appBundleConfig.output.file = 'dist/index.js';
appBundleConfig.output.format = 'es';
export default [
  appBundleConfig
];