
# unologin-scripts 

Frontend SDK for interfacing with [unolog·in](https://unolog.in).

## Installation

```
npm install unologin-scripts
```

or

```
yarn add unologin-scripts
```

## Typescript

This package includes built-in type declarations. There is no need to install any additional packages.

The below examples will use plain javascript for generality.

## Setup

Before using the library, make sure to connect the SDK with your app via your apps ```appId```.

```javascript
import unologin from 'unologin-scripts';

unologin.setup(
  // either put your appId in here or your env
  { appId: process.env.UNOLOGIN_APPID }
);
```
## Initiating the login flow

Use the ```startLogin(...)``` function in order to initiate the login flow. 

```javascript
import unologin from 'unologin-scripts';
// alternatively: 
import { startLogin } from 'unologin-scripts';

// then call startLogin once the user clicks your login button

unologin.startLogin(
  {
    // user class this login/registration belongs to
    userClass: 'users_default',
    // 'login' or 'register' or undefined for auto-detect
    mode: 'register'
  }
)

```

## Handling the login event

You can pass a function to ```unologin.onLogin(...)``` to be called once the login/registration procedure has finished successfully. 

```javascript
unologin.onLogin(() => 
{
  // you can now make authenticated requests!
  alert('You are now logged in!');
});
```

## Detecting a login cookie

You can use ```unologin.isLoggedIn()``` to check if a user is logged in at any time. This will check for the presence of a cookie that is set along side the actual login cookie. 

**IMPORTANT:** Do not use ```isLoggedIn()``` or *any* other client-side logic as a security measure. 

*Authentication should always be performed from your backend*.  
