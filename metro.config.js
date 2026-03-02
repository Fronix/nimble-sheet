const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Force zustand to use CJS build to avoid import.meta in ESM build
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName.startsWith('zustand')) {
    const suffix = moduleName.replace('zustand', '') || '/index';
    return {
      type: 'sourceFile',
      filePath: path.resolve(
        __dirname,
        'node_modules/zustand',
        `.${suffix}.js`,
      ),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
