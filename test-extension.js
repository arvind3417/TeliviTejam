// LearnFirst Extension Test Suite
// Run this in the browser console to verify extension functionality

console.log('🎯 LearnFirst Extension Test Suite');
console.log('================================');

// Test 1: Check if extension is loaded
const testExtensionLoaded = () => {
  console.log('\n📋 Test 1: Extension Loading');
  console.log('Manifest version:', chrome?.runtime?.getManifest?.()?.manifest_version || 'Extension not loaded');
  console.log('Extension name:', chrome?.runtime?.getManifest?.()?.name || 'N/A');
  
  if (chrome?.runtime?.getManifest) {
    console.log('✅ Extension is loaded successfully');
  } else {
    console.log('❌ Extension is not loaded or not accessible');
  }
};

// Test 2: Check storage functionality
const testStorage = async () => {
  console.log('\n💾 Test 2: Storage Functionality');
  
  try {
    // Test storage write
    await chrome.storage.local.set({testKey: 'testValue'});
    
    // Test storage read
    const result = await chrome.storage.local.get(['testKey']);
    
    if (result.testKey === 'testValue') {
      console.log('✅ Storage read/write working');
    } else {
      console.log('❌ Storage read/write failed');
    }
    
    // Clean up test data
    await chrome.storage.local.remove(['testKey']);
  } catch (error) {
    console.log('❌ Storage test failed:', error.message);
  }
};

// Test 3: Check API availability
const testAPIs = () => {
  console.log('\n🔌 Test 3: Chrome API Availability');
  
  const apis = {
    'chrome.storage': !!chrome?.storage,
    'chrome.tabs': !!chrome?.tabs,
    'chrome.scripting': !!chrome?.scripting,
    'chrome.alarms': !!chrome?.alarms,
    'chrome.notifications': !!chrome?.notifications,
    'chrome.runtime': !!chrome?.runtime
  };
  
  Object.entries(apis).forEach(([api, available]) => {
    console.log(available ? `✅ ${api}` : `❌ ${api} (missing)`);
  });
};

// Test 4: Check content script injection
const testContentScript = async () => {
  console.log('\n📄 Test 4: Content Script Injection');
  
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      console.log('⚠️ Cannot inject into chrome:// or extension pages (this is expected)');
      return;
    }
    
    const results = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        return {
          hasLearnFirst: !!window.learnFirstDelayInjected,
          url: window.location.href,
          title: document.title
        };
      }
    });
    
    if (results && results[0] && results[0].result) {
      console.log('✅ Content script injection working');
      console.log('Page info:', results[0].result);
    } else {
      console.log('❌ Content script injection failed');
    }
  } catch (error) {
    console.log('⚠️ Content script test failed (may be expected for restricted pages):', error.message);
  }
};

// Test 5: Test background script communication
const testBackgroundCommunication = async () => {
  console.log('\n🔄 Test 5: Background Script Communication');
  
  try {
    const response = await chrome.runtime.sendMessage({action: 'getStatus'});
    
    if (response) {
      console.log('✅ Background script communication working');
      console.log('Current status:', response);
    } else {
      console.log('❌ No response from background script');
    }
  } catch (error) {
    console.log('❌ Background communication failed:', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting LearnFirst extension tests...\n');
  
  testExtensionLoaded();
  testAPIs();
  await testStorage();
  await testContentScript();
  await testBackgroundCommunication();
  
  console.log('\n🎯 Test suite completed!');
  console.log('If you see mostly ✅ marks, your extension is working correctly.');
  console.log('If you see ❌ marks, check the browser console for error details.');
};

// Auto-run tests if this script is executed directly
if (typeof module === 'undefined') {
  runAllTests().catch(console.error);
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.testLearnFirst = {
    runAll: runAllTests,
    testStorage,
    testAPIs,
    testContentScript,
    testBackgroundCommunication
  };
  
  console.log('\n💡 You can also run individual tests:');
  console.log('• window.testLearnFirst.runAll()');
  console.log('• window.testLearnFirst.testStorage()');
  console.log('• etc.');
}
