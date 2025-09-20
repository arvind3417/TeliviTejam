# LearnFirst Extension - Comprehensive Logging Guide

This guide explains all the logging added to validate that the extension is working correctly, including the new **Manifest V3 compatible throttling system**. Use this to troubleshoot and confirm functionality.

## 🚀 How to View Logs

### 1. Background Script Logs
- Go to `chrome://extensions/`
- Find "LearnFirst" extension
- Click "background page" or "service worker"
- Open Console tab

### 2. Content Script Logs (Web Pages)
- Open any webpage
- Press F12 (Developer Tools)
- Go to Console tab
- Look for "LearnFirst:" messages

### 3. Popup Logs
- Right-click on extension icon
- Select "Inspect popup"
- Go to Console tab

## 📊 Background Script Logging

### **Initialization & Setup**
```
🎯 LearnFirst: Background controller initializing...
🎯 LearnFirst: Initial state - {throttling: false, goal: 3, progress: 0, delay: 5000}
🎯 LearnFirst: Setting up event listeners...
✅ LearnFirst: All event listeners set up successfully
🚀 LearnFirst: Initializing extension...
✅ LearnFirst: Initialization complete in Xms
📊 LearnFirst: Current state: {throttling: true, progress: "0/3", delay: "5000ms", ...}
```

### **Tab Events**
```
📊 Tab Update Event: TabID=123, Status=loading, URL=https://google.com, Changes: {...}
✅ LearnFirst: DELAY TRIGGERED - https://google.com (type: reload/refresh)
🔄 LearnFirst: URL Change DELAY TRIGGERED: https://facebook.com
🆕 LearnFirst: New tab created (ID: 456, URL: https://wikipedia.org)
✅ LearnFirst: NEW TAB DELAY TRIGGERED: https://wikipedia.org
```

### **Delay Injection**
```
🎯 LearnFirst: Should inject delay for https://google.com - throttling: true, progress: 0/3
🎯 LearnFirst: Injecting delay overlay for tab 123: https://google.com (reload/refresh)
🎯 LearnFirst: Injecting delay overlay with 5000 ms delay for reload/refresh
✅ LearnFirst: Successfully injected delay overlay for tab 123
```

### **Learning Content Detection**
```
🔍 LearnFirst: Checking for learning content: https://wikipedia.org
🎓 LearnFirst: LEARNING CONTENT DETECTED! URL: https://wikipedia.org, Matched domain: wikipedia.org
📈 LearnFirst: Progress incremented: 0 → 1/3
🎯 LearnFirst: Still need 2 more to complete goals
```

### **Goal Completion**
```
🎉 LearnFirst: GOALS COMPLETED! Disabling throttling. Final progress: 3/3
🚦 LearnFirst: DISABLING THROTTLING - Goals completed! Progress: 3/3
✅ LearnFirst: Throttling disabled - no more tab delays!
```

### **Message Handling**
```
💬 LearnFirst: Message received: {action: "getStatus", from: "popup", ...}
🔄 LearnFirst: Processing message: getStatus
📊 LearnFirst: Status requested - returning: {isThrottling: true, ...}
⏱️ LearnFirst: Message getStatus processed in 5ms
```

### **Data Storage**
```
💾 LearnFirst: Saving data to storage: {currentProgress: 1, dailyGoal: 3, ...}
✅ LearnFirst: Data saved successfully in 3ms
🎯 LearnFirst: Loaded settings - Goal: 3, Delay: 5000ms
```

## 📄 Content Script Logging

### **Page Analysis**
```
📄 LearnFirst: Content script initializing on https://wikipedia.org
📊 LearnFirst: Content script config: {url: ..., title: ..., readingThreshold: 30}
🔧 LearnFirst: Initializing content script features...
✅ LearnFirst: Content script initialization complete
```

### **Learning Detection**
```
🔍 LearnFirst: Analyzing page for learning content...
🎓 LearnFirst: LEARNING CONTENT DETECTED! {url: ..., title: ..., detectionMethod: "content-analysis"}
🎓 LearnFirst: Showing learning content indicator
✅ LearnFirst: Learning indicator added to page
```

