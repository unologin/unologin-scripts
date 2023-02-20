
type Controller<T> =
{
  resolve: (v:T) => void;
  reject: () => void;
};

/**
 * @returns controllable async function
 */
export default function controlledAsync<T = void>() : 
  (() => Promise<T>) & Controller<T>
{
  const controller = 
  {
    resolve: (() => { throw new Error('Not initialized' ); }) as (v: T) => void,
    reject: () => {},
  };
  
  const promise = new Promise<T>(
    ((resolve, reject) => 
    {
      controller.resolve = resolve;
      controller.reject = reject;
    }),
  );

  const fn = () => promise;

  return Object.assign(fn, controller);
}
