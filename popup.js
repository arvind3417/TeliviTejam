// LearnFirst Popup JavaScript
// Handles all popup interface interactions and communication with background script

class LearnFirstPopup {
  constructor() {
    console.log('🎨 LearnFirst: Popup initializing...');
    this.currentStatus = null;
    this.startTime = Date.now();
    this.init();
  }

  async init() {
    console.log('🔧 LearnFirst: Popup initializing...');
    const startTime = Date.now();
    
    await this.loadStatus();
    this.setupEventListeners();
    this.updateUI();
    
    const initTime = Date.now() - startTime;
    console.log(`✅ LearnFirst: Popup initialized in ${initTime}ms`);
    console.log('📊 LearnFirst: Initial status:', this.currentStatus);
    
    // Update every few seconds
    setInterval(() => this.loadStatus(), 3000);
    console.log('⏰ LearnFirst: Auto-refresh enabled (every 3 seconds)');
  }

  async loadStatus() {
    const startTime = Date.now();
    console.log('📡 LearnFirst: Loading status from background script...');
    
    try {
      this.currentStatus = await chrome.runtime.sendMessage({ 
        action: 'getStatus' 
      });
      
      const loadTime = Date.now() - startTime;
      console.log(`📊 LearnFirst: Status loaded in ${loadTime}ms:`, {
        throttling: this.currentStatus?.isThrottling,
        progress: `${this.currentStatus?.currentProgress}/${this.currentStatus?.dailyGoal}`,
        completed: this.currentStatus?.goalCompleted,
        delay: `${this.currentStatus?.timeRemaining}ms`
      });
      
      this.updateUI();
    } catch (error) {
      console.error('❌ LearnFirst: Failed to load status:', error);
      this.showError('Failed to connect to extension');
    }
  }

  updateUI() {
    if (!this.currentStatus) {
      console.log('⚠️ LearnFirst: Cannot update UI - no status data');
      return;
    }

    console.log('🎨 LearnFirst: Updating popup UI...');
    this.updateStatusIndicator();
    this.updateProgress();
    this.updateSettings();
    console.log('✅ LearnFirst: UI update complete');
  }

