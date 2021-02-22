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

  useEffect(()=>{
    // console.log(iframe, gotContents);
  }, [gotContents, url]);

  return (
    <div className='about_page_container'>
      <div id='markdown'></div>
    </div>
  );
}