// Custom YouTube modifications for LessTube extension
// This script runs in the page context (not extension context)

(function() {
  'use strict';
  
  console.log('LessTube: YouTube modifications loaded');
  
  // Add custom CSS class for targeting
  document.body.classList.add('lesstube-enhanced');
  
  // Example: Hide distracting elements
  function hideDistractingElements() {
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
  }
  
  // Example: Clean up search results
  function cleanSearchResults() {
    if (window.location.pathname === '/results') {
      // Hide ads in search results
      const style = document.createElement('style');
      style.textContent = `
        /* Hide search ads */
        .ytd-search-pyv-renderer,
        .ytd-promoted-sparkles-web-renderer {
          display: none !important;
        }
      `;
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