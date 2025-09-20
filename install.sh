#!/bin/bash
# LearnFirst Extension Installation Helper
# Automates the setup process for different browsers

echo "🎯 LearnFirst Extension Installation Helper"
echo "=========================================="
echo ""

# Check if icons exist
if [ ! -f "icons/icon-16.png" ]; then
    echo "📋 Creating placeholder icons..."
    
    if command -v python3 &> /dev/null && python3 -c "import PIL" 2>/dev/null; then
        python3 create-icons.py
    else
        echo "⚠️  Python3 with PIL not found. Using placeholder files..."
        mkdir -p icons
        
        # Create simple text placeholder files
        for size in 16 32 48 128; do
            echo "LearnFirst ${size}x${size} Icon Placeholder" > "icons/icon-${size}.png.txt"
            echo "Replace this with a proper ${size}x${size} PNG icon" >> "icons/icon-${size}.png.txt"
        done
        
        echo "❗ Please create proper PNG icon files in the icons/ directory"
        echo "   Or install PIL with: pip install Pillow, then run: python3 create-icons.py"
    fi
else
    echo "✅ Icons found!"
fi

echo ""
echo "🌐 Browser-specific setup:"
echo ""

# Chrome/Edge instructions
echo "📦 For Chrome/Edge:"
echo "1. Open chrome://extensions/ (or edge://extensions/)"
echo "2. Enable 'Developer mode' (toggle in top-right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this folder: $(pwd)"
echo ""

# Firefox instructions  
echo "🦊 For Firefox:"
echo "1. Backup the Chrome manifest: mv manifest.json manifest_chrome.json"
echo "2. Use Firefox manifest: mv manifest_firefox.json manifest.json"
echo "3. Go to about:debugging"
echo "4. Click 'This Firefox' → 'Load Temporary Add-on'"
echo "5. Select any file from this folder"
echo ""

# Safari instructions
echo "🧭 For Safari:"
echo "1. Use Xcode to convert: xcrun safari-web-extension-converter ."
echo "2. Or use Safari Extension Builder tools"
echo "3. Enable in Safari → Preferences → Extensions"
echo ""

echo "📖 Full instructions available in README.md"
echo ""

# Test if browser is available to auto-open
if command -v open &> /dev/null; then
    echo "🚀 Would you like to open Chrome extensions page? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        open "chrome://extensions/"
        echo "✅ Chrome extensions page opened!"
        echo "   Enable Developer Mode and click 'Load unpacked'"
    fi
fi

echo ""
echo "🎉 Setup complete! Your LearnFirst extension is ready to install."
echo "📚 Remember to set your daily learning goals in the extension popup!"
