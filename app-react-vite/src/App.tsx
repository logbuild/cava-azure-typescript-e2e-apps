import { useState, useEffect, useRef } from 'react';
import NavBar from './Components/NavBar';
import Status from './Components/Status';
import './App.css';

let url = `/api/todo`;

const cloudEnv = import.meta.env.VITE_CLOUD_ENV;
const backendEnv = import.meta.env.VITE_BACKEND_URI;
// なぜか値がとれないので、一旦固定値を設定　←　ここを調査するのが重要かと
// const cloudEnv = 'production';
// const backendEnv = 'https://func-hide-first-swa-with-api-sbx.azurewebsites.net/';
// const backendEnv = '';

console.log(`xxCLOUD_ENV = ${cloudEnv}`)
console.log(`xxBACKEND_URI = ${backendEnv}`)
console.log(`xxMODE = ${import.meta.env.MODE}`)
console.log(`xxBASE_URL = ${import.meta.env.BASE_URL}`)
console.log(`xxPROD = ${import.meta.env.PROD}`)

if (cloudEnv.toLowerCase()=='production') {
  // if (backendEnv) {
  url = `${backendEnv}${url}`
  // } else {
  //   throw Error(`Missing backendEnv`)
  // }
}

console.log(`URL = ${url}`)

function App() {

  // auth
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const mountFlagAuth = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!mountFlagAuth.current) {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;

        if (clientPrincipal) {
          setUser(clientPrincipal);
          userHasAuthenticated(true);
          setUserName(clientPrincipal?.userDetails.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.slice(1)).join(' '))
          console.log(`clientPrincipal = ${JSON.stringify(clientPrincipal)}`);
        }
      }
    }

    fetchData();
  }, []);

  // data
  const [todos, setTodos] = useState({});
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const mountFlagData = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!mountFlagData.current) {
        mountFlagData.current = true;
        console.log(url)

        const data = await fetch(url);
        const json = await data.json();
        setTodos(json);
      }
    }

    fetchData();
  }, []);

  const sendDataToApi = async (e: any) => {
    e.preventDefault();

    const config = {
      method: "POST",
      headers: { "Content-Test": "application/json" },
      body: JSON.stringify({ title })
    };
    const data = await fetch(url, config);
    const returnedName = await data.text();

    if (returnedName) {
      setMessage(returnedName);
    } else {
      setMessage(`Couldn't send data`);
    }

    const userResponse = await fetch(url, { method: "GET" });
    const dataReturned = await userResponse.json();

    if (dataReturned) {
      setTitle('')
      setTodos(dataReturned);
    }
  };

  return (
    <div className="App">
      <NavBar user={user} />
      <header className="App-header">
        <form id="form1" className="App-form" onSubmit={e => sendDataToApi(e)}>
          <div>
            <input
              type="text"
              id="name"
              className="App-input"
              placeholder="Enter todo to add"
              value={title}
              onChange={e => setTitle(e.target.value)} />
            <button type="submit" className="App-button">Submit</button>
          </div>
        </form>
        <div><h5>Todo added: {message} </h5></div>

        <details>
          <summary>Public data</summary>
          <p><h5><pre>{JSON.stringify(todos, null, 2)}</pre></h5></p>
        </details>

        {isAuthenticated ?
          <div>
            <details>
              <summary>Private data - just for {userName}</summary>
              <p>
                <h5>Auth: {isAuthenticated}</h5>
                <p><Status user={user} /></p>
              </p>
            </details>
            <p>{JSON.stringify(user)}</p>
          </div>
          : <div>Sign in for private data access</div>
        }


      </header>
    </div>
  );
}

export default App;
