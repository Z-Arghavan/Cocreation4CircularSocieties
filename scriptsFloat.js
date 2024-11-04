// scripts.js
document.querySelectorAll('.floating-element').forEach(element => {
    const speed = Math.random() * 3 + 3; // Faster range
    const translateX = Math.random() * 20 - 10; // random x-axis movement
    const translateY = Math.random() * 20 - 10; // random y-axis movement
  
    // Apply animation to each element
    element.style.animationDuration = `${speed}s`;
    element.style.animationDirection = Math.random() > 0.5 ? 'alternate-reverse' : 'alternate';
  });
  