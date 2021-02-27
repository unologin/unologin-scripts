import React from 'react';

import {render} from 'react-dom';

import './style.scss';

/**  @return App entry point */
function App() : JSX.Element
{
  if (process.env.SAY_HELLO)
  {
    return <>Hello World</>;
  }
  else
  {
    return <>React + TypeScript</>;
  }
}

render(<App/>, document.getElementById('root'));
