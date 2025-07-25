export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    // Only inject on pages that weren't redirected
    const currentUrl = new URL(window.location.href);
    const isWatchPage = currentUrl.pathname === '/watch' && currentUrl.searchParams.has('v');
    const isSearchPage = currentUrl.pathname === '/results' && currentUrl.searchParams.has('search_query');
    
    if (!isWatchPage && !isSearchPage) {
      console.log('Content script: Page will be redirected, skipping injection');
      return;
    }

    console.log('Content script: Injecting into allowed YouTube page');
    
    // Inject your custom JavaScript here
    injectCustomScript();
  },
});

function injectCustomScript() {
  // Inject the external JavaScript file
  const script = document.createElement('script');
  script.src = browser.runtime.getURL('./youtube-injected.js');
  script.onload = () => {
    console.log('LessTube: Custom script injected successfully');
    script.remove(); // Clean up after injection
  };
  
  // Inject into page context
  (document.head || document.documentElement).appendChild(script);
}