  updateStatusIndicator() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (this.currentStatus.goalCompleted) {
      statusDot.className = 'status-dot completed';
      statusText.textContent = 'Goals Completed - Full Speed! 🚀';
    } else if (this.currentStatus.isThrottling) {
      statusDot.className = 'status-dot throttling';
      statusText.textContent = 'Throttling Active - Complete Goals';
    } else {
      statusDot.className = 'status-dot';
      statusText.textContent = 'Ready';
    }
  }

  updateProgress() {
    const currentProgress = document.getElementById('currentProgress');
    const dailyGoal = document.getElementById('dailyGoal');
    const progressFill = document.getElementById('progressFill');
    const progressMessage = document.getElementById('progressMessage');
    const progressSection = document.querySelector('.progress-section');

    currentProgress.textContent = this.currentStatus.currentProgress;
    dailyGoal.textContent = this.currentStatus.dailyGoal;

    const percentage = Math.min(
      (this.currentStatus.currentProgress / this.currentStatus.dailyGoal) * 100,
      100
    );
    
    progressFill.style.width = `${percentage}%`;

    if (this.currentStatus.goalCompleted) {
      progressSection.classList.add('completed');
      progressMessage.textContent = '🎉 Congratulations! All goals completed for today!';
      
      // Add celebration animation
      progressSection.classList.add('celebrate');
      setTimeout(() => progressSection.classList.remove('celebrate'), 600);
    } else {
      progressSection.classList.remove('completed');
      const remaining = this.currentStatus.dailyGoal - this.currentStatus.currentProgress;
      progressMessage.textContent = `Complete ${remaining} more learning activities to unlock full speed!`;
    }
  }

  updateSettings() {
    const goalInput = document.getElementById('goalInput');
    const delayInput = document.getElementById('delayInput');

    goalInput.value = this.currentStatus.dailyGoal;
    delayInput.value = Math.floor(this.currentStatus.timeRemaining / 1000);
  }

  setupEventListeners() {
    // Activity buttons
    document.getElementById('markReadingBtn').addEventListener('click', () => {
      this.markActivity('reading', 'Great! Article reading completed 📖');
    });

    document.getElementById('markVideoBtn').addEventListener('click', () => {
      this.markActivity('video', 'Awesome! Video learning completed 🎥');
    });

    document.getElementById('markCourseBtn').addEventListener('click', () => {
      this.markActivity('course', 'Excellent! Course progress marked 🎓');
    });

    // Settings buttons
    document.getElementById('updateGoalBtn').addEventListener('click', () => {
      this.updateDailyGoal();
    });

    document.getElementById('updateDelayBtn').addEventListener('click', () => {
      this.updateDelay();
    });

    // Footer buttons
    document.getElementById('resetProgressBtn').addEventListener('click', () => {
      this.resetProgress();
    });

    document.getElementById('viewStatsBtn').addEventListener('click', () => {
      this.showStats();
    });

    // Enter key support for inputs
    document.getElementById('goalInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.updateDailyGoal();
    });

    document.getElementById('delayInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.updateDelay();
    });

    // Learning site links - track clicks
    document.querySelectorAll('.site-link').forEach(link => {
      link.addEventListener('click', () => {
        this.trackSiteVisit(link.href);
      });
    });
  }

  async markActivity(type, message) {
    console.log(`🎯 LearnFirst: User manually marking activity: ${type}`);
    const startTime = Date.now();
    
    try {
      await chrome.runtime.sendMessage({ 
        action: 'markLearningComplete',
        type: type
      });
      
      const actionTime = Date.now() - startTime;
      console.log(`✅ LearnFirst: Activity marked successfully in ${actionTime}ms: ${type}`);
      
      this.showSuccess(message);
      await this.loadStatus(); // Refresh status immediately
      
      // Add visual feedback to button
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = '✅ Marked!';
      button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      
      console.log('🎨 LearnFirst: Button feedback applied');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        console.log('🎨 LearnFirst: Button feedback removed');
      }, 2000);

    } catch (error) {
      console.error(`❌ LearnFirst: Failed to mark activity ${type}:`, error);
      this.showError('Failed to mark activity');
    }
  }

  async updateDailyGoal() {
    const goalInput = document.getElementById('goalInput');
    const newGoal = parseInt(goalInput.value);
    const oldGoal = this.currentStatus?.dailyGoal;

    console.log(`🎯 LearnFirst: User updating daily goal: ${oldGoal} → ${newGoal}`);

    if (newGoal < 1 || newGoal > 20) {
      console.warn(`⚠️ LearnFirst: Invalid goal value: ${newGoal} (must be 1-20)`);
      this.showError('Goal must be between 1 and 20');
      goalInput.value = this.currentStatus.dailyGoal;
      return;
    }

    try {
      const startTime = Date.now();
      await chrome.runtime.sendMessage({ 
        action: 'setGoal',
        goal: newGoal
      });
      
      const updateTime = Date.now() - startTime;
      console.log(`✅ LearnFirst: Daily goal updated successfully in ${updateTime}ms: ${newGoal}`);
      
      this.showSuccess(`Daily goal updated to ${newGoal} activities`);
      await this.loadStatus();
    } catch (error) {
      console.error('❌ LearnFirst: Failed to update daily goal:', error);
      this.showError('Failed to update goal');
      goalInput.value = this.currentStatus.dailyGoal;
    }
  }

  async updateDelay() {
    const delayInput = document.getElementById('delayInput');
    const newDelay = parseInt(delayInput.value);
    const oldDelay = this.currentStatus ? Math.floor(this.currentStatus.timeRemaining / 1000) : 'unknown';

    console.log(`⏱️ LearnFirst: User updating tab delay: ${oldDelay}s → ${newDelay}s`);

    if (newDelay < 1 || newDelay > 30) {
      console.warn(`⚠️ LearnFirst: Invalid delay value: ${newDelay} (must be 1-30 seconds)`);
      this.showError('Delay must be between 1 and 30 seconds');
      delayInput.value = Math.floor(this.currentStatus.timeRemaining / 1000);
      return;
    }

    try {
      const startTime = Date.now();
      // Send delay update to background script
      await chrome.runtime.sendMessage({ 
        action: 'setDelay',
        delay: newDelay * 1000 // Convert to milliseconds
      });
      
      const updateTime = Date.now() - startTime;
      console.log(`✅ LearnFirst: Tab delay updated successfully in ${updateTime}ms: ${newDelay}s (${newDelay * 1000}ms)`);
      
      this.showSuccess(`Tab delay updated to ${newDelay} seconds`);
      await this.loadStatus(); // Refresh status to show new delay
    } catch (error) {
      console.error('❌ LearnFirst: Failed to update tab delay:', error);
      this.showError('Failed to update delay');
      delayInput.value = Math.floor(this.currentStatus.timeRemaining / 1000);
    }
  }

  async resetProgress() {
    console.log('🔄 LearnFirst: User requesting progress reset...');
    
    if (!confirm('Are you sure you want to reset today\'s progress?')) {
      console.log('🔄 LearnFirst: Progress reset cancelled by user');
      return;
    }

    try {
      const startTime = Date.now();
      await chrome.runtime.sendMessage({ action: 'resetProgress' });
      
      const resetTime = Date.now() - startTime;
      console.log(`✅ LearnFirst: Progress reset successfully in ${resetTime}ms`);
      
      this.showSuccess('Progress reset successfully');
      await this.loadStatus();
    } catch (error) {
      console.error('❌ LearnFirst: Failed to reset progress:', error);
      this.showError('Failed to reset progress');
    }
  }

  showStats() {
    // For now, open a simple stats view
    // In a full implementation, you might show a detailed statistics page
    chrome.storage.local.get(['dailyStreak', 'totalActivities', 'averageDaily'], (result) => {
      const stats = {
        streak: result.dailyStreak || 0,
        total: result.totalActivities || this.currentStatus.currentProgress,
        average: result.averageDaily || 2.5
      };

      alert(`📊 Your Learning Stats:\n\n` +
            `🔥 Current streak: ${stats.streak} days\n` +
            `📚 Total activities: ${stats.total}\n` +
            `📈 Daily average: ${stats.average.toFixed(1)}\n\n` +
            `Keep up the great work!`);
    });
  }

  trackSiteVisit(url) {
    // Track visits to recommended learning sites
    chrome.runtime.sendMessage({ 
      action: 'trackSiteVisit',
      url: url
    });
  }

  showSuccess(message) {
    console.log(`✅ LearnFirst: Success notification: ${message}`);
    this.showNotification(message, 'success');
  }

  showError(message) {
    console.error(`❌ LearnFirst: Error notification: ${message}`);
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      zIndex: '10000',
      maxWidth: '300px',
      textAlign: 'center',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    });

    if (type === 'success') {
      notification.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
      notification.style.color = 'white';
    } else {
      notification.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
      notification.style.color = 'white';
    }

    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.opacity = '1', 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LearnFirstPopup();
});
