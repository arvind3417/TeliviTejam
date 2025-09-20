#!/bin/bash
# LearnFirst Extension Debug Setup
# Run this to set up debugging for extension loading issues

echo "🐛 LearnFirst Extension Debug Setup"
echo "=================================="
echo ""

# Check current status
echo "📁 Current files in directory:"
ls -la *.json *.js *.html 2>/dev/null || echo "Some files missing"
echo ""

# Validate manifest
echo "🔍 Validating manifest.json..."
if [ -f "manifest.json" ]; then
    if python3 -m json.tool manifest.json > /dev/null 2>&1; then
        echo "✅ manifest.json is valid JSON"
    else
        echo "❌ manifest.json has syntax errors!"
        echo "Run: python3 -m json.tool manifest.json"
    fi
else
    echo "❌ manifest.json not found!"
fi
echo ""

# Check for required files
echo "📋 Checking required files..."
files_to_check=("manifest.json" "background.js" "popup.html" "popup.js" "content.js")
missing_files=()

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Missing files detected! Extension may fail to load."
fi
echo ""

# Offer to switch to minimal version
echo "🧪 Debug Options:"
echo "1. Switch to minimal version (recommended for debugging)"
echo "2. Fix current version"
echo "3. Check icon files"
echo ""

read -p "Choose option (1-3): " option

case $option in
    1)
        echo "🔄 Switching to minimal debug version..."
        
        # Backup current files
        if [ -f "manifest.json" ]; then
            cp manifest.json manifest-full.json
            echo "📁 Backed up manifest.json → manifest-full.json"
        fi
        
        if [ -f "background.js" ]; then
            cp background.js background-full.js
            echo "📁 Backed up background.js → background-full.js"
        fi
        
        # Use minimal versions
        if [ -f "manifest-minimal.json" ]; then
            cp manifest-minimal.json manifest.json
            echo "✅ Using manifest-minimal.json"
        fi
        
        if [ -f "background-minimal.js" ]; then
            echo "✅ Using background-minimal.js (referenced in minimal manifest)"
        fi
        
        echo ""
        echo "🚀 Minimal version ready!"
        echo "Now load the extension in Chrome and check for these logs:"
        echo "   🎯 BASIC TEST: LearnFirst background script is running!"
        echo ""
        ;;
        
    2)
        echo "🔧 Checking current version..."
        
        # Check for common issues
        if grep -q "web_accessible_resources" manifest.json; then
            echo "🔍 Checking web_accessible_resources..."
            if grep -q "throttle.js\|delay-overlay.html" manifest.json; then
                echo "❌ Found references to non-existent files in web_accessible_resources"
                echo "   This could prevent extension loading"
            fi
        fi
        
        echo "📖 See debug-extension-loading.md for detailed troubleshooting"
        ;;
        
    3)
        echo "🎨 Checking icon files..."
        
        if [ -d "icons" ]; then
            echo "📁 Icons directory exists"
            icon_files=("icon-16.png" "icon-32.png" "icon-48.png" "icon-128.png")
            
            for icon in "${icon_files[@]}"; do
                if [ -f "icons/$icon" ]; then
                    size=$(wc -c < "icons/$icon" 2>/dev/null || echo "0")
                    echo "✅ icons/$icon exists (${size} bytes)"
                else
                    echo "❌ icons/$icon missing"
                fi
            done
        else
            echo "❌ Icons directory missing"
            echo "Creating placeholder icons..."
            mkdir -p icons
            echo "Icon placeholder" > icons/icon-16.png.txt
            echo "Icon placeholder" > icons/icon-32.png.txt
            echo "Icon placeholder" > icons/icon-48.png.txt
            echo "Icon placeholder" > icons/icon-128.png.txt
            echo "⚠️  Created text placeholders - you need real PNG files"
        fi
        ;;
        
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "📋 Next Steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer Mode' (top right toggle)"
echo "3. Click 'Load unpacked' and select this folder"
echo "4. Look for any errors or warnings"
echo "5. Click 'background page' to check console logs"
echo ""

echo "🆘 If the extension still doesn't load:"
echo "   • Check debug-extension-loading.md for detailed help"
echo "   • Try the minimal version first (option 1)"
echo "   • Check Chrome version (needs Chrome 88+ for Manifest V3)"
echo ""

echo "✅ Debug setup complete!"
