
import { setup } from '../src/options';

import * as Popup from '../src/popup';

import LoginContainer, {
  LoginWindowPopup,
} from '../src/login-container';

/**
 * 
 */
class MockPopup
implements Popup.PopupWindow
{
  public closed = false;

  /** @returns void */
  public close = jest.fn(
    () => { this.closed = true; },
  )

  /** @returns void */
  public focus = jest.fn(
    () => {},
  )
}

const windowOpen = jest.spyOn(Popup, 'openCenteredPopup');

describe('LoginContainer', () => 
{
  const params = 
  {
    url: new URL('https://example.com'),
    title: 'Example',
  };

  let mockWin : MockPopup;

  windowOpen.mockImplementation(
    () => mockWin = new MockPopup(),
  );

  jest.spyOn(
    global,
    'setInterval',
  ).mockReturnValue(null as any);

  jest.spyOn(
    global,
    'clearInterval',
  ).mockImplementation(
    () => { },
  );

  test('start focuses already started popup', () => 
  {
    const popup = LoginContainer.start(new LoginWindowPopup(params));

    expect(windowOpen)
      .toHaveBeenCalledTimes(1);

    expect(LoginContainer.start(new LoginWindowPopup(params)))
      .toBe(popup);

    expect(windowOpen)
      .toHaveBeenCalledTimes(1);

    popup.close();
  });

  test('detects window being closed', () => 
  {
    const intervals : (() => unknown)[] = [];

    const triggerPoll = () => intervals.map((fn) => fn());

    const setIntervalSpy = jest.spyOn(
      global,
      'setInterval',
    );

    const clearIntervalSpy = jest.spyOn(
      global,
      'clearInterval',
    ).mockImplementation(
      () => { },
    );

    setIntervalSpy.mockImplementation(
      (fn) => intervals.push(fn) as any,
    );

    const popup = LoginContainer.start(new LoginWindowPopup(params));

    const onClosed = jest.fn();

    popup.onClosed(onClosed);

    expect(popup.isActive())
      .toBe(true);

    expect(clearIntervalSpy)
      .toHaveBeenCalledTimes(0);

    triggerPoll();

    expect(onClosed)
      .toHaveBeenCalledTimes(0);
      
    expect(clearIntervalSpy)
      .toHaveBeenCalledTimes(0);

    expect(popup.isActive())
      .toBe(true);

    mockWin.close();

    expect(onClosed)
      .toHaveBeenCalledTimes(0);

    expect(clearIntervalSpy)
      .toHaveBeenCalledTimes(0);

    triggerPoll();

    expect(onClosed)
      .toHaveBeenCalledTimes(1);

    expect(clearIntervalSpy)
      .toHaveBeenCalledTimes(1);

    expect(popup.isActive())
      .toBe(false);

    popup.close();
  });
  
  test('messageIsFromPopup', () => 
  {
    setup({ appId: '' });

    const popup = LoginContainer.start(new LoginWindowPopup(params));

    type Case = [Parameters<LoginContainer['isMessageFromPopup']>[0], boolean];

    const cases : Case[] = 
    [
      [
        {
          source: mockWin,
          origin: 'https://login.unolog.in',
          data: {},
        },
        true,
      ],
      [
        {
          source: new MockPopup(),
          origin: 'https://login.unolog.in',
          data: {},
        },
        false,
      ],
      [
        {
          source: mockWin,
          origin: 'http://unolog.in',
          data: {},
        },
        false,
      ],
    ];

    for (const [input, output] of cases)
    {
      expect(popup.isMessageFromPopup(input))
        .toBe(output);
    }
    
    popup.close();
  });

  test('onMessage', () => 
  {
    const popup = LoginContainer.start(new LoginWindowPopup(params));

    const onLogin = jest.fn();

    popup.onLogin(onLogin);

    const onClosed = jest.fn();

    popup.onClosed(onClosed);

    const loginMsg = 
    {
      id: '_uno_onLoginInternal',
      foo: 'bar',
      isLoginMessage: true,
    };

    const msg : Popup.PopupMessage = 
    {
      source: mockWin,
      
      origin: 'https://login.unolog.in',

      data: JSON.stringify(loginMsg),
    };

    popup.onMessage(msg);

    expect(onLogin)
      .toHaveBeenCalledTimes(1);

    expect(onLogin.mock.calls[0][0])
      .toStrictEqual(loginMsg);

    expect(onLogin.mock.calls[0][1])
      .toStrictEqual(msg);

    popup.close();
  });
});
