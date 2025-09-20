# 🌐 LearnFirst Manifest V3 Throttling - Logging Guide

This guide covers all the logging for the **new content-based throttling system** that replaces the old webRequestBlocking approach.

## 🚀 Quick Start - Where to Look

### 1. **Extension Background Logs**
- Go to `chrome://extensions/`
- Find "LearnFirst" → Click "service worker" 
- Console shows background script logs

### 2. **Page Content Logs**  
- Open any webpage
- Press **F12** → Console tab
- Look for throttling injection logs

### 3. **Test Page**
- Open `throttling-debug-test.html` 
- Follow instructions with DevTools open

## 📊 **Background Script Logs (Extension Console)**

### **✅ Initialization (Should See on Extension Load)**
```
🎯 LearnFirst: Background controller initializing...
🌐 LearnFirst: Setting up Manifest V3 compatible throttling...
✅ Using content-based throttling approach (Manifest V3 compatible)
🎯 Setting up content-based throttling injection...
✅ Injected throttling scripts into 5 existing tabs
```

### **✅ Throttling Status**
```
🚦 Throttling: normal=false, forced=true, current=false
🚦 LearnFirst: ENABLING THROTTLING - Progress: 0/3
✅ LearnFirst: Throttling enabled - tab delays will now appear
```

### **✅ Tab Event Handling**  
```
📊 Tab Update Event: TabID=123, Status=loading, URL=https://example.com
📊 shouldInjectDelay: true (initialized: true, throttling: true, progress: 0/3)
✅ LearnFirst: DELAY TRIGGERED - https://example.com (type: reload/refresh)
🚀 LearnFirst: handleTabDelay CALLED for tab 123: https://example.com
```

### **✅ Content Throttling Injection**
```
✅ Injected content throttling into tab 123
✅ Injected content throttling into tab 456
✅ Injected content throttling into tab 789
```

### **⚠️ Expected Warnings (Normal)**
```
⚠️ Could not inject throttling into tab 555: Cannot access chrome:// URL
⚠️ Could not inject throttling into tab 666: The extensions gallery cannot be scripted
```

## 📄 **Page Content Logs (Website Console - F12)**

### **✅ Throttling Initialization**
```
🐌 Content throttling initialized for: https://example.com
🐌 Applying content throttling with base delay: 500ms
```

### **✅ Learning Site Detection (No Throttling)**
```
🐌 Content throttling initialized for: https://en.wikipedia.org
⚡ Learning site detected - no throttling applied
```

### **✅ Image Throttling**
```
🖼️ Image loaded after 400ms delay
🖼️ Image loaded after 400ms delay
🖼️ Image loaded after 400ms delay
```

### **✅ Script Throttling**
```
📜 Script throttling delay applied: 650ms
📜 Script throttling delay applied: 650ms
```

### **✅ Tab Delay Overlay Logs** 
```
🎯 INJECTED FUNCTION STARTED - LearnFirst: Injecting delay overlay with 5000 ms delay
🎯 Current page: https://example.com
🎯 Document ready state: loading
📊 delayMs: 5000
📊 countdown: 5
LearnFirst: Delay overlay injected successfully
```

## 🎯 **What Each Log Means**

### **Background Script Logs:**

| Log Message | Meaning | What to Check |
|------------|---------|---------------|
| `🌐 Setting up Manifest V3 compatible throttling` | Extension initializing new system | ✅ Normal startup |
| `✅ Injected throttling scripts into X tabs` | Content scripts added to existing tabs | ✅ Working correctly |
| `✅ Injected content throttling into tab 123` | Single tab got throttling script | ✅ Per-tab injection working |
| `🚦 Throttling: normal=false, forced=true` | Debug mode active | ⚠️ Remove forced throttling later |
| `🚦 LearnFirst: ENABLING THROTTLING` | Goals not completed, throttling active | ✅ Normal behavior |

### **Page Content Logs:**

| Log Message | Meaning | User Experience |
|------------|---------|-----------------|
| `🐌 Content throttling initialized` | Page got throttling script | Will see slow loading effects |
| `⚡ Learning site detected` | Educational site bypassed | Full speed browsing |
| `🖼️ Image loaded after Xms delay` | Images throttled successfully | Visible loading delays |
| `📜 Script throttling delay applied` | JavaScript loading delayed | "Loading scripts..." indicators |

