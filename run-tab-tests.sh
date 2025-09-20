#!/bin/bash
# LearnFirst Tab & Reload Test Runner
# Comprehensive testing for new tab and reload delays

echo "🎯 LearnFirst Tab & Reload Delay Tests"
echo "====================================="
echo ""

# Check extension files
echo "📁 Checking extension files..."
if [ ! -f "manifest.json" ] || [ ! -f "background.js" ]; then
    echo "❌ Extension files missing"
    exit 1
fi
echo "✅ Extension files found"
echo ""

# Start the comprehensive test
echo "🧪 Starting comprehensive tab delay tests..."
echo ""

echo "📋 Test Plan:"
echo "1. ✅ New Tab Delays - Opening new tabs should show delay overlay"
echo "2. ✅ Reload Delays - F5, Ctrl+R, refresh button should trigger delays"  
echo "3. ✅ Navigation Delays - Clicking links in same tab should show delays"
echo "4. ✅ URL Change Delays - Address bar navigation should trigger delays"
echo "5. ✅ Learning Site Detection - Educational sites should complete goals"
echo "6. ✅ Goal Completion - No delays after goals are met"
echo ""

# Open test pages
echo "🌐 Opening test pages..."

if command -v open &> /dev/null; then
    # macOS
    echo "Opening test pages in browser..."
    open "test-tab-reload.html"
    sleep 2
    open "test-delay-setting.html" 
elif command -v xdg-open &> /dev/null; then
    # Linux
    echo "Opening test pages in browser..."
    xdg-open "test-tab-reload.html"
    sleep 2
    xdg-open "test-delay-setting.html"
else
    echo "⚠️ Please manually open these files:"
    echo "- test-tab-reload.html"
    echo "- test-delay-setting.html"
fi

echo ""
echo "🔧 Manual Testing Steps:"
echo ""
echo "STEP 1: Install Extension"
echo "• Go to chrome://extensions/"  
echo "• Enable 'Developer Mode'"
echo "• Click 'Load unpacked'"
echo "• Select this folder: $(pwd)"
echo ""

echo "STEP 2: Reset for Testing"
echo "• Open the test page that just launched"
echo "• Click 'Reset for Testing' button"
echo "• This sets goal to 1 and resets progress"
echo ""

echo "STEP 3: Test New Tab Delays"
echo "• Click any 'new tab' links in the test page"
echo "• Should see delay overlay with '📄 New tab opened'"
echo "• Countdown should match your delay setting"
echo ""

echo "STEP 4: Test Reload Delays"  
echo "• Press F5 to refresh the page"
echo "• Should see delay overlay with '🔄 Page refreshed'"
echo "• Try Ctrl+R and browser refresh button too"
echo ""

echo "STEP 5: Test Navigation Delays"
echo "• Click links that navigate in the same tab"
echo "• Should see delay overlay with '🧭 Navigated to new page'"
echo "• Try typing new URLs in address bar"
echo ""

echo "STEP 6: Test Goal Completion"
echo "• Visit Wikipedia or Stack Overflow"
echo "• Should complete your learning goal (1 activity)"
echo "• After completion, no more delays should appear"
echo ""

echo "🐛 Debug Tips:"
echo "• Open DevTools (F12) and check Console"
echo "• Look for 'LearnFirst:' messages"
echo "• Check extension's background page for errors"
echo "• Use test page buttons for manual testing"
echo ""

echo "🎯 Expected Results:"
echo "✅ All new tabs show delay overlay"
echo "✅ All page reloads show delay overlay"  
echo "✅ All navigation shows delay overlay"
echo "✅ Delay time matches your setting"
echo "✅ Delays stop after completing goals"
echo "✅ Different overlay messages for different actions"
echo ""

echo "🚀 Tests are ready! Follow the steps above."
echo "If you see any issues, check the browser console for detailed logs."
