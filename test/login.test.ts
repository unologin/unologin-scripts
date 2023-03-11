
import {
  AuthMethod,
  createLoginUrl,
  isLoggedIn,
  LoginFlowError,
  LoginFlowErrorType,
  startLogin,
} from '../src/login';

import unologin from '../src/main';

import LoginContainer, { 
  LoginResponse, 
} from '../src/login-container';

import controlledAsync from './util/controlled-async';

describe('createLoginUrl', () => 
{
  unologin.setup(
    {
      appId: 'my-appId',
    },
  );

  it('Correctly creates loginUrl with default values.', () => 
  {
    const url = createLoginUrl();

    expect(`${url.protocol}//${url.host}`)
      .toBe('https://login.unolog.in');

    expect(url.pathname)
      .toBe('/');

    const params = Object.fromEntries(url.searchParams.entries());

    expect(params)
      .toStrictEqual(
        {
          client: 'Web',
          appId: 'my-appId',
          userClass: 'users_default',
        },
      );
  });

  it('Correctly creates loginUrl with custom values.', () => 
  {
    const customParams = 
    {
      appId: 'custom-appId',
      userClass: 'users_custom',
      code: 'abc',
    };

    const url = createLoginUrl(customParams);

    expect(`${url.protocol}//${url.host}`)
      .toBe('https://login.unolog.in');

    expect(url.pathname)
      .toBe('/');

    const params = Object.fromEntries(url.searchParams.entries());

    expect(params)
      .toStrictEqual(
        {
          client: 'Web',
          ...customParams,
        },
      );
  });

  it('Correctly creates OAuth URL.', () => 
  {
    const customParams = 
    {
      appId: 'custom-appId',
      userClass: 'users_custom',
      code: 'abc',
      authMethod: AuthMethod.google,
    };

    const url = createLoginUrl(customParams);

    expect(`${url.protocol}//${url.host}`)
      .toBe('https://api.unolog.in');

    expect(url.pathname)
      .toBe('/initial-auth/google');

    const oAuthUrlParams = [...url.searchParams.entries()];

    expect(oAuthUrlParams.length)
      .toBe(1);

    expect(oAuthUrlParams[0][0])
      .toBe('loginUrl');

    const loginUrl = new URL(oAuthUrlParams[0][1]);

    expect(Object.fromEntries(loginUrl.searchParams.entries()))
      .toStrictEqual(
        {
          client: 'Web',
          ...customParams,
        },
      );
  });
});

describe('isLoggedIn', () => 
{
  it('Returns false if _uno_loginState cookie is missing.', () => 
  {
    expect(isLoggedIn('otherCookie=abc'))
      .toBe(false);

    expect(isLoggedIn(document.cookie))
      .toBe(false);
  });

  it('Returns true if _uno_loginState cookie is "success"', () => 
  {
    const cases = [
      '_uno_loginState=success',
      'otherCookie=abc; _uno_loginState=success',
    ];

    for (const cookie of cases)
    {
      expect(isLoggedIn(cookie))
        .toBe(true);
    }
  });
});

describe('startLogin', () => 
{
  const startPopup = jest.spyOn(LoginContainer, 'start');
  const msgEvent = new MessageEvent('postMessage');

  it('Rejects on window being closed by user.', async () =>
  {
    const loginController = controlledAsync<LoginResponse>();

    let closePopup : () => void;

    const popupMock : Partial<LoginContainer> = 
    {
      close: jest.fn(() => {}),
      onClosed: jest.fn((fn) => { closePopup = fn; }),
      onLogin: (fn) => loginController().then(
        (resp) => fn(resp, msgEvent),
      ),
    };

    startPopup.mockImplementation(
      () => popupMock as LoginContainer,
    );

    const login = startLogin();

    await expect(async () => 
    {
      closePopup();

      await login;
    }).rejects.toStrictEqual(
      new LoginFlowError(
        'Login flow closed by user.',
        LoginFlowErrorType.ClosedByUser,
      ),
    );
  });

  it('Resolves after successful login.', async () =>
  {
    const loginController = controlledAsync<LoginResponse>();

    const popupMock : Partial<LoginContainer> = 
    {
      close: jest.fn(() => {}),
      onClosed: jest.fn(() => {}),
      onLogin: (fn) => loginController().then(
        (resp) => fn(resp, msgEvent),
      ),
    };

    startPopup.mockImplementation(
      () => popupMock as LoginContainer,
    );

    const login = startLogin();

    loginController.resolve({ success: true });

    await login;
  });

  it('Rejects after unsuccessful login.', async () =>
  {
    const loginController = controlledAsync<LoginResponse>();

    const popupMock : Partial<LoginContainer> = 
    {
      close: jest.fn(() => {}),
      onClosed: jest.fn(() => {}),
      onLogin: (fn) => loginController().then(
        (resp) => fn(resp, msgEvent),
      ),
    };

    startPopup.mockImplementation(
      () => popupMock as LoginContainer,
    );

    const login = startLogin();

    loginController.resolve({ success: false });

    await expect(login)
      .rejects.toStrictEqual(
        new LoginFlowError(
          'Unknown cause.',
          LoginFlowErrorType.Unknown,
        ),
      );
  });
});
