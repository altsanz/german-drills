if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/german-drills/sw.js', { scope: '/german-drills/' })})}