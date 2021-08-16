self.addEventListener('push', e => {
  const title = 'Push Codelab';
  const options = {
    body: e.data.text(),
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };
  self.registration.showNotification(title, options);
});