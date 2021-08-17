import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('');
  const [VAPIDKey, setVAPIDKey] = useState('');
  const subscribe = async () => {
    if (!('serviceWorker' in navigator)) {
      setStatus('no service worker!')
      return
    }
    const sw = await navigator.serviceWorker.ready;
    // check current subscription info
    await sw.pushManager.getSubscription()
      .then(res => {
        if (res) {
          console.log('unsubscribe!')
          res.unsubscribe()
            .then(res => console.log(res))
            .catch(err => console.log(err))
        } else {
          console.log('subscribe!')
        }
      })
    getKey()
  }
  const getKey = async () => {
    // await fetch(`${process.env.REACT_APP_MAIN_HOST}/key`,
    await fetch(`http://localhost:5000/key`)
      .then(res => res.text()
        .then(res => setVAPIDKey(res))
      )
      .catch(err => console.log(err))
  }
  const getPushSubscription = async () => {
    const sw = await navigator.serviceWorker.ready;
    // generate subscription by VAPID key
    await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPIDKey
    }).then(res => {
      const subscription_info = res.toJSON();
      sendSubscriptionInfo(subscription_info);
    })
      .catch(err => console.log(err))
  }

  const sendSubscriptionInfo = async (data) => {
    await fetch(`http://localhost:5000/add`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => console.log(res))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setStatus('no service worker!')
      return
    } else if (!VAPIDKey) {
      return
    }
    getPushSubscription()
  }, [VAPIDKey])

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
