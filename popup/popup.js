const DEFAULTS = {
  sidebarWidth: '15vw',
  maxDisplayLength: 200,
  smoothScroll: true,
};

const widthInput = document.getElementById('sidebarWidth');
const lengthInput = document.getElementById('maxDisplayLength');
const smoothInput = document.getElementById('smoothScroll');
const saveBtn = document.getElementById('save');
const savedMsg = document.getElementById('saved');

chrome.storage.sync.get(DEFAULTS, (settings) => {
  widthInput.value = settings.sidebarWidth;
  lengthInput.value = settings.maxDisplayLength;
  smoothInput.checked = settings.smoothScroll;
});

saveBtn.addEventListener('click', () => {
  const settings = {
    sidebarWidth: widthInput.value.trim() || DEFAULTS.sidebarWidth,
    maxDisplayLength: parseInt(lengthInput.value, 10) || DEFAULTS.maxDisplayLength,
    smoothScroll: smoothInput.checked,
  };
  chrome.storage.sync.set(settings, () => {
    savedMsg.style.display = 'block';
    setTimeout(() => { savedMsg.style.display = 'none'; }, 1500);
  });
});
