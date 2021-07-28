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

## Now let's see this in action with another entry point.

Rollup can also do multiple entry points. Let's see how this works.

We add a new entrypoint in a2.js

```js
// a2.js
// This file depends on the string we exported in c.js

import { todayString } from './c';

export default `a2 dot jay ess: Today's date is ${todayString}`;
```

Now we add this to the rollup config:

```js
  input: {
    index: 'src/a.js',
    index2: 'src/a2.js', // Add this line
  },
```

And we run:

    $ npx rollup -c rollup.config.js

Now we see two files output in /dist:

```js
// ➜ cat dist/index.js
import { t as todayString } from './c-d8f528cb.js';

var b = 'bee dot jay ess';

var a = `a dot jay ess: Today's date is ${todayString}`;

export default a;
export { b };
```

And the new entrypoint:

```js
// ➜ cat dist/index2.js
import { t as todayString } from './c-d8f528cb.js';

var a2 = `a2 dot jay ess: Today's date is ${todayString}`;

export default a2;

rollit on  main [!?]
```

### What happened?

Hello, rollup was smart enough to see a shared chunk between the two entry points. c.js becomes its own exported chunk in the `c-d8f528cb.js` file.