### **Reading Tracking**
```
📖 LearnFirst: Reading session started {url: ..., threshold: "30s", ...}
⏰ LearnFirst: Reading threshold reached! Time spent: 32s
🎉 LearnFirst: MARKING LEARNING ACTIVITY COMPLETE! {url: ..., timeSpent: "32s", ...}
🎉 LearnFirst: Showing completion badge to user
✅ LearnFirst: Completion badge added to page
```

### **Progress Widget**
```
📊 LearnFirst: Checking if progress float should be shown...
📊 LearnFirst: Throttling active, showing progress float: {progress: "1/3", ...}
📊 LearnFirst: Creating progress float widget
✅ LearnFirst: Progress float widget added to page
```

## 🎨 Popup Script Logging

### **Initialization**
```
🎨 LearnFirst: Popup initializing...
🔧 LearnFirst: Popup initializing...
✅ LearnFirst: Popup initialized in 15ms
📊 LearnFirst: Initial status: {isThrottling: true, currentProgress: 1, ...}
⏰ LearnFirst: Auto-refresh enabled (every 3 seconds)
```

### **Status Updates**
```
📡 LearnFirst: Loading status from background script...
📊 LearnFirst: Status loaded in 8ms: {throttling: true, progress: "1/3", ...}
🎨 LearnFirst: Updating popup UI...
✅ LearnFirst: UI update complete
```

### **User Actions**
```
🎯 LearnFirst: User manually marking activity: reading
✅ LearnFirst: Activity marked successfully in 12ms: reading
🎨 LearnFirst: Button feedback applied
🎯 LearnFirst: User updating daily goal: 3 → 5
✅ LearnFirst: Daily goal updated successfully in 8ms: 5
⏱️ LearnFirst: User updating tab delay: 5s → 10s
✅ LearnFirst: Tab delay updated successfully in 6ms: 10s (10000ms)
```

### **Reset Actions**
```
🔄 LearnFirst: User requesting progress reset...
✅ LearnFirst: Progress reset successfully in 10ms
```

## 🎯 What to Look For

### **✅ Extension Working Correctly**
- Initialization logs appear on extension reload
- Tab events are detected and logged
- Delay overlays are injected successfully
- Learning content is detected automatically
- Progress increments when goals are met
- Throttling disables when goals completed
- Settings save and persist correctly

### **❌ Common Issues & Logs**
- `❌ LearnFirst: Could not inject delay overlay` - Normal for restricted pages
- `⚠️ LearnFirst: Not initialized yet` - Extension still loading
- `❌ LearnFirst: Failed to load status` - Communication issue
- `🚫 LearnFirst: Delay no longer needed` - Goals completed during operation

### **🔍 Validation Scenarios**

1. **Tab Delay Test**
   - Open new tab → Look for "DELAY TRIGGERED" and "overlay injected"
   - Reload page → Should see "reload/refresh" type
   - Navigate → Should see "navigation" or "url-change" type

2. **Learning Detection Test**
   - Visit Wikipedia → Look for "LEARNING CONTENT DETECTED"
   - Stay 30+ seconds → Should see "Reading threshold reached"
   - Check progress → Should see "Progress incremented"

3. **Goal Completion Test**
   - Complete enough activities → Look for "GOALS COMPLETED"
   - Open new tab → Should see "No delay needed"
   - Check status → Throttling should be OFF

4. **Settings Test**
   - Change delay → Look for "Tab delay updated successfully"
   - Change goal → Look for "Daily goal updated successfully"
   - Reset progress → Look for "Progress reset successfully"

## 🛠️ Debugging Tips

- **No logs at all**: Extension not loaded or console not open
- **Partial logs**: Check all console sources (background, content, popup)
- **Errors**: Look for red ❌ messages with error details
- **Performance**: Check timing logs (operations should be <50ms)
- **State**: Look for current state logs to understand status

---

**All log messages are prefixed with "🎯 LearnFirst:" for easy identification. Use browser's console filter to show only LearnFirst messages.**
