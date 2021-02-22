import React, { useEffect, useState } from 'react';
import Iframe from 'react-iframe'
import ReactMarkdown from 'react-markdown'
import { render } from 'react-dom'


import './About.css';


export function About() {
  const url = 'https://api.github.com/repos/suasllc/dronest/contents/README.md';

  let [gotContents, setGetContents] = useState(false)
  const fetchGit = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      const res2 = await res.json()
      const markdown = new Buffer.from(res2.content, 'base64').toString('ascii')
      setGetContents(true);
      render(<ReactMarkdown children={markdown}></ReactMarkdown>, document.getElementById('markdown'));
    }
  }

  useEffect(() => {
    fetchGit(url);
    // if(iframe)
    //   console.log('iframe', iframe.innerHTML);    
  }, [url]);

  useEffect(() => {
    // console.log(iframe, gotContents);
  }, [gotContents, url]);

  return (
    <div className='about_page_container'>
      <img src={'https://image.flaticon.com/icons/png/512/25/25231.png'} className='technology-icon' />
      <div>
        <div>
          Package
        </div>
        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1280px-Npm-logo.svg.png' className='technology-icon' />
        <img src='https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png' className='technology-icon' />
        <img src='https://cdn.iconscout.com/icon/free/png-512/postgresql-11-1175122.png' className='technology-icon' />
        <img src='https://cdn.worldvectorlogo.com/logos/heroku.svg' className='technology-icon' />
        <div>
          Frontend
        </div>
        <img src={require('../../pictures/javascript.svg')} className='technology-icon' />
        <img src={require('../../pictures/iconfinder_React.js_logo_1174949.svg')} className='technology-icon' />
        <img src={require('../../pictures/iconfinder_redux_4691205.svg')} className='technology-icon' />
        <img src={require('../../pictures/css.svg')} className='technology-icon' />
        <img src={require('../../pictures/html5.png')} className='technology-icon' />
      </div>
      <div>
        <div>
          Backend
        </div>
        <div>
          Main Server
        </div>
        <img src={require('../../pictures/python.png')} className='technology-icon' />
        <img src={'https://miro.medium.com/max/800/1*Q5EUk28Xc3iCDoMSkrd1_w.png'} className='technology-icon' />
        <img src={'https://flask-sqlalchemy.palletsprojects.com/en/2.x/_static/flask-sqlalchemy-logo.png'} className='technology-icon' />
        <div>
          Instant Messaging Server
        </div>
        <img src={require('../../pictures/nodejs.svg')} className='technology-icon' />
        <img src={'https://www.logolynx.com/images/logolynx/5b/5bf98b408fb57fec23637f44edd79138.jpeg'} className='technology-icon' />
      </div>
      <div id='markdown'></div>
    </div>
  );
}