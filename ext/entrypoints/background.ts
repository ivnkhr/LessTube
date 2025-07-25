const defaultAllowedPage = 'feed/subscriptions'; // instead of feed/channels

export default defineBackground(() => {
  const redirectScript = (url: any, tabId: any) => {

    console.log('YouTube URL Monitor Extension loaded', url, tabId);

    try{
      // Only process YouTube URLs
      if (!url.hostname.includes('youtube.com')) return;

      // Check if it's a YouTube watch URL with video ID
      const isWatchUrl = url.pathname === '/watch' && url.searchParams.has('v');
      
      // Check if it's a search results URL
      const isSearchUrl = url.pathname === '/results' && url.searchParams.has('search_query');

      // Check if it's a subscriptions page URL (main page)
      const isAllowedPage = url.pathname.includes(defaultAllowedPage);
      

      // Allow watch URLs and search URLs to pass through
      if (!isWatchUrl && !isSearchUrl && !isAllowedPage) {
        // Redirect to channels feed for any other YouTube URL
        const redirectUrl = 'https://www.youtube.com/' + defaultAllowedPage + '&redirected=in';

        console.log(`Redirecting ${url.href} to ${redirectUrl}`);

        // return;
        browser.tabs.update(tabId, {
          url: redirectUrl
        });
      }

    } catch (err) {
      console.log('Error processing URL:', err);
    }

  }

  // Listen for navigation events on YouTube
  browser.webNavigation.onBeforeNavigate.addListener(
    (details) => {
      // Only handle main frame navigation (not iframes)
      if (details.frameId !== 0) return;
      const url = new URL(details.url);
      redirectScript(url, details.tabId);
    },
    {
      url: [
        { hostEquals: 'www.youtube.com' },
        { hostEquals: 'youtube.com' },
        { hostEquals: 'm.youtube.com' }
      ]
    }
  );

  // Also handle tab updates (for when URLs change without navigation)
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.url) {
      const url = new URL(tab.url);
      redirectScript(url, tabId);
    }
  });
});
