<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# Reels Counter🎬


## Basic Details
### Team Name: Phantom Oreo🚀


### Team Members
- Team Lead: Pranav Pradeep - College of Engineering,Thalassery
- Member 2: Sourav K - College of Engineering Thalassery

### Project Description
This project tracks the number of instagram reels or short videos a user watches within an application and displays a subtle notification when a certain number of videos is reached. The goal is to encourage users to take breaks and maintain healthy screen time habits.

### The Problem (that doesn't exist)
We all know how easy it is to “just watch one more” and suddenly an hour’s gone. Most people don’t even realize how much time they spend scrolling, and there’s usually nothing to remind them to stop.

### The Solution (that nobody asked for)
This app quietly counts your reels in the background and, when you’ve hit a set milestone, pops up a message suggesting you put the phone down for a bit. It’s a small reminder to help you not go overboard with a little bit of sarcasm.

## Technical Details
### Technologies/Components Used
For Software:
- Languages used: JavaScript, HTML, CSS, Python (for icon generation script)
- Frameworks used: None (uses native WebExtension/Chrome Extension APIs)
- Libraries used: None external — only built-in browser APIs (storage, activeTab)
- Tools used: VS Code , Warp AI (built-in AI coding assistant) , Command-line interface (CLI) , Git (for version control)


For Hardware:
- Main components: Desktop/laptop with a modern browser
- Specifications: Supports Chrome, Edge, Brave, or any Chromium browser with Extension Manifest V3 support
- Tools required: Internet connection for Instagram access

### Implementation
For Software:
- Manifest Configuration: Defines permissions (activeTab, storage) and sets up the extension to run on instagram.com.
- Content Script (content.js): Injected into Instagram to detect reel scrolling and update the counter.
- Storage API: Saves and retrieves the current reel count.
- Popup UI (popup.html, popup.js): Displays the counter and allows interaction from the extension icon.
- CSS Styling (styles.css): Styles the popup interface.
- Icons: Provided in PNG and SVG formats, with a Python script (create-icons.py) to generate them.
  
# Installation
[commands]

# Run
Once installed:  
1. Open Instagram in your browser.  
2. Start watching reels.  
3. The extension will track the number of reels scrolled and display it in the popup UI.  


### Project Documentation
For Software:
- manifest.json → Defines extension metadata, permissions, icons, and popup.
- content.js → Main logic for detecting reel scroll events and updating the counter.
- popup.html / popup.js → User interface displayed when the extension icon is clicked.
- styles.css → Styles for popup elements.
- create-icons.py → Optional helper script for generating icon sizes.
- INSTALL.md → Step-by-step installation instructions.
- TESTING.md → Testing process and verification steps.

# Screenshots (Add at least 3)
![Screenshot1](Add screenshot 1 here with proper name)
*Add caption explaining what this shows*

![Screenshot2](Add screenshot 2 here with proper name)
*Add caption explaining what this shows*

![Screenshot3](Add screenshot 3 here with proper name)
*Add caption explaining what this shows*

# Diagrams
![Workflow](Add your workflow/architecture diagram here)
*Add caption explaining your workflow*

For Hardware:

# Schematic & Circuit
![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

# Build Photos
![Components](Add photo of your components here)
*List out all components shown*

![Build](Add photos of build process here)
*Explain the build steps*

![Final](Add photo of final product here)
*Explain the final build*

### Project Demo
# Video
[Add your demo video link here]
*Explain what the video demonstrates*

# Additional Demos
[Add any extra demo materials/links]

## Team Contributions
- [Name 1]: [Specific contributions]
- [Name 2]: [Specific contributions]
- [Name 3]: [Specific contributions]

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)



