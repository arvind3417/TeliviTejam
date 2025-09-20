// LearnFirst Background Service Worker
// Handles goal tracking, throttling logic, and tab management

// Content-based throttling function (simulates slow internet within page content)
function contentThrottlingFunction(throttleDelayMs) {
  console.log('🐌 Content throttling initialized for:', window.location.href);
  
  // Skip throttling for learning sites
  const currentUrl = window.location.href;
  const learningDomains = [
    'wikipedia.org', 'coursera.org', 'edx.org', 'khanacademy.org',
    'stackoverflow.com', 'github.com', 'arxiv.org', 'scholar.google.com',
    'medium.com', 'dev.to', 'freecodecamp.org', 'codecademy.com'
  ];
  
  const isLearningUrl = learningDomains.some(domain => currentUrl.includes(domain));
  
  if (isLearningUrl) {
    console.log('⚡ Learning site detected - no throttling applied');
    return;
  }
  
  const baseDelay = Math.max(throttleDelayMs / 10, 100); // Minimum 100ms, max based on setting
  console.log(`🐌 Applying content throttling with base delay: ${baseDelay}ms`);
  
  // Throttle image loading
  const throttleImages = () => {
    const images = document.querySelectorAll('img:not([data-throttled])');
    images.forEach((img, index) => {
      img.setAttribute('data-throttled', 'true');
      const originalSrc = img.src;
      
      // Show loading placeholder
      img.style.background = 'linear-gradient(45deg, #f0f0f0, #e0e0e0)';
      img.style.backgroundSize = '20px 20px';
      img.style.animation = 'throttle-loading 1s infinite';
      
      // Delay actual image loading
      setTimeout(() => {
        if (img.src === originalSrc) {  // Only if not changed
          const newImg = new Image();
          newImg.onload = () => {
            img.style.background = '';
            img.style.animation = '';
            img.src = newImg.src;
            console.log(`🖼️ Image loaded after ${baseDelay * 0.8}ms delay`);
          };
          newImg.src = originalSrc;
        }
      }, baseDelay * 0.8);
    });
  };
  
  // Throttle script execution
  const throttleScripts = () => {
    const scripts = document.querySelectorAll('script[src]:not([data-throttled])');
    scripts.forEach((script, index) => {
      script.setAttribute('data-throttled', 'true');
      
      // Add loading indicator near scripts
      const loadingDiv = document.createElement('div');
      loadingDiv.innerHTML = '🔄 Loading scripts...';
      loadingDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: rgba(0,0,0,0.8); color: white; 
        padding: 10px; border-radius: 5px; 
        font-size: 12px; z-index: 1000000;
        animation: throttle-fade 2s infinite;
      `;
      document.body?.appendChild(loadingDiv);
      
      setTimeout(() => {
        loadingDiv.remove();
        console.log(`📜 Script throttling delay applied: ${baseDelay * 1.3}ms`);
      }, baseDelay * 1.3);
    });
  };
  
  // Add CSS animations for loading effects
  const addThrottlingStyles = () => {
    if (document.querySelector('#throttling-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'throttling-styles';
    style.textContent = `
      @keyframes throttle-loading {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      
      @keyframes throttle-fade {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
      }
      
      .throttle-slow-element {
        transition: all 2s ease-in-out !important;
      }
    `;
    document.head.appendChild(style);
  };
  
  // Apply throttling effects
  const applyThrottling = () => {
    addThrottlingStyles();
    throttleImages();
    throttleScripts();
    
    // Show general "slow connection" indicator
    const indicator = document.createElement('div');
    indicator.innerHTML = '🐌 Slow connection mode - Complete learning goals for faster browsing!';
    indicator.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; 
      background: linear-gradient(45deg, #ff6b6b, #ffa500); 
      color: white; padding: 8px; text-align: center; 
      font-weight: bold; z-index: 2147483646;
      font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    
    document.body?.appendChild(indicator);
    
    // Remove indicator after a few seconds
    setTimeout(() => {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 1000);
    }, 4000);
  };
  
  // Apply throttling when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyThrottling);
  } else {
    applyThrottling();
  }
  
  // Also throttle dynamically loaded content
  const observer = new MutationObserver(() => {
    throttleImages();
  });
  
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Standalone function for script injection (no class context)
function injectDelayOverlayFunction(delayMs, actionType = 'loading') {
  console.log('🎯 INJECTED FUNCTION STARTED - LearnFirst: Injecting delay overlay with', delayMs, 'ms delay for', actionType);
  console.log('🎯 Current page:', window.location.href);
  console.log('🎯 Document ready state:', document.readyState);
  
  // Prevent multiple injections
  if (window.learnFirstDelayInjected) {
    console.log('LearnFirst: Delay overlay already injected, skipping');
    return;
  }
  window.learnFirstDelayInjected = true;

  // Wait for document.body to be available
  const injectWhenReady = () => {
    if (!document.body) {
      console.log('LearnFirst: Document body not ready, waiting...');
      setTimeout(injectWhenReady, 50);
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'learnfirst-delay-overlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        backdrop-filter: blur(10px);
        animation: learnfirst-fadein 0.3s ease-out;
      ">
        <div style="text-align: center; padding: 2rem; max-width: 400px;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
          <h2 style="margin: 0 0 1rem 0; font-size: 1.8rem; font-weight: 600;">Complete Your Learning Goals First!</h2>
          <p style="margin: 0 0 0.5rem 0; font-size: 1.2rem; font-weight: 500;">This page will load in <span id="learnfirst-countdown">${Math.ceil(delayMs/1000)}</span> seconds</p>
          <p style="margin: 0 0 1.5rem 0; font-size: 0.9rem; opacity: 0.7; font-style: italic;">
            ${actionType === 'new-tab' ? '📄 New tab opened' : 
              actionType === 'reload/refresh' ? '🔄 Page refreshed' :
              actionType === 'navigation' ? '🧭 Navigated to new page' :
              actionType === 'url-change' ? '🔗 URL changed' : '⏳ Loading...'}
          </p>
          <p style="margin: 0; opacity: 0.8; font-size: 0.95rem;">Progress today: <span id="learnfirst-progress">Loading...</span></p>
          <div style="margin-top: 1.5rem; font-size: 0.85rem; opacity: 0.6;">
            Visit educational sites like Wikipedia, Stack Overflow, or read articles to complete your goals faster!
          </div>
        </div>
      </div>
      <style>
        @keyframes learnfirst-fadein {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
    console.log('LearnFirst: Delay overlay injected successfully');
    
    // Countdown timer
    let countdown = Math.ceil(delayMs / 1000);
    console.log(`📊 delayMs: ${delayMs}`);
    console.log(`📊 countdown: ${countdown}`);
    const countdownElement = overlay.querySelector('#learnfirst-countdown');
    
    const interval = setInterval(() => {
      countdown--;
      if (countdownElement) {
        countdownElement.textContent = countdown;
      }
      if (countdown <= 0) {
        clearInterval(interval);
        if (overlay.parentNode) {
          overlay.style.opacity = '0';
          setTimeout(() => overlay.remove(), 300);
        }
      }
    }, 1000);

    // Get current progress and update display
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: 'getProgress' }, (response) => {
        if (response) {
          const progressElement = overlay.querySelector('#learnfirst-progress');
          if (progressElement) {
            progressElement.textContent = `${response.current}/${response.total}`;
          }
        }
      });
    }

    // Remove overlay after delay
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }
      window.learnFirstDelayInjected = false; // Allow future injections
    }, delayMs);
  };

  injectWhenReady();
}

class LearnFirstController {
  constructor() {
    console.log('🎯 LearnFirst: Background controller initializing...');
    this.isThrottling = false;
    this.dailyGoal = 3; // Default: 3 learning items per day
    this.currentProgress = 0;
    this.throttleDelay = 5000; // 5 seconds delay
    this.isInitialized = false;
    this.startTime = Date.now();
    
    console.log('🎯 LearnFirst: Initial state -', {
      throttling: this.isThrottling,
      goal: this.dailyGoal,
      progress: this.currentProgress,
      delay: this.throttleDelay
    });
    
    this.setupListeners();
    this.initializeDaily();
  }

  setupListeners() {
    console.log('🎯 LearnFirst: Setting up event listeners...');
    
    // Set up network request throttling - reduces network speed based on page type
    this.setupNetworkThrottling();
    
    // Comprehensive tab update listener - handles all tab loading scenarios
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      console.log(`📊 Tab Update Event: TabID=${tabId}, Status=${changeInfo.status}, URL=${tab.url || 'pending'}, Changes:`, changeInfo);
      console.log(`📊 shouldInjectDelay: ${this.shouldInjectDelay(tab)}`);
      
      // Handle tab loading (covers page loads, reloads, and navigation)
      if (changeInfo.status === 'loading' && tab.url && this.shouldInjectDelay(tab)) {
        const actionType = changeInfo.url ? 'navigation' : 'reload/refresh';
        console.log(`✅ LearnFirst: DELAY TRIGGERED - ${tab.url} (type: ${actionType})`);
        this.handleTabDelay(tab, actionType);
        
        // Also inject content throttling for comprehensive slow browsing experience
        setTimeout(() => {
          this.injectThrottlingContentScript(tab.id);
        }, 6000); // Inject after overlay delay (5s + 1s buffer)
      }
      
      // Handle URL changes (address bar navigation, link clicks)  
      else if (changeInfo.url && this.shouldInjectDelay(tab)) {
        console.log(`🔄 LearnFirst: URL Change DELAY TRIGGERED: ${changeInfo.url}`);
        // Small delay to allow navigation to start, then inject overlay
        setTimeout(() => {
          if (this.shouldInjectDelay(tab)) {
            this.handleTabDelay(tab, 'url-change');
          } else {
            console.log('🚫 LearnFirst: Delay no longer needed (goals completed during timeout)');
          }
        }, 100);
      }
      
      // Check for learning content when tab finishes loading
      if (changeInfo.status === 'complete' && tab.url) {
        console.log(`🔍 LearnFirst: Checking for learning content: ${tab.url}`);
        this.checkIfLearningContent(tab.url);
      }
      
      // Log when no action is taken
      if (changeInfo.status === 'loading' && tab.url && !this.shouldInjectDelay(tab)) {
        console.log(`⏭️ LearnFirst: No delay needed for ${tab.url} - throttling: ${this.isThrottling}, initialized: ${this.isInitialized}, progress: ${this.currentProgress}/${this.dailyGoal}`);
      }
    });

    // Handle new empty tabs (like Ctrl+T)
    chrome.tabs.onCreated.addListener((tab) => {
      console.log(`🆕 LearnFirst: New tab created (ID: ${tab.id}, URL: ${tab.url || 'empty'})`);
      
      // For tabs with immediate URLs (bookmarks, "Open in new tab", etc.)
      if (tab.url && tab.url !== 'chrome://newtab/' && this.shouldInjectDelay(tab)) {
        console.log(`✅ LearnFirst: NEW TAB DELAY TRIGGERED: ${tab.url}`);
        setTimeout(() => {
          if (this.shouldInjectDelay(tab)) {
            this.handleTabDelay(tab, 'new-tab');
            // Also inject content throttling after overlay
            setTimeout(() => {
              this.injectThrottlingContentScript(tab.id);
            }, 6000);
          } else {
            console.log('🚫 LearnFirst: New tab delay cancelled (goals completed)');
          }
        }, 200);
      } else if (tab.url && tab.url !== 'chrome://newtab/') {
        console.log(`⏭️ LearnFirst: New tab created but no delay needed: ${tab.url}`);
      } else {
        console.log(`📄 LearnFirst: Empty new tab created (will wait for URL)`);
      }
    });

    // Handle messages from popup and content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log(`💬 LearnFirst: Message received:`, {
        action: request.action,
        from: sender.tab ? `tab-${sender.tab.id}` : 'popup',
        url: sender.tab ? sender.tab.url : 'extension-popup',
        timestamp: new Date().toISOString()
      });
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
    
    console.log('✅ LearnFirst: All event listeners set up successfully');

    // Daily reset at midnight (with error handling)
    try {
      if (chrome.alarms) {
        chrome.alarms.create('dailyReset', { 
          when: this.getNextMidnight(),
          periodInMinutes: 24 * 60 
        });
        
        chrome.alarms.onAlarm.addListener((alarm) => {
          if (alarm.name === 'dailyReset') {
            this.resetDailyProgress();
          }
        });
      } else {
        console.warn('LearnFirst: chrome.alarms API not available, using fallback timer');
        this.setupFallbackTimer();
      }
    } catch (error) {
      console.error('LearnFirst: Error setting up alarms:', error);
      this.setupFallbackTimer();
    }
  }

  shouldInjectDelay(tab) {
    // Don't inject if not initialized yet
    if (!this.isInitialized) {
      console.log('LearnFirst: Not initialized yet, skipping delay injection');
      return false;
    }
    
    // Don't inject if not throttling
    if (!this.isThrottling) {
      return false;
    }
    
    // Don't inject if no tab ID
    if (!tab.id) {
      return false;
    }
    
    // Skip special pages that can't be scripted
    if (tab.url && (
      tab.url.startsWith('chrome://') ||
      tab.url.startsWith('chrome-extension://') ||
      tab.url.startsWith('moz-extension://') ||
      tab.url.startsWith('edge://') ||
      tab.url.startsWith('about:') ||
      tab.url.startsWith('file://') ||
      tab.url.startsWith('data:') ||
      tab.url === 'chrome://newtab/' ||
      tab.url === ''
    )) {
      return false;
    }
    
    // Skip if goals are already completed
    if (this.currentProgress >= this.dailyGoal) {
      return false;
    }
    
    console.log(`LearnFirst: Should inject delay for ${tab.url} - throttling: ${this.isThrottling}, progress: ${this.currentProgress}/${this.dailyGoal}`);
    return true;
  }

  async handleTabDelay(tab, actionType = 'unknown') {
    console.log(`🚀 LearnFirst: handleTabDelay CALLED for tab ${tab.id}: ${tab.url} (${actionType})`);
    console.log(`🚀 Tab object:`, { id: tab.id, url: tab.url, status: tab.status });
    
    try {
      // Wait a bit for DOM to be ready, but not too long
      await new Promise(resolve => setTimeout(resolve, 300));
      // Chrome scripting API is available and ready
      console.log(`🧪 About to inject script - throttleDelay: ${this.throttleDelay}, actionType: ${actionType}`);
      
      // Check if scripting API is available
      if (chrome.scripting && chrome.scripting.executeScript) {
        console.log(`🧪 executeScript API available, attempting injection...`);
        
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: injectDelayOverlayFunction,  // Use standalone function
            args: [this.throttleDelay, actionType]
          });
          console.log(`✅ Script injection SUCCESS for tab ${tab.id}:`, results);
        } catch (scriptError) {
          console.error(`❌ Script injection FAILED for tab ${tab.id}:`, scriptError);
          console.log(`❌ Error details:`, { 
            name: scriptError.name, 
            message: scriptError.message, 
            stack: scriptError.stack?.split('\n')[0] 
          });
        }
      } else {
        console.warn('❌ chrome.scripting API not available');
      }
    } catch (error) {
      // This is expected for some tabs (chrome://, etc.)
      console.log(`LearnFirst: Could not inject delay overlay for tab ${tab.id}:`, error.message);
    }
  }

  setupNetworkThrottling() {
    console.log('🌐 LearnFirst: Setting up Manifest V3 compatible throttling...');
    
    // In Manifest V3, we can't use webRequestBlocking
    // Instead, we'll use comprehensive content delay strategies
    console.log('✅ Using content-based throttling approach (Manifest V3 compatible)');
    
    // Set up enhanced content script injection for all tabs
    this.setupContentBasedThrottling();
  }

  async setupContentBasedThrottling() {
    console.log('🎯 Setting up content-based throttling injection...');
    
    // Inject throttling script into all existing tabs when extension loads
    try {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (this.canInjectIntoTab(tab)) {
          await this.injectThrottlingContentScript(tab.id);
        }
      }
      console.log(`✅ Injected throttling scripts into ${tabs.length} existing tabs`);
    } catch (error) {
      console.log('⚠️ Could not inject into existing tabs:', error.message);
    }
  }

  async injectThrottlingContentScript(tabId) {
    if (!this.isThrottling) return;
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: contentThrottlingFunction,
        args: [this.throttleDelay]
      });
      console.log(`✅ Injected content throttling into tab ${tabId}`);
    } catch (error) {
      console.log(`⚠️ Could not inject throttling into tab ${tabId}:`, error.message);
    }
  }

  canInjectIntoTab(tab) {
    return tab.url && 
           !tab.url.startsWith('chrome://') &&
           !tab.url.startsWith('chrome-extension://') &&
           !tab.url.startsWith('moz-extension://') &&
           !tab.url.startsWith('edge://') &&
           !tab.url.startsWith('about:') &&
           tab.url !== 'chrome://newtab/';
  }

  isLearningUrl(url) {
    const learningDomains = [
      'wikipedia.org',
      'coursera.org',
      'edx.org',
      'khanacademy.org',
      'stackoverflow.com',
      'github.com',
      'arxiv.org',
      'scholar.google.com',
      'medium.com',
      'dev.to',
      'freecodecamp.org',
      'codecademy.com'
    ];
    
    return learningDomains.some(domain => url.includes(domain));
  }

  checkIfLearningContent(url) {
    const learningDomains = [
      'wikipedia.org',
      'coursera.org',
      'edx.org',
      'khanacademy.org',
      'stackoverflow.com',
      'medium.com',
      'dev.to',
      'arxiv.org',
      'scholar.google',
      'researchgate.net',
      'nature.com',
      'sciencedirect.com',
      'news.ycombinator.com',
      'reddit.com/r/todayilearned',
      'reddit.com/r/science',
      'reddit.com/r/programming',
      'github.com'
    ];

    const matchedDomain = learningDomains.find(domain => 
      url.toLowerCase().includes(domain)
    );

    if (matchedDomain) {
      console.log(`🎓 LearnFirst: LEARNING CONTENT DETECTED! URL: ${url}, Matched domain: ${matchedDomain}`);
      this.incrementProgress();
    } else {
      console.log(`📄 LearnFirst: Regular content (not learning): ${url}`);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    const startTime = Date.now();
    console.log(`🔄 LearnFirst: Processing message: ${request.action}`);
    
    try {
      switch (request.action) {
        case 'getStatus':
          const status = await this.getStatus();
          console.log(`📊 LearnFirst: Status requested - returning:`, status);
          sendResponse(status);
          break;
          
        case 'getProgress':
          const progress = {
            current: this.currentProgress,
            total: this.dailyGoal
          };
          console.log(`📈 LearnFirst: Progress requested - returning:`, progress);
          sendResponse(progress);
          break;
          
        case 'setGoal':
          console.log(`🎯 LearnFirst: Setting goal from ${this.dailyGoal} to ${request.goal}`);
          await this.setDailyGoal(request.goal);
          console.log(`✅ LearnFirst: Goal updated successfully to ${this.dailyGoal}`);
          sendResponse({ success: true });
          break;
          
        case 'setDelay':
          console.log(`⏱️ LearnFirst: Setting delay from ${this.throttleDelay}ms to ${request.delay}ms`);
          await this.setTabDelay(request.delay);
          console.log(`✅ LearnFirst: Delay updated successfully to ${this.throttleDelay}ms`);
          sendResponse({ success: true });
          break;
          
        case 'markLearningComplete':
          console.log(`📚 LearnFirst: Manual learning completion marked (type: ${request.type || 'unknown'})`);
          this.incrementProgress();
          sendResponse({ success: true });
          break;
          
        case 'resetProgress':
          console.log(`🔄 LearnFirst: Progress reset requested`);
          await this.resetDailyProgress();
          console.log(`✅ LearnFirst: Progress reset completed`);
          sendResponse({ success: true });
          break;
          
        default:
          console.warn(`⚠️ LearnFirst: Unknown message action: ${request.action}`);
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error(`❌ LearnFirst: Error processing message ${request.action}:`, error);
      sendResponse({ success: false, error: error.message });
    }
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ LearnFirst: Message ${request.action} processed in ${duration}ms`);
  }

  async getStatus() {
    // Don't reload data every time - use current in-memory values
    // Data is loaded during initialization and updated when settings change
    return {
      isThrottling: this.isThrottling,
      currentProgress: this.currentProgress,
      dailyGoal: this.dailyGoal,
      goalCompleted: this.currentProgress >= this.dailyGoal,
      timeRemaining: this.throttleDelay
    };
  }

  async incrementProgress() {
    const oldProgress = this.currentProgress;
    this.currentProgress++;
    
    console.log(`📈 LearnFirst: Progress incremented: ${oldProgress} → ${this.currentProgress}/${this.dailyGoal}`);
    
    await this.saveData();
    
    // Check if goal is completed
    if (this.currentProgress >= this.dailyGoal && this.isThrottling) {
      console.log(`🎉 LearnFirst: GOALS COMPLETED! Disabling throttling. Final progress: ${this.currentProgress}/${this.dailyGoal}`);
      this.disableThrottling();
      this.showGoalCompletedNotification();
    } else if (this.currentProgress >= this.dailyGoal) {
      console.log(`✅ LearnFirst: Goals already completed, throttling already disabled`);
    } else {
      console.log(`🎯 LearnFirst: Still need ${this.dailyGoal - this.currentProgress} more to complete goals`);
    }
  }

  async setDailyGoal(newGoal) {
    this.dailyGoal = newGoal;
    await this.saveData();
    
    // Re-evaluate throttling status
    this.updateThrottlingStatus();
  }

  async setTabDelay(newDelay) {
    this.throttleDelay = newDelay;
    // Save the delay setting to storage
    await chrome.storage.local.set({ tabDelay: newDelay });
    console.log(`LearnFirst: Tab delay updated to ${newDelay}ms`);
  }

  updateThrottlingStatus() {
    const shouldThrottle = this.currentProgress < this.dailyGoal;
    
    // 🧪 DEBUG: Force throttling for testing
    const shouldThrottleFinal = true;  // REMOVE THIS LINE AFTER TESTING
    console.log(`🚦 Throttling: normal=${shouldThrottle}, forced=${shouldThrottleFinal}, current=${this.isThrottling}`);
    
    if (shouldThrottleFinal !== this.isThrottling) {
      if (shouldThrottleFinal) {
        this.enableThrottling();
      } else {
        this.disableThrottling();
      }
    }
  }

  enableThrottling() {
    console.log(`🚦 LearnFirst: ENABLING THROTTLING - Progress: ${this.currentProgress}/${this.dailyGoal}`);
    this.isThrottling = true;
    this.saveData();
    console.log('✅ LearnFirst: Throttling enabled - tab delays will now appear');
  }

  disableThrottling() {
    console.log(`🚦 LearnFirst: DISABLING THROTTLING - Goals completed! Progress: ${this.currentProgress}/${this.dailyGoal}`);
    this.isThrottling = false;
    this.saveData();
    console.log('✅ LearnFirst: Throttling disabled - no more tab delays!');
  }

  async resetDailyProgress() {
    this.currentProgress = 0;
    this.updateThrottlingStatus();
    await this.saveData();
  }

  async initializeDaily() {
    console.log('🚀 LearnFirst: Initializing extension...');
    const startTime = Date.now();
    
    await this.loadData();
    this.updateThrottlingStatus();
    this.isInitialized = true;
    
    const initTime = Date.now() - startTime;
    console.log(`✅ LearnFirst: Initialization complete in ${initTime}ms`);
    console.log(`📊 LearnFirst: Current state:`, {
      throttling: this.isThrottling,
      progress: `${this.currentProgress}/${this.dailyGoal}`,
      delay: `${this.throttleDelay}ms`,
      goalCompleted: this.currentProgress >= this.dailyGoal,
      uptime: `${Date.now() - this.startTime}ms`
    });
    console.log(`🎯 LearnFirst: Extension ready to ${this.isThrottling ? 'throttle tabs until goals are met' : 'run without throttling (goals completed)'}!`);
  }

  async loadData() {
    try {
      const result = await chrome.storage.local.get([
        'currentProgress', 
        'dailyGoal', 
        'lastResetDate',
        'tabDelay'
      ]);
      
      // Check if we need to reset for a new day
      const today = new Date().toDateString();
      if (result.lastResetDate !== today) {
        this.currentProgress = 0;
        this.saveData();
      } else {
        this.currentProgress = result.currentProgress || 0;
      }
      
      this.dailyGoal = result.dailyGoal || 3;
      this.throttleDelay = result.tabDelay || 5000; // Use stored delay or default to 5 seconds
      
      console.log(`LearnFirst: Loaded settings - Goal: ${this.dailyGoal}, Delay: ${this.throttleDelay}ms`);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async saveData() {
    const dataToSave = {
      currentProgress: this.currentProgress,
      dailyGoal: this.dailyGoal,
      isThrottling: this.isThrottling,
      lastResetDate: new Date().toDateString()
    };
    
    console.log('💾 LearnFirst: Saving data to storage:', dataToSave);
    const startTime = Date.now();
    
    try {
      await chrome.storage.local.set(dataToSave);
      const saveTime = Date.now() - startTime;
      console.log(`✅ LearnFirst: Data saved successfully in ${saveTime}ms`);
    } catch (error) {
      console.error('❌ LearnFirst: Error saving data:', error);
    }
  }

  setupFallbackTimer() {
    // Fallback timer for browsers without alarms API
    const checkMidnight = () => {
      const now = new Date();
      const lastCheck = new Date(now.getTime() - 60000); // 1 minute ago
      
      if (lastCheck.getDate() !== now.getDate()) {
        this.resetDailyProgress();
      }
      
      // Check again in 1 minute
      setTimeout(checkMidnight, 60000);
    };
    
    // Start checking in 1 minute
    setTimeout(checkMidnight, 60000);
  }

  showGoalCompletedNotification() {
    try {
      if (chrome.notifications && chrome.notifications.create) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon-48.png',
          title: 'LearnFirst: Goals Completed! 🎉',
          message: 'Great job! Your internet is now running at full speed.'
        });
      } else {
        console.log('LearnFirst: Goals completed! 🎉 Your internet is now at full speed.');
      }
    } catch (error) {
      console.error('LearnFirst: Error showing notification:', error);
    }
  }

  getNextMidnight() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }
}

// Initialize the controller when the service worker starts
const learnFirst = new LearnFirstController();
