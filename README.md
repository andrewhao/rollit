# rollit
🍭 Rollup tutes

## Setting the scene

We have a module `a.js` that imports `b.js`

## Let's get started

    $ rollup src/a.js

What happens?

```js
var b = 'bee dot jay ess';

var a = 'a dot jay ess';

export default a;
export { b };
```

A few observations:

- `b.js` got inlined into `a.js`.
- The exported variable `bExtraStuff` in `b.js` is tree-shaken out of the module.

## Move to a configuration

Adding a `rollup.config.js` file:

```js
export default {
    input: {
        index: 'src/a.js',
    },
    output: {
        name: 'rollit',
        dir: 'dist',
        format: 'esm',
    },
  plugins: []
};
```

Now run:

    $ rollup -c rollup.config.js

And the file output in `/dist/index.js` should be:

```js
var b = 'bee dot jay ess';

var a = 'a dot jay ess';

export default a;
export { b };
```

## Let's throw in some modules

Now let's do some fancy stuff. Let's add a ESM module compatible library, like [`date-fns`](https://github.com/date-fns/date-fns) in module `c.js`.

```js
// c.js

import {format} from 'date-fns';

const todayString = format(new Date(), 'yyyy-MM-dd')

export {todayString};

export default `c.js today is ${todayString}`;
```

And import it back in a.js:

```js
// a.js

import b from './b';
import { todayString } from './c';

export { b }

export default `a dot jay ess: Today's date is ${todayString}`;
```



And then we add the `node-resolve` plugin to our config:

```js
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: {
        index: 'src/a.js',
    },
    output: {
        name: 'rollit',
        dir: 'dist',
        format: 'esm',
    },
  plugins: [nodeResolve()]
};
```

    $ rollup -c rollup.config.js

The output... WHOA!

```js
// ...a bunch of code
/**
 * @name format
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
// ... a bunch of date-fns.format() code ...
// ...

const todayString = format(new Date(), 'yyyy-MM-dd');

var a = `a dot jay ess: Today's date is ${todayString}`;

export default a;
export { b };
```

That was wild! So we saw tree-shaking in action by witnessing rollup.js pull in the format() function from `date-fns` library!
