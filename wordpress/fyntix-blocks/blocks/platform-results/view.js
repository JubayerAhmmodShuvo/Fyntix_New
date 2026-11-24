/**
 * Platform Results Block View Script - Interactive Tabs
 * All content server-rendered, JS only toggles visibility
 */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#section-post-results, .fyntix-platform-results');
  if (!section) return;
  
  // Find tab buttons and panels
  const tabList = section.querySelector('[role="tablist"]');
  if (!tabList) return;
  
  const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const panels = Array.from(section.querySelectorAll('[role="tabpanel"]'));
  
  if (tabs.length === 0 || panels.length === 0) return;
  
  let currentTab = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  if (currentTab === -1) currentTab = 0;
  
  function selectTab(index) {
    // Update tabs
    tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.tabIndex = isSelected ? 0 : -1;
      
      if (isSelected) {
        tab.classList.add('platform-tab--active');
        tab.classList.remove('platform-tab--inactive');
      } else {
        tab.classList.remove('platform-tab--active');
        tab.classList.add('platform-tab--inactive');
      }
    });
    
    // Update panels
    panels.forEach((panel, i) => {
      const isVisible = i === index;
      panel.hidden = !isVisible;
      panel.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
    });
    
    currentTab = index;
  }
  
  // Click handler
  tabList.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    
    const index = tabs.indexOf(tab);
    if (index !== -1) {
      selectTab(index);
    }
  });
  
  // Keyboard navigation
  tabList.addEventListener('keydown', (e) => {
    let newIndex = currentTab;
    
    if (e.key === 'ArrowLeft') {
      newIndex = currentTab > 0 ? currentTab - 1 : tabs.length - 1;
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      newIndex = currentTab < tabs.length - 1 ? currentTab + 1 : 0;
      e.preventDefault();
    } else if (e.key === 'Home') {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
      e.preventDefault();
    } else {
      return;
    }
    
    selectTab(newIndex);
    tabs[newIndex].focus();
  });
  
  // Initialize
  selectTab(currentTab);
});
