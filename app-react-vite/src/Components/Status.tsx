import { useEffect, useRef, useState } from 'react';

let url = `/api/status`;

const cloudEnv = import.meta.env.VITE_CLOUD_ENV;
const backendEnv = import.meta.env.VITE_BACKEND_URI;
// const cloudEnv = 'production';
// const backendEnv = 'https://func-hide-first-swa-with-api-sbx.azurewebsites.net/';
// const backendEnv = '';

console.log(`xCLOUD_ENV = ${cloudEnv}`)
console.log(`xBACKEND_URI = ${backendEnv}`)

if (cloudEnv.toLowerCase()=='production') {
  // if (backendEnv) {
  url = `${backendEnv}${url}`
  // } else {
  //   throw Error(`Missing backendEnv`)
  // }
}

console.log(`URL = ${url}`)


function Status({ user }:any) {

    const [envvars, setEnvVars] = useState([]);
    const mountFlag = useRef(false)

    useEffect(() => {
        const fetchData = async () => {
            if (user?.userDetails) {
                mountFlag.current = true;
                const data = await fetch(url);
                const json = await data.json();
                setEnvVars(json);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
            <p>Hi {user?.userDetails.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')}</p>
            {JSON.stringify(envvars)}
            </header>
        </div>
    );
}
export default Status;