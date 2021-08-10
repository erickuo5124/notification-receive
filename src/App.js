import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import webpush from 'web-push'

function App() {
  const [status, setStatus] = useState('');
  async function subscribe() {
    if (!('serviceWorker' in navigator)) {
      setStatus('no service worker!')
      return
    }
    const vapidKeys = webpush.generateVAPIDKeys()
    console.log(vapidKeys)
    let sw = await navigator.serviceWorker.ready;
    await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKeys.publicKey
    }).then(res => {
      const serverData = JSON.stringify(res)
      console.log(serverData);
      sendData({
        endpoint: serverData.endpoint,
        p256dh: serverData.keys.p256dh,
        auth: serverData.keys.auth,
        private_key: vapidKeys.privateKey
      })
    })
      .catch(err => console.log(err))

  }
  const sendData = async (data) => {
    await fetch(`${process.env.REACT_APP_MAIN_HOST}/add`,
      {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    ).then(res => console.log(res))
      .catch(err => console.log(err))
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={subscribe}>subscribe</button>
        <p
          className="App-link"
        >
          {status}
        </p>
      </header>
    </div>
  );
}

export default App;
