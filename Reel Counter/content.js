// Instagram Reels Counter - Content Script
(function() {
    let reelsCount = 0;
    let isOnReelsPage = false;
    let observer = null;
    let currentReelId = null;
    let counterElement = null;
    let startTime = Date.now();

    // Load saved count from storage
    chrome.storage.local.get(['reelsCount', 'startTime'], function(result) {
        reelsCount = result.reelsCount || 0;
        startTime = result.startTime || Date.now();
        updateCounterDisplay();
    });

    // Check if we're on Instagram Reels page
    function checkIfReelsPage() {
        const url = window.location.href;
        const newIsOnReelsPage = url.includes('/reels/') || url.includes('/reel/');
        
        if (newIsOnReelsPage !== isOnReelsPage) {
            isOnReelsPage = newIsOnReelsPage;
            
            if (isOnReelsPage) {
                console.log('Instagram Reels Counter: Now on reels page');
                createCounterDisplay();
                startTracking();
            } else {
                console.log('Instagram Reels Counter: Left reels page');
                stopTracking();
                removeCounterDisplay();
            }
        }
    }

    // Create floating counter display
    function createCounterDisplay() {
        if (counterElement) return;

        counterElement = document.createElement('div');
        counterElement.id = 'reels-counter-display';
        counterElement.innerHTML = `
            <div class="counter-content">
                <div class="counter-title">Reels Scrolled</div>
                <div class="counter-number">${formatNumber(reelsCount)}</div>
                <div class="counter-time">Session: ${formatTime(Date.now() - startTime)}</div>
                <div class="counter-controls">
                    <button id="reset-counter">Reset</button>
                    <button id="toggle-counter">Hide</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(counterElement);

        // Add event listeners
        document.getElementById('reset-counter').addEventListener('click', resetCounter);
        document.getElementById('toggle-counter').addEventListener('click', toggleCounter);
    }

    // Remove counter display
    function removeCounterDisplay() {
        if (counterElement) {
            counterElement.remove();
            counterElement = null;
        }
    }

    // Update counter display
    function updateCounterDisplay(animate = false) {
        if (counterElement) {
            const numberElement = counterElement.querySelector('.counter-number');
            const timeElement = counterElement.querySelector('.counter-time');
            
            if (numberElement) {
                // Format number for better readability
                numberElement.textContent = formatNumber(reelsCount);
                
                // Add animation when counter increments
                if (animate) {
                    numberElement.classList.add('increment');
                    
                    // Check for milestone messages
                    const message = getMilestoneMessage(reelsCount);
                    if (message) {
                        showMilestoneMessage(message);
                    }
                    
                    setTimeout(() => {
                        numberElement.classList.remove('increment');
                    }, 600);
                }
            }
            
            if (timeElement) timeElement.textContent = `Session: ${formatTime(Date.now() - startTime)}`;
        }
        
        // Save to storage
        chrome.storage.local.set({
            reelsCount: reelsCount,
            startTime: startTime
        });
    }

    // Format time duration
    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Reset counter
    function resetCounter() {
        reelsCount = 0;
        startTime = Date.now();
        updateCounterDisplay();
    }

    // Toggle counter visibility
    function toggleCounter() {
        if (counterElement) {
            const isHidden = counterElement.style.display === 'none';
            counterElement.style.display = isHidden ? 'block' : 'none';
            
            const toggleBtn = document.getElementById('toggle-counter');
            if (toggleBtn) {
                toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
            }
        }
    }

    // Scroll handler variable
    let scrollHandler = null;

    // Start tracking reels
    function startTracking() {
        if (observer) return;

        // Track URL changes for reels navigation
        let lastUrl = window.location.href;
        let lastReelElement = null;
        let viewedReels = new Set(); // Track viewed reels to prevent duplicates
        
        // Initialize first reel if we're already on one
        setTimeout(() => {
            const initialReelId = getCurrentReelId();
            if (initialReelId && !viewedReels.has(initialReelId)) {
                currentReelId = initialReelId;
                viewedReels.add(initialReelId);
                reelsCount++;
                updateCounterDisplay();
                console.log(`Instagram Reels Counter: Initial reel detected! Total: ${reelsCount}`);
            }
        }, 1000);
        
        // Watch for DOM changes to detect new reels
        observer = new MutationObserver(function(mutations) {
            const currentUrl = window.location.href;
            
            // Method 1: Check URL changes
            if (currentUrl !== lastUrl && currentUrl.includes('/reel/')) {
                const reelId = currentUrl.match(/\/reel\/([^/?]+)/)?.[1];
                
                if (reelId && !viewedReels.has(reelId)) {
                    currentReelId = reelId;
                    viewedReels.add(reelId);
                    reelsCount++;
                    updateCounterDisplay(true);
                    console.log(`Instagram Reels Counter: New reel via URL! Total: ${reelsCount}`);
                }
                
                lastUrl = currentUrl;
            }
            
            // Method 2: Check for reel elements in viewport (for scroll detection)
            const currentReelElement = getCurrentReelElement();
            if (currentReelElement && currentReelElement !== lastReelElement) {
                const reelId = extractReelIdFromElement(currentReelElement);
                
                if (reelId && !viewedReels.has(reelId)) {
                    currentReelId = reelId;
                    viewedReels.add(reelId);
                    reelsCount++;
                    updateCounterDisplay(true);
                    console.log(`Instagram Reels Counter: New reel via scroll! Total: ${reelsCount}`);
                }
                
                lastReelElement = currentReelElement;
            }
            
            // Method 3: Check for video elements that indicate new reels
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
                            videos.forEach(video => {
                                const reelId = findReelIdFromVideoElement(video);
                                if (reelId && !viewedReels.has(reelId)) {
                                    currentReelId = reelId;
                                    viewedReels.add(reelId);
                                    reelsCount++;
                                    updateCounterDisplay(true);
                                    console.log(`Instagram Reels Counter: New reel via video! Total: ${reelsCount}`);
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // Method 4: Listen for scroll events on reels container
        scrollHandler = debounce(() => {
            const currentReelId = getCurrentReelId();
            if (currentReelId && !viewedReels.has(currentReelId)) {
                viewedReels.add(currentReelId);
                reelsCount++;
                updateCounterDisplay(true);
                console.log(`Instagram Reels Counter: New reel via scroll event! Total: ${reelsCount}`);
            }
        }, 300);
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        document.addEventListener('scroll', scrollHandler, { passive: true });

        // Also listen for popstate events (browser navigation)
        window.addEventListener('popstate', function() {
            setTimeout(() => {
                checkIfReelsPage();
            }, 100);
        });

        console.log('Instagram Reels Counter: Started enhanced tracking');
    }

    // Helper function to get current reel ID from URL
    function getCurrentReelId() {
        const url = window.location.href;
        const match = url.match(/\/reel\/([^/?]+)/);
        return match ? match[1] : null;
    }

    // Helper function to get the currently visible reel element
    function getCurrentReelElement() {
        // Look for video elements that are in the viewport
        const videos = document.querySelectorAll('video');
        for (let video of videos) {
            if (isElementInViewport(video)) {
                return video.closest('article') || video.closest('[role="presentation"]') || video.parentElement;
            }
        }
        
        // Fallback: look for Instagram's reel container patterns
        const reelSelectors = [
            'article[role="presentation"]',
            '[data-testid="reel"]',
            'div[style*="transform"]', // Instagram often uses transforms for reel positioning
            'section > div > div > div > div' // Common Instagram structure
        ];
        
        for (let selector of reelSelectors) {
            const elements = document.querySelectorAll(selector);
            for (let element of elements) {
                if (isElementInViewport(element) && element.querySelector('video')) {
                    return element;
                }
            }
        }
        
        return null;
    }

    // Helper function to extract reel ID from an element
    function extractReelIdFromElement(element) {
        if (!element) return null;
        
        // Look for data attributes that might contain reel ID
        const possibleIds = [
            element.getAttribute('data-reel-id'),
            element.getAttribute('data-media-id'),
            element.getAttribute('id')
        ];
        
        for (let id of possibleIds) {
            if (id) return id;
        }
        
        // Look for reel ID in nested elements
        const links = element.querySelectorAll('a[href*="/reel/"]');
        for (let link of links) {
            const match = link.href.match(/\/reel\/([^/?]+)/);
            if (match) return match[1];
        }
        
        // Fallback: use element's position or video source as identifier
        const video = element.querySelector('video');
        if (video && video.src) {
            return video.src.split('/').pop().split('?')[0];
        }
        
        return null;
    }

    // Helper function to find reel ID from video element
    function findReelIdFromVideoElement(video) {
        if (!video) return null;
        
        // Check video src for identifiers
        if (video.src) {
            const srcParts = video.src.split('/');
            const filename = srcParts.pop().split('?')[0];
            if (filename && filename.length > 5) {
                return filename;
            }
        }
        
        // Check parent elements for reel ID
        let parent = video.parentElement;
        while (parent && parent !== document.body) {
            const reelId = extractReelIdFromElement(parent);
            if (reelId) return reelId;
            parent = parent.parentElement;
        }
        
        return null;
    }

    // Helper function to check if element is in viewport
    function isElementInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        // Element is considered visible if it's at least 50% in viewport
        const verticalInView = (rect.top <= windowHeight * 0.5) && (rect.bottom >= windowHeight * 0.5);
        const horizontalInView = (rect.left <= windowWidth * 0.5) && (rect.right >= windowWidth * 0.5);
        
        return verticalInView && horizontalInView;
    }

    // Format number for better readability
    function formatNumber(num) {
        // Always return a clear, visible number
        if (num < 1000) {
            return num.toString();
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else {
            return (num / 1000).toFixed(1) + 'K';
        }
    }

    // Get milestone message for every 20 reels
    function getMilestoneMessage(count) {
        // Show message every 20 reels
        if (count % 20 !== 0) {
            return null;
        }

        const memeMessages = [
            {
                title: "🎬 20 Reels Down!",
                message: "POV: You came here to watch 'just one reel' 💀"
            },
            {
                title: "🚀 Another 20!",
                message: "Still here? Bro scrolling like it’s a side hustle 💀📱"
            },
            {
                title: "60 Reels😵🔥",
                message: "Touch some grass lil bro 😭🥀"
            },
            {
                title: "80 Reels Down🥀",
                message: "Even your ancestors disappointed rn🪦📱"
            },
            {
                title: "⚡ Unstoppable!",
                message: "Bro’s thumb got more steps than his legs 😭🙏"
            },
            {
                title: "Doomscroller 😭🙏",
                message: "At this point, just marry the phone bro🥀💍📱"
            },
            {
                title: "🌪️ In The Zone!",
                message: "Houston, we have a problem... and that problem is called 'addiction to 15-second videos' 🧑‍🚀"
            },
            {
                title: "🎨 Content Consumer!",
                message: "You've basically seen the entire TikTok algorithm at this point 🤯"
            },
            {
                title: "🚂 Reel Train!",
                message: "Choo choo! All aboard the endless scroll express! Next stop: Nowhere! 🎫"
            },
            {
                title: "🏃‍♂️ Still Going?",
                message: "Your battery is crying, your eyes are tired, but your finger keeps scrolling 🔋😴"
            },
            {
                title: "🎭 Drama Queen!",
                message: "You've seen more drama in the last hour than Netflix has in a season 🍿"
            },
            {
                title: "🌟 Influencer Level!",
                message: "Plot twist: You're not watching influencers, you're studying them for science! 🔬"
            },
            {
                title: "🎪 Circus Master!",
                message: "Welcome to the circus of endless content! You're now the ringmaster! 🎩"
            },
            {
                title: "🧠 Brain Melted!",
                message: "Your brain: 'What day is it?' Your thumb: 'Scroll scroll scroll' 🧟‍♂️"
            },
            {
                title: "🏆 Legend Status!",
                message: "At this point, you've basically seen the entire internet. Time to become a monk? 🧘‍♂️"
            }
        ];

        // Calculate which message to show based on how many 20s we've hit
        const messageIndex = Math.floor(count / 20) - 1;
        const selectedMessage = memeMessages[messageIndex % memeMessages.length];
        
        // Add the count to the title
        return {
            title: `${selectedMessage.title} (${count} Reels!)`,
            message: selectedMessage.message
        };
    }

    // Show milestone message as popup
    function showMilestoneMessage(milestone) {
        // Create milestone popup
        const popup = document.createElement('div');
        popup.id = 'milestone-popup';
        popup.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-title">${milestone.title}</div>
                <div class="milestone-message">${milestone.message}</div>
                <div class="milestone-close">✨ Keep Scrolling! ✨</div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.style.animation = 'milestoneSlideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    popup.remove();
                }, 300);
            }
        }, 5000);
        
        // Click to dismiss
        popup.addEventListener('click', () => {
            popup.style.animation = 'milestoneSlideOut 0.3s ease-in forwards';
            setTimeout(() => {
                popup.remove();
            }, 300);
        });
    }

    // Debounce function to limit scroll event frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Stop tracking
    function stopTracking() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        
        // Remove scroll listeners
        window.removeEventListener('scroll', scrollHandler);
        document.removeEventListener('scroll', scrollHandler);
        
        console.log('Instagram Reels Counter: Stopped tracking');
    }

    // Initialize
    function init() {
        console.log('Instagram Reels Counter: Extension loaded');
        
        // Check initial page
        checkIfReelsPage();
        
        // Watch for navigation changes
        let lastUrl = window.location.href;
        new MutationObserver(() => {
            const url = window.location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    checkIfReelsPage();
                }, 500);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        stopTracking();
    });

})();
