import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: [
      'webNavigation',
      'tabs',
      'activeTab'
    ],
    host_permissions: [
      '*://www.youtube.com/*',
      '*://youtube.com/*',
      '*://m.youtube.com/*'
    ],
    web_accessible_resources: [
      {
        resources: ['youtube-injected.js'],
        matches: ['*://*.youtube.com/*']
      }
    ]
  },
  runner: {
    startUrls: ['chrome://extensions/']
  }
});
