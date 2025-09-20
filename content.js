// LearnFirst Content Script
// Runs on all web pages to detect learning activities and provide user feedback

class LearnFirstContent {
  constructor() {
    console.log('📄 LearnFirst: Content script initializing on', window.location.href);
    
    this.learningIndicators = [
      'article', 'tutorial', 'learn', 'education', 'course', 'lesson',
      'guide', 'documentation', 'research', 'study', 'academic',
      'paper', 'journal', 'wiki', 'knowledge', 'information'
    ];
    
    this.readingThreshold = 30; // seconds of reading to count as learning
    this.readingStartTime = null;
    this.hasBeenCounted = false;
    this.startTime = Date.now();
    
    console.log('📊 LearnFirst: Content script config:', {
      url: window.location.href,
      title: document.title,
      readingThreshold: this.readingThreshold,
      timestamp: new Date().toISOString()
    });
    
    this.init();
  }

  init() {
    console.log('🔧 LearnFirst: Initializing content script features...');
    
    this.addReadingDetection();
    this.checkForLearningContent();
    this.addFloatingProgress();
    this.setupMessageListener();
    
    console.log('✅ LearnFirst: Content script initialization complete');
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getPageInfo') {
        sendResponse({
          title: document.title,
          url: window.location.href,
          isLearningContent: this.isLearningPage()
        });
      }
    });
  }

  addReadingDetection() {
    // Track when user starts/stops reading
    let isReading = false;
    let readingTimer = null;

    const startReading = () => {
      if (!isReading && this.isLearningPage() && !this.hasBeenCounted) {
        isReading = true;
        this.readingStartTime = Date.now();
        
        console.log('📖 LearnFirst: Reading session started', {
          url: window.location.href,
          threshold: `${this.readingThreshold}s`,
          timestamp: new Date().toISOString()
        });
        
        // Clear any existing timer
        if (readingTimer) clearTimeout(readingTimer);
        
        // Set timer for reading threshold
        readingTimer = setTimeout(() => {
          if (isReading) {
            const timeSpent = Math.round((Date.now() - this.readingStartTime) / 1000);
            console.log(`⏰ LearnFirst: Reading threshold reached! Time spent: ${timeSpent}s`);
            this.markAsLearningActivity();
          }
        }, this.readingThreshold * 1000);
      } else if (isReading) {
        console.log('📖 LearnFirst: Reading session already active');
      } else if (!this.isLearningPage()) {
        console.log('📄 LearnFirst: Not starting reading timer - not a learning page');
      } else if (this.hasBeenCounted) {
        console.log('✅ LearnFirst: Not starting reading timer - already counted');
      }
    };

    const stopReading = () => {
      isReading = false;
      if (readingTimer) {
        clearTimeout(readingTimer);
        readingTimer = null;
      }
    };

    // Event listeners for reading detection
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopReading();
      } else {
        startReading();
      }
    });

    // Mouse movement indicates reading
    let mouseMoveTimer = null;
    document.addEventListener('mousemove', () => {
      startReading();
      
      // Stop reading if no mouse movement for 30 seconds
      if (mouseMoveTimer) clearTimeout(mouseMoveTimer);
      mouseMoveTimer = setTimeout(stopReading, 30000);
    });

    // Scrolling indicates reading
    let scrollTimer = null;
    document.addEventListener('scroll', () => {
      startReading();
      
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(stopReading, 10000);
    });

    // Start reading when page loads
    if (document.readyState === 'complete') {
      startReading();
    } else {
      document.addEventListener('DOMContentLoaded', startReading);
    }
  }

  isLearningPage() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const content = document.body ? document.body.textContent.toLowerCase().substring(0, 1000) : '';

    // Check URL for learning indicators
    const hasLearningDomain = [
      'wikipedia.org', 'coursera.org', 'edx.org', 'khanacademy.org',
      'stackoverflow.com', 'medium.com', 'dev.to', 'arxiv.org',
      'scholar.google', 'researchgate.net', 'nature.com', 'sciencedirect.com'
    ].some(domain => url.includes(domain));

    // Check title and content for learning keywords
    const hasLearningKeywords = this.learningIndicators.some(keyword => 
      title.includes(keyword) || content.includes(keyword)
    );

    // Check for article-like structure
    const hasArticleStructure = document.querySelector('article') || 
                               document.querySelector('main') ||
                               document.querySelector('.content') ||
                               document.querySelector('.post');

    // Check word count (learning content typically has substantial text)
    const wordCount = content.split(' ').length;
    const hasSubstantialContent = wordCount > 200;

    return hasLearningDomain || 
           (hasLearningKeywords && hasArticleStructure && hasSubstantialContent);
  }

  checkForLearningContent() {
    console.log('🔍 LearnFirst: Analyzing page for learning content...');
    
    if (this.isLearningPage()) {
      console.log('🎓 LearnFirst: LEARNING CONTENT DETECTED!', {
        url: window.location.href,
        title: document.title,
        detectionMethod: 'content-analysis'
      });
      this.showLearningIndicator();
    } else {
      console.log('📄 LearnFirst: Regular page (not learning content):', {
        url: window.location.href,
        title: document.title,
        reason: 'Does not match learning indicators'
      });
    }
  }

  markAsLearningActivity() {
    if (this.hasBeenCounted) {
      console.log('⏭️ LearnFirst: Learning activity already marked for this page');
      return;
    }
    
    this.hasBeenCounted = true;
    const timeSpent = Date.now() - this.readingStartTime;
    
    console.log('🎉 LearnFirst: MARKING LEARNING ACTIVITY COMPLETE!', {
      url: window.location.href,
      title: document.title,
      timeSpent: `${Math.round(timeSpent / 1000)}s`,
      detectionMethod: 'reading-time-threshold'
    });
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'markLearningComplete',
      url: window.location.href,
      title: document.title,
      timeSpent: timeSpent
    });

    this.showCompletionBadge();
  }

  showLearningIndicator() {
    console.log('🎓 LearnFirst: Showing learning content indicator');
    
    const indicator = document.createElement('div');
    indicator.id = 'learnfirst-indicator';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        🎯 Learning Content Detected
      </div>
    `;

    document.body.appendChild(indicator);
    console.log('✅ LearnFirst: Learning indicator added to page');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.opacity = '0';
        setTimeout(() => {
          indicator.remove();
          console.log('🎓 LearnFirst: Learning indicator removed from page');
        }, 300);
      }
    }, 5000);
  }

  showCompletionBadge() {
    console.log('🎉 LearnFirst: Showing completion badge to user');
    
    const badge = document.createElement('div');
    badge.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        font-weight: 600;
        z-index: 10001;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        text-align: center;
        animation: learnFirstPulse 0.6s ease-out;
      ">
        <div style="font-size: 24px; margin-bottom: 8px;">🎉</div>
        <div>Learning Activity Completed!</div>
        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
          Great job reading this content!
        </div>
      </div>
      <style>
        @keyframes learnFirstPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      </style>
    `;

    document.body.appendChild(badge);
    console.log('✅ LearnFirst: Completion badge added to page');

    // Auto-hide after 3 seconds
    setTimeout(() => {
      badge.style.opacity = '0';
      badge.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => {
        badge.remove();
        console.log('🎉 LearnFirst: Completion badge removed from page');
      }, 300);
    }, 3000);
  }

  async addFloatingProgress() {
    console.log('📊 LearnFirst: Checking if progress float should be shown...');
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
      
      if (response && response.isThrottling) {
        console.log('📊 LearnFirst: Throttling active, showing progress float:', {
          progress: `${response.currentProgress}/${response.dailyGoal}`,
          throttling: response.isThrottling
        });
        this.createProgressFloat(response);
      } else {
        console.log('📊 LearnFirst: No progress float needed - goals completed or throttling disabled');
      }
    } catch (error) {
      console.error('❌ LearnFirst: Could not get status for progress float:', error);
    }
  }

  createProgressFloat(status) {
    console.log('📊 LearnFirst: Creating progress float widget');
    
    const progressFloat = document.createElement('div');
    progressFloat.id = 'learnfirst-progress';
    progressFloat.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 16px;
        border-radius: 25px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='rgba(0,0,0,0.9)'" 
         onmouseout="this.style.background='rgba(0,0,0,0.8)'">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>📚</span>
          <span>Progress: ${status.currentProgress}/${status.dailyGoal}</span>
          <div style="
            width: 60px;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            overflow: hidden;
          ">
            <div style="
              width: ${(status.currentProgress / status.dailyGoal) * 100}%;
              height: 100%;
              background: linear-gradient(90deg, #11998e, #38ef7d);
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(progressFloat);
    console.log('✅ LearnFirst: Progress float widget added to page');

    // Click to hide
    progressFloat.addEventListener('click', () => {
      console.log('📊 LearnFirst: Progress float clicked, hiding...');
      progressFloat.style.opacity = '0';
      setTimeout(() => {
        progressFloat.remove();
        console.log('📊 LearnFirst: Progress float removed from page');
      }, 300);
    });
  }
}

// Initialize content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LearnFirstContent();
  });
} else {
  new LearnFirstContent();
}
