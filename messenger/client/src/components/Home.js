
import React, { useState } from 'react';

const ValidationErrors = ({ errors }) => {
  if (errors === null || errors.length === 0) {
    return null;
  }

  return (
    <div>
      <p>Please correct the following errors:</p>
      <ul>
        { errors.map(error => <li key={error}>{error}</li>) }
      </ul>
    </div>
  );
};

const Home = ({ updatePersonNameAndId }) => {
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState(undefined);
  const [errors, setErrors] = useState([]);

  const onChange = (e) => {
    setUserName(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const errorsToSet = [];

    if (!username) {
      errorsToSet.push('Please provide a name.');
    }

    if (errorsToSet.length > 0) {
      setErrors(errorsToSet);
      return;
    }

    updatePersonNameAndId(userId, username);
  };

  return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <h2>Welcome!</h2>
      <p>Please provide your name and 
        click the "Start MessageSession" button to start a messageSession.</p>
      <ValidationErrors errors={errors} />
      <form onSubmit={onSubmit}>
        <input type='number' value={userId}
          onChange={e=>{
            setUserId(Number(e.target.value)); console.log((Number(e.target.value)));
          }} 
          min={0}
          style={{width:'30px'}}
          />
        <input type='text' value={username}
          onChange={onChange} 
          placeholder="Name"
          />
        <button>Start MessageSession</button>
      </form>
    </div>
  );
}

export default Home;
