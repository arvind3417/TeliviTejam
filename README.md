# LearnFirst - Speed Up by Learning 🎯

**Throttle your internet speed until you complete daily learning goals. Learn more, surf faster!**

## 🎯 What is LearnFirst?

LearnFirst is a cross-browser extension that gamifies learning by creating artificial friction in your web browsing experience. It slows down new tab loading and throttles certain websites until you complete your daily learning goals. Once you've read articles, watched educational videos, or engaged with learning content, your internet returns to full speed!

### ✨ Key Features

- **Smart Tab Throttling**: New tabs load with a 5-second delay until goals are met
- **Learning Content Detection**: Automatically recognizes educational websites and content
- **Progress Tracking**: Visual progress bar and goal completion notifications
- **Customizable Goals**: Set daily learning targets (1-20 activities per day)
- **Cross-Browser Compatible**: Works on Chrome, Firefox, Edge, and Safari
- **Beautiful UI**: Modern, intuitive popup interface
- **Reading Time Detection**: Tracks actual reading time on educational content
- **Recommended Learning Sites**: Quick access to quality educational resources

## 🚀 Installation Guide

### For Google Chrome / Microsoft Edge

1. **Download the Extension**
   - Clone or download this repository
   - Or download the ZIP file and extract it

2. **Enable Developer Mode**
   - Open Chrome/Edge and go to `chrome://extensions/` (or `edge://extensions/`)
   - Toggle "Developer mode" in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `TeliviTejam` folder (the one containing `manifest.json`)
   - The extension icon should appear in your toolbar

### For Mozilla Firefox

1. **Use Firefox Manifest**
   - Rename `manifest_firefox.json` to `manifest.json`
   - Rename the original `manifest.json` to `manifest_chrome.json` (as backup)

2. **Load Temporarily** (for testing)
   - Go to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select any file in the extension folder

3. **For Permanent Installation**
   - Package the extension as a ZIP file
   - Submit to Mozilla Add-ons or use Firefox Developer Edition

### For Safari (macOS)

1. **Convert to Safari Extension**
   - Use Safari's `xcrun safari-web-extension-converter` tool
   - Or use third-party tools like Safari Extension Builder

2. **Enable in Safari**
   - Open Safari → Preferences → Extensions
   - Enable the LearnFirst extension

## 📖 How to Use

### Initial Setup

1. **Click the Extension Icon** in your browser toolbar
2. **Set Your Daily Goal** (default: 3 learning activities)
3. **Customize Tab Delay** if desired (default: 5 seconds)

### During Daily Use

1. **Start Browsing** - New tabs will load with a delay overlay
2. **Visit Learning Content** - Browse educational websites like:
   - Wikipedia, Stack Overflow, Medium
   - Coursera, Khan Academy, edX
   - GitHub, ArXiv, Research papers
   - Any article-heavy educational content

3. **Track Progress** - The extension automatically detects:
   - Time spent reading educational content (30+ seconds)
   - Visits to recognized learning domains
   - Manual activity marking via popup

4. **Reach Your Goals** - Once completed, throttling is disabled and you get full-speed browsing!

### Manual Activity Tracking

Use the popup interface to manually mark completed activities:
- 📖 **Mark Article Read** - For blog posts, articles, documentation
- 🎥 **Mark Video Watched** - For educational videos, tutorials
- 🎓 **Mark Course Progress** - For online courses, lessons

## 🎛️ Features & Settings

### Popup Interface

- **Progress Dashboard**: Visual progress bar and completion status
- **Quick Actions**: Manual activity marking buttons
- **Settings Panel**: Adjust goals and delay timing
- **Learning Sites**: Quick access to recommended educational resources
- **Statistics**: View your learning streaks and averages

### Smart Detection

The extension recognizes learning content through:

- **Domain Recognition**: Built-in list of educational websites
- **Content Analysis**: Article structure, educational keywords
- **Reading Time**: Tracks mouse movement, scrolling, and page focus
- **User Confirmation**: Manual marking for edge cases

### Customization Options

- **Daily Goal**: Set between 1-20 learning activities per day
- **Tab Delay**: Customize from 1-30 seconds
- **Learning Sites**: Add your own educational domains
- **Reset Options**: Daily progress reset, streak tracking

## 🛠️ Technical Details

### Browser Compatibility

- ✅ **Chrome** (Manifest V3)
- ✅ **Firefox** (Manifest V2 with WebExtensions)
- ✅ **Edge** (Chromium-based)
- ⚠️ **Safari** (requires conversion)

### Permissions Required

- `storage` - Save goals and progress data
- `tabs` - Monitor tab creation and updates
- `activeTab` - Interact with current webpage
- `background` - Run background processes
- `<all_urls>` - Detect learning content across all sites

### How Throttling Works

1. **Tab Creation Detection**: Listens for new tab events
2. **Overlay Injection**: Adds countdown overlay to new tabs
3. **Content Script**: Monitors page content and reading behavior
4. **Background Processing**: Tracks goals and manages throttling state
5. **Real-time Updates**: Immediately disables throttling when goals are met

## 📊 Supported Learning Sites

The extension automatically recognizes these educational domains:

- **General Knowledge**: Wikipedia, Wikibooks
- **Programming**: Stack Overflow, GitHub, Dev.to
- **Online Courses**: Coursera, edX, Khan Academy
- **Publications**: Medium, ArXiv, ResearchGate
- **Academic**: Google Scholar, Nature, ScienceDirect
- **News/Discussion**: Hacker News, Educational subreddits

*You can manually mark activities on any other educational content!*

## 🔧 Troubleshooting

### Common Issues

**Extension not working:**
- Check that you're using the correct manifest for your browser
- Ensure developer mode is enabled
- Try reloading the extension

**Throttling not activating:**
- Check your daily goal settings
- Verify the extension has necessary permissions
- Look for error messages in browser console

**Learning content not detected:**
- Manually mark activities using the popup
- Check if the site is in the recognized domains list
- Ensure you're spending enough time reading (30+ seconds)

### Reset Options

- **Daily Reset**: Happens automatically at midnight
- **Manual Reset**: Use "Reset Today's Progress" in popup
- **Full Reset**: Remove and reinstall the extension

## 🚧 Development & Contributions

### Project Structure
```
TeliviTejam/
├── manifest.json          # Chrome/Edge manifest
├── manifest_firefox.json  # Firefox manifest
├── background.js          # Chrome background service worker
├── background_firefox.js  # Firefox background script
├── content.js            # Content script (all browsers)
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icons/                # Extension icons
└── README.md             # This file
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across browsers
5. Submit a pull request

### Future Enhancements

- [ ] Safari native support
- [ ] Advanced statistics dashboard  
- [ ] Custom learning domain management
- [ ] Learning streaks and achievements
- [ ] Social sharing of progress
- [ ] Integration with learning platforms APIs
- [ ] Machine learning for better content detection

## 📄 License

This project is open source. Feel free to use, modify, and distribute according to your needs.

## 🤝 Support

Having issues or suggestions?

1. **Check the troubleshooting section** above
2. **Review browser-specific installation steps**
3. **Open an issue** with details about your browser and problem
4. **Join the discussion** about new features and improvements

---

**Made with ❤️ for lifelong learners everywhere!**

*Remember: The goal isn't to make the internet frustrating, but to create positive habits that make learning as addictive as social media.*
