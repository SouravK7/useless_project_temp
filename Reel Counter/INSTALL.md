# Instagram Reels Counter - Installation Guide

## Quick Start

This Chrome extension tracks how many Instagram reels you scroll through in real-time with a beautiful floating counter.

## Step 1: Generate Icons

1. **Open the Icon Converter**:
   ```bash
   open svg-to-png-converter.html
   ```

2. **Convert Icons**:
   - Click "Convert SVGs to PNG" button
   - Download or save each PNG file as:
     - `icon16.png`
     - `icon48.png` 
     - `icon128.png`

## Step 2: Install Extension

1. **Open Chrome Extensions**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

2. **Load Extension**:
   - Click "Load unpacked"
   - Select the `instagram-reels-counter` folder
   - Extension should now appear in your list

3. **Pin Extension** (Optional):
   - Click puzzle piece icon in Chrome toolbar
   - Find "Instagram Reels Counter" and pin it

## Step 3: Use the Extension

1. **Go to Instagram**:
   - Open [instagram.com](https://instagram.com)
   - Log in to your account

2. **Navigate to Reels**:
   - Go to any reel (`instagram.com/reel/...`)
   - Counter will automatically appear in top-right corner

3. **Start Scrolling**:
   - Counter increments as you view new reels
   - Shows total count and session time
   - Has Reset and Hide buttons

## Features

- 🎬 **Live Counter**: Real-time tracking as you scroll
- ⏱️ **Session Tracking**: Time and reels per hour stats
- 💾 **Persistent Storage**: Saves count between sessions
- 🎨 **Beautiful UI**: Modern gradient design with animations
- 🎛️ **Easy Controls**: Reset, hide/show, detailed popup stats

## Files Overview

```
instagram-reels-counter/
├── manifest.json          # Extension configuration
├── content.js            # Main tracking logic
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality  
├── styles.css            # Counter display styles
├── svg-to-png-converter.html  # Icon conversion tool
└── README.md            # Detailed documentation
```

## Troubleshooting

### Extension Won't Load
- Make sure all files are in the same folder
- Check that icons (PNG files) exist
- Verify Developer mode is enabled

### Counter Not Appearing  
- Make sure you're on `instagram.com`
- Navigate to a reel page (URL contains `/reel/`)
- Refresh the page if needed
- Check browser console for errors

### Icons Not Working
- Use the `svg-to-png-converter.html` tool
- Make sure PNG files are named exactly: `icon16.png`, `icon48.png`, `icon128.png`
- Icons must be in the same folder as `manifest.json`

### Count Not Saving
- Extension needs storage permissions (already configured)
- Don't use incognito mode
- Make sure extension is enabled

## Development

To modify the extension:

1. **Edit Files**: Make changes to JS/CSS/HTML files
2. **Reload Extension**: Go to `chrome://extensions/` and click reload button
3. **Refresh Instagram**: Reload Instagram page to see changes

## Privacy & Security

✅ **Safe & Private**:
- Only runs on Instagram.com
- Stores data locally in your browser
- No external servers or data sharing
- Only tracks public URL changes
- No access to your Instagram account

## Need Help?

1. Check the detailed `README.md` file
2. Look at browser console for error messages
3. Try disabling and re-enabling the extension
4. Make sure you're using the latest Chrome version

Enjoy tracking your reel scrolling habits! 🎬✨
