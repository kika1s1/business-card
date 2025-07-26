// Clear authentication state for testing
console.log('Clearing authentication state...');

// Clear localStorage
localStorage.removeItem('auth-token');
localStorage.removeItem('auth-store');

// Clear sessionStorage
sessionStorage.removeItem('auth-token');
sessionStorage.removeItem('auth-store');

// Clear any Zustand persisted state
const zustandKeys = Object.keys(localStorage).filter(key => key.includes('auth') || key.includes('store'));
zustandKeys.forEach(key => {
  localStorage.removeItem(key);
  console.log('Removed:', key);
});

console.log('✅ Authentication state cleared!');
console.log('🔄 Please refresh the page to see login/register forms.'); 