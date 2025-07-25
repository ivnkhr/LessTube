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
  // Create and inject script with inline code
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      'use strict';
      
      console.log('LessTube: YouTube modifications loaded');
      
      // Add custom CSS class for targeting
      document.body.classList.add('lesstube-enhanced');
      
      // Hide distracting elements
      function hideDistractingElements() {
        const style = document.createElement('style');
        style.textContent = \`
          /* Hide recommended videos sidebar on watch page */
          #secondary.ytd-watch-flexy {
            display: none !important;
          }
          
          /* Hide end screen suggestions */
          .ytp-ce-element {
            display: none !important;
          }
          
          /* Hide comments section (optional) */
          #comments {
            display: none !important;
          }
          
          /* Make video player wider when sidebar is hidden */
          #primary.ytd-watch-flexy {
            max-width: none !important;
          }
        \`;
        document.head.appendChild(style);
      }
      
      // Clean up search results
      function cleanSearchResults() {
        if (window.location.pathname === '/results') {
          // Hide ads in search results
          const style = document.createElement('style');
          style.textContent = \`
            /* Hide search ads */
            .ytd-search-pyv-renderer,
            .ytd-promoted-sparkles-web-renderer {
              display: none !important;
            }
          \`;
          document.head.appendChild(style);
        }
      }
      
      // Initialize modifications
      function init() {
        hideDistractingElements();
        cleanSearchResults();
        
        // Monitor for page changes (YouTube is SPA)
        let currentUrl = window.location.href;
        const observer = new MutationObserver(() => {
          if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('LessTube: Page changed, reapplying modifications');
            
            // Reapply modifications after navigation
            setTimeout(() => {
              hideDistractingElements();
              cleanSearchResults();
            }, 1000);
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      
      // Wait for page to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
      
    })();
  `;
  
  // Inject into page context
  (document.head || document.documentElement).appendChild(script);
  
  console.log('LessTube: Custom script injected successfully');
}