## ⚠️ **Troubleshooting Common Issues**

### **Problem: No content throttling logs**
```
Expected: 🐌 Content throttling initialized
Actual:   (nothing)
```
**Causes:**
- Extension not loaded properly
- Content script injection failed  
- Learning site detected (should show ⚡ message)
- Throttling disabled (goals completed)

**Solution:**
1. Reload extension in `chrome://extensions/`
2. Check background logs for injection errors
3. Verify throttling is enabled (`🚦 ENABLING THROTTLING`)

### **Problem: Images loading normally (no delays)**
```
Expected: 🖼️ Image loaded after Xms delay
Actual:   (images load instantly)
```
**Causes:**
- Content throttling not injected
- Learning site (Wikipedia, GitHub, etc.)
- Image throttling code not executing

**Solution:**
1. Check for `🐌 Content throttling initialized` log
2. Verify not on learning site (`⚡ Learning site detected`)
3. Reload page and check console immediately

### **Problem: Tab delays work but no content throttling**
```
Background: ✅ LearnFirst: DELAY TRIGGERED
Background: ✅ Injected content throttling
Page:       (no throttling logs)
```
**Cause:** Content script injection timing issue

**Solution:**
1. Wait 6+ seconds after tab delay overlay
2. Reload page to re-trigger injection
3. Check if page blocks script execution

### **Problem: All sites loading fast**
```
Background: 🚦 Throttling: current=false
```
**Cause:** Daily goals completed or throttling disabled

**Solution:**
1. Reset daily progress in popup
2. Check forced throttling debug setting
3. Verify goal progress: should be < daily goal

## 🧪 **Testing Strategy**

### **Step 1: Verify Extension Loading**
1. Open `chrome://extensions/`
2. Click "service worker" for LearnFirst
3. Should see initialization logs:
```
🎯 LearnFirst: Background controller initializing...
🌐 LearnFirst: Setting up Manifest V3 compatible throttling...
✅ Using content-based throttling approach
```

### **Step 2: Test Content Throttling**
1. Open any non-learning site (e.g., `https://example.com`)
2. Press F12 → Console
3. Should see:
```
🐌 Content throttling initialized for: https://example.com
🐌 Applying content throttling with base delay: 500ms
```

### **Step 3: Test Image Throttling**
1. On the same page, load images 
2. Should see multiple:
```
🖼️ Image loaded after 400ms delay
```

### **Step 4: Test Learning Site Bypass**
1. Open Wikipedia (`https://en.wikipedia.org`)
2. Should see:
```
🐌 Content throttling initialized for: https://en.wikipedia.org
⚡ Learning site detected - no throttling applied
```

### **Step 5: Test Full Experience**
1. Open new tab to any site
2. Should see: 5-second delay overlay
3. After overlay: page loads with throttling effects
4. Both background and page consoles should show relevant logs

## 📚 **Learning Sites (Should Bypass Throttling)**

These domains should show `⚡ Learning site detected` and load at full speed:

- wikipedia.org
- coursera.org  
- edx.org
- khanacademy.org
- stackoverflow.com
- github.com
- arxiv.org
- scholar.google.com
- medium.com
- dev.to
- freecodecamp.org
- codecademy.com

## 🔧 **Debug Commands for Console**

### **Force Content Throttling** (Page Console)
```javascript
// Manually trigger content throttling
contentThrottlingFunction(5000);
```

### **Check Extension Status** (Page Console)  
```javascript
// Check if extension is available
chrome.runtime.sendMessage({ action: 'getStatus' }, console.log);
```

### **Reset Progress** (Page Console)
```javascript
// Reset daily progress to re-enable throttling
chrome.runtime.sendMessage({ action: 'resetProgress' }, console.log);
```

## 🎯 **Expected User Experience**

### **Regular Sites (Reddit, YouTube, etc.):**
1. **5-second overlay** with countdown
2. **"Slow connection" banner** for 4 seconds  
3. **Images load with placeholders** then delayed appearance
4. **"Loading scripts..." indicators** 
5. **Overall sluggish feel**

### **Learning Sites (Wikipedia, etc.):**
1. **No overlay delay**
2. **No content throttling**  
3. **Full speed loading**
4. **Instant responsiveness**

This creates the perfect incentive: browsing feels slow and annoying, but learning sites work perfectly! 🎯
