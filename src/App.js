import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = 'http://localhost:3001';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = useState(storedJwt || null);
  const [foods, setFoods] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const getJwt = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/jwt`);
      setJwt(data.token);
    } catch (error) {
      console.log(error);
    }
  };

  const getFoods = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/foods`);
      setFoods(data);
      setFetchError(null);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  return (
    <>
      <section style={{ marginBottom: '10px' }}>
        <button onClick={() => getJwt()}>Get JWT</button>
        {jwt && (
          <pre>
            <code>{jwt}</code>
          </pre>
        )}
      </section>
      <section>
        <button onClick={() => getFoods()}>Get Foods</button>
        <ul>
          {foods.map((food, index) => (
            <li key={index}>{food.description}</li>
          ))}
        </ul>
        {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      </section>
    </>
  );
}

export default App;
