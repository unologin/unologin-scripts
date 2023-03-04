
Frontend SDK for interfacing with [unolog·in](https://unolog.in).

This README is a short overview. The full documentation can be found [here](https://unologin.github.io/web-sdk/).

Documentation for other [unolog·in](https://unolog.in) packages can be found [here](https://dashboard.unolog.in/docs).

## Installation

```
npm install @unologin/web-sdk
```

or

```
yarn add @unologin/web-sdk
```

## Typescript

This package includes built-in type declarations. There is no need to install any additional packages.

The below examples will use plain javascript for generality.

## Setup

Before using the library, make sure to connect the SDK with your app via your apps ```appId```.

```javascript
import unologin from '@unologin/web-sdk';

unologin.setup(
  { appId: process.env.UNOLOGIN_APPID }
);
```
## Initiating the login flow

Use the ```startLogin(...)``` function in order to initiate the login flow. 

```javascript
import unologin from '@unologin/web-sdk';
// or 
import { startLogin } from '@unologin/web-sdk';

/**
 * Typically, you would call startLogin in
 * the onClick handler of a button.
 * 
 * startLogin returns a promise that 
 * resolves as soon as the popup closes.
 * 
 * startLogin can therefore be awaited.
 */
unologin.startLogin(
  {
    /**
     * user class this 
     * login/registration belongs to 
     */
    userClass: 'users_default',
    /**
     * mode can be 'login' or 'register'
     * or omitted for auto-detect 
     */
    mode: 'register'
  }
)

```

## Handling the login event

```unologin.onLogin``` returns a ```Promise``` which can either be ```await```ed or used with ```.then```/```.catch```.  

```javascript
unologin.startLogin(...).then(() => 
{
  /** 
   * you can now make 
   * authenticated requests! 
   */
  alert('You are now logged in!');
}).catch((e) => 
{
  /* Check the error type. */
  if (e.type === 'ClosedByUser')
  {
    /**
     * Decide what happens if the user
     * quits the login flow.
     */
  }
  else 
  {
    alert('Something went wrong!');
  }
})
```

## Detecting a login cookie

You can use ```unologin.isLoggedIn()``` to check if a user is logged in at any time. This will check for the presence of a cookie that is set along side the actual login cookie. 

**IMPORTANT:** Do not use ```isLoggedIn()``` or *any* other client-side logic as a security measure. 

*Authentication should always be performed from your backend*.  
