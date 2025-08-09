// Popup script for Instagram Reels Counter
document.addEventListener('DOMContentLoaded', function() {
    const totalCountElement = document.getElementById('total-count');
    const sessionTimeElement = document.getElementById('session-time');
    const averagePerHourElement = document.getElementById('average-per-hour');
    const statusElement = document.getElementById('status');
    const statusTextElement = document.getElementById('status-text');
    const toggleDisplayBtn = document.getElementById('toggle-display');
    const resetAllBtn = document.getElementById('reset-all');

    // Load and display current stats
    function loadStats() {
        chrome.storage.local.get(['reelsCount', 'startTime'], function(result) {
            const reelsCount = result.reelsCount || 0;
            const startTime = result.startTime || Date.now();
            const sessionDuration = Date.now() - startTime;

            // Update display
            totalCountElement.textContent = reelsCount;
            sessionTimeElement.textContent = formatTime(sessionDuration);
            
            // Calculate average per hour
            const hoursElapsed = sessionDuration / (1000 * 60 * 60);
            const averagePerHour = hoursElapsed > 0 ? Math.round(reelsCount / hoursElapsed) : 0;
            averagePerHourElement.textContent = averagePerHour;
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

    // Check if we're on Instagram
    function checkInstagramStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            
            if (currentTab && currentTab.url && currentTab.url.includes('instagram.com')) {
                const isReelsPage = currentTab.url.includes('/reels/') || currentTab.url.includes('/reel/');
                
                if (isReelsPage) {
                    statusElement.className = 'status active';
                    statusTextElement.textContent = '🟢 Active - Tracking reels';
                } else {
                    statusElement.className = 'status inactive';
                    statusTextElement.textContent = '🟡 On Instagram - Go to reels to start tracking';
                }
            } else {
                statusElement.className = 'status inactive';
                statusTextElement.textContent = '🔴 Not on Instagram - Open Instagram to start tracking';
            }
        });
    }

    // Toggle display visibility
    toggleDisplayBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes('instagram.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleDisplay'});
                window.close();
            } else {
                alert('Please go to Instagram first to use this feature.');
            }
        });
    });

    // Reset all data
    resetAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            chrome.storage.local.clear(function() {
                chrome.storage.local.set({
                    reelsCount: 0,
                    startTime: Date.now()
                }, function() {
                    loadStats();
                    
                    // Also reset display on current Instagram tab
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        if (tabs[0] && tabs[0].url && tabs[0].url.includes('instagram.com')) {
                            chrome.tabs.sendMessage(tabs[0].id, {action: 'resetCounter'});
                        }
                    });
                });
            });
        }
    });

    // Initialize
    loadStats();
    checkInstagramStatus();
    
    // Refresh stats every second
    setInterval(loadStats, 1000);
    
    // Check status every 2 seconds
    setInterval(checkInstagramStatus, 2000);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateStats') {
        // Stats updated, refresh display
        setTimeout(() => {
            if (document.getElementById('total-count')) {
                loadStats();
            }
        }, 100);
    }
});
