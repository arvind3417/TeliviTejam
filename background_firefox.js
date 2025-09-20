// LearnFirst Background Script for Firefox
// Handles goal tracking, throttling logic, and tab management for Firefox

class LearnFirstFirefoxController {
  constructor() {
    this.isThrottling = false;
    this.dailyGoal = 3;
    this.currentProgress = 0;
    this.throttleDelay = 5000;
    this.setupListeners();
    this.initializeDaily();
  }

  setupListeners() {
    // Tab creation listener
    browser.tabs.onCreated.addListener((tab) => {
      this.handleTabCreation(tab);
    });

    // Tab update listener
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.checkIfLearningContent(tab.url);
      }
    });

    // Handle messages from popup and content scripts
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
    });

    // Web request listener for throttling (Firefox specific)
    if (browser.webRequest) {
      browser.webRequest.onBeforeRequest.addListener(
        (details) => this.handleWebRequest(details),
        {urls: ["<all_urls>"]},
        ["blocking"]
      );
    }

    // Daily reset alarm
    browser.alarms.create('dailyReset', { 
      when: this.getNextMidnight(),
      periodInMinutes: 24 * 60 
    });
    
    browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'dailyReset') {
        this.resetDailyProgress();
      }
    });
  }

  handleWebRequest(details) {
    if (!this.isThrottling) return {};
    
    // Skip for certain request types that shouldn't be throttled
    if (['xmlhttprequest', 'websocket', 'ping'].includes(details.type)) {
      return {};
    }

    // Add artificial delay for main document requests
    if (details.type === 'main_frame') {
      // Firefox doesn't support promise-based blocking, so we simulate delay differently
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({});
        }, Math.random() * 2000 + 1000); // 1-3 second random delay
      });
    }

    return {};
  }

  async handleTabCreation(tab) {
    if (!this.isThrottling) return;
    
    try {
      // Small delay before injecting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Inject delay overlay
      await browser.tabs.executeScript(tab.id, {
        code: `
          if (!window.learnFirstDelayInjected) {
            window.learnFirstDelayInjected = true;
            (${this.injectDelayOverlay.toString()})(${this.throttleDelay});
          }
        `
      });
    } catch (error) {
      console.log('Could not inject delay overlay:', error);
    }
  }

  injectDelayOverlay(delayMs) {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        backdrop-filter: blur(5px);
      ">
        <div style="text-align: center; padding: 2rem;">
          <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">🎯 Complete Your Learning Goals First!</h2>
          <p style="margin: 0 0 1rem 0; font-size: 1.1rem;">This page will load in <span id="countdown">${Math.ceil(delayMs/1000)}</span> seconds...</p>
          <p style="margin: 0; opacity: 0.7; font-size: 0.9rem;">Learning items completed today: <span id="progress">Loading...</span></p>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Countdown timer
    let countdown = Math.ceil(delayMs / 1000);
    const countdownElement = overlay.querySelector('#countdown');
    
    const interval = setInterval(() => {
      countdown--;
      countdownElement.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(interval);
        overlay.remove();
      }
    }, 1000);

    // Get current progress
    browser.runtime.sendMessage({ action: 'getProgress' }).then((response) => {
      if (response) {
        const progressElement = overlay.querySelector('#progress');
        progressElement.textContent = `${response.current}/${response.total}`;
      }
    });

    // Remove overlay after delay
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, delayMs);
  }

  checkIfLearningContent(url) {
    const learningDomains = [
      'wikipedia.org', 'coursera.org', 'edx.org', 'khanacademy.org',
      'stackoverflow.com', 'medium.com', 'dev.to', 'arxiv.org',
      'scholar.google', 'researchgate.net', 'nature.com', 'sciencedirect.com',
      'news.ycombinator.com', 'reddit.com/r/todayilearned',
      'reddit.com/r/science', 'reddit.com/r/programming', 'github.com'
    ];

    const isLearningContent = learningDomains.some(domain => 
      url.toLowerCase().includes(domain)
    );

    if (isLearningContent) {
      this.incrementProgress();
    }
  }

  async handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'getStatus':
        const status = await this.getStatus();
        sendResponse(status);
        break;
        
      case 'getProgress':
        sendResponse({
          current: this.currentProgress,
          total: this.dailyGoal
        });
        break;
        
      case 'setGoal':
        await this.setDailyGoal(request.goal);
        sendResponse({ success: true });
        break;
        
      case 'markLearningComplete':
        this.incrementProgress();
        sendResponse({ success: true });
        break;
        
      case 'resetProgress':
        await this.resetDailyProgress();
        sendResponse({ success: true });
        break;
    }
  }

  async getStatus() {
    await this.loadData();
    return {
      isThrottling: this.isThrottling,
      currentProgress: this.currentProgress,
      dailyGoal: this.dailyGoal,
      goalCompleted: this.currentProgress >= this.dailyGoal,
      timeRemaining: this.throttleDelay
    };
  }

  async incrementProgress() {
    this.currentProgress++;
    await this.saveData();
    
    if (this.currentProgress >= this.dailyGoal && this.isThrottling) {
      this.disableThrottling();
      this.showGoalCompletedNotification();
    }
  }

  async setDailyGoal(newGoal) {
    this.dailyGoal = newGoal;
    await this.saveData();
    this.updateThrottlingStatus();
  }

  updateThrottlingStatus() {
    const shouldThrottle = this.currentProgress < this.dailyGoal;
    
    if (shouldThrottle !== this.isThrottling) {
      if (shouldThrottle) {
        this.enableThrottling();
      } else {
        this.disableThrottling();
      }
    }
  }

  enableThrottling() {
    this.isThrottling = true;
    this.saveData();
    console.log('LearnFirst: Throttling enabled');
  }

  disableThrottling() {
    this.isThrottling = false;
    this.saveData();
    console.log('LearnFirst: Throttling disabled');
  }

  async resetDailyProgress() {
    this.currentProgress = 0;
    this.updateThrottlingStatus();
    await this.saveData();
  }

  async initializeDaily() {
    await this.loadData();
    this.updateThrottlingStatus();
  }

  async loadData() {
    try {
      const result = await browser.storage.local.get([
        'currentProgress', 'dailyGoal', 'lastResetDate'
      ]);
      
      const today = new Date().toDateString();
      if (result.lastResetDate !== today) {
        this.currentProgress = 0;
        this.saveData();
      } else {
        this.currentProgress = result.currentProgress || 0;
      }
      
      this.dailyGoal = result.dailyGoal || 3;
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async saveData() {
    try {
      await browser.storage.local.set({
        currentProgress: this.currentProgress,
        dailyGoal: this.dailyGoal,
        isThrottling: this.isThrottling,
        lastResetDate: new Date().toDateString()
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  showGoalCompletedNotification() {
    if (browser.notifications) {
      browser.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'LearnFirst: Goals Completed! 🎉',
        message: 'Great job! Your internet is now running at full speed.'
      });
    }
  }

  getNextMidnight() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }
}

// Initialize Firefox controller
const learnFirstFirefox = new LearnFirstFirefoxController();
