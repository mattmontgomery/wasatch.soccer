<h2 align="center">
  🔔 react-sub-unsub
</h2>

<h3 align="center">
  Manage React effect listeners with ease.
</h3>
<p align="center">
  <a href="https://badge.fury.io/js/react-sub-unsub" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/react-sub-unsub.svg?badge" alt="npm Version" /></a>&nbsp;
  <a href="https://github.com/justinmahar/react-sub-unsub/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/GitHub-Source-success" alt="View project on GitHub" /></a>&nbsp;
  <a href="https://github.com/justinmahar/react-sub-unsub/actions?query=workflow%3ADeploy" target="_blank" rel="noopener noreferrer"><img src="https://github.com/justinmahar/react-sub-unsub/workflows/Deploy/badge.svg" alt="Deploy Status" /></a>&nbsp;
  <a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>
</p>

## Documentation

Read the **[official documentation](https://justinmahar.github.io/react-sub-unsub/)**.

## Overview

Take all the frustration (and memory leaks) out of adding and removing listeners in React!

With this library, you can easily manage listeners, JS timers (intervals, timeouts), and anything else that follows the subscribe/unsubscribe pattern in your React effects.

Simply use an instance of the `Subs` class in this library to subscribe to events or timers. All unsubscribe functions are stored for later.

When it's time to unsubscribe all listeners, just call `unsubAll()` to remove all listeners and clear all timers. Easy as that.

You can also create a cleanup function using `createCleanup()` that will unsubscribe all listeners when called. This is particularly handy when used as the return value for [React effects](https://reactjs.org/docs/hooks-effect.html).

For finer control or one-off subscriptions, you can use the static functions in the `Subscribe` class.

See below for examples and more.

### Features include:

- **🔔 Quickly and easily subscribe and unsubscribe to and from events**
  - An easy way to subscribe and unsubscribe to/from events in JavaScript.
- **💁‍♀️ Covers common use cases, as well as custom ones**
  - Built-in support for [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) and DOM events, and custom.
- **⏰ Timeout and interval support**
  - Includes support for [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) and [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) to make life easier.
- **⚛️ Perfect for React effects**
  - Makes adding/removing listeners and timers in React effects a breeze.
- **👍 Simple, flexible, and convenient**
  - Use static functions yourself via `Subscribe`, or a `Subs` instance for ultimate convenience.

[lock:donate]::🚫---------------------------------------

## Donate 

I hope this project makes your life a little easier! If it does and you'd like to show your appreciation, consider supporting the project with a coffee or sponsorship. 

Your support helps keep the project going and will earn you some serious virtual high fives. Maybe even a virtual fist bump if you're feeling extra cool.

<a href="https://github.com/sponsors/justinmahar">
  <img src="https://justinmahar.github.io/react-kindling/support/sponsor.png" alt="Sponsor via GitHub" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/5">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-1.png" alt="Buy me a coffee" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/15">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-3.png" alt="Buy me 3 coffees" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/25">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-5.png" alt="Buy me 5 coffees" height="35" />
</a>

[/lock:donate]::---------------------------------------🚫

## Table of Contents 

- [Documentation](#documentation)
- [Overview](#overview)
  - [Features include:](#features-include)
- [Donate](#donate)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Static Functions](#static-functions)
- [TypeScript](#typescript)
- [Icon Attribution](#icon-attribution)
- [Contributing](#contributing)
- [⭐ Found It Helpful? Star It!](#-found-it-helpful-star-it)
- [License](#license)

## Installation

```
npm i react-sub-unsub
```

## Quick Start

Below is a full example of adding/removing listeners in a React effect using the `Subs` class.

In this example, we will subscribe to an event emitter, a DOM event, and a custom listener interface, as well as some
timers. 

At the end of the effect, we will return a cleanup function that unsubscribes all listeners and timers using `createCleanup()`.

```jsx
import React from 'react';
import { EventEmitter } from 'events';

import { Subs } from 'react-sub-unsub';

export const eventEmitter = new EventEmitter();
export const MyComponent = (props: any) => {
  React.useEffect(() => {
    // Listener functions
    const myEventListener = () => {
      console.log('My event fired!');
    };
    const keyPressListener = (e: any) => {
      console.log('Key pressed!', e);
    };
    const bodySizeListener = (e: any) => {
      console.log('Body size changed!', e);
    };

    // Use this object to subscribe and unsubscribe
    const subs = new Subs();

    // ➡️ Event emitter subscription
    subs.subscribeEvent(eventEmitter, 'my-event', myEventListener);

    // ➡️ DOM event subscription
    subs.subscribeDOMEvent(document, 'keypress', keyPressListener);

    // ➡️ Custom listener interface subscription
    subs.subscribe(() => {
      const resizeObserver = new ResizeObserver(bodySizeListener);
      const targetElement = document.getElementsByTagName('body')[0];
      resizeObserver.observe(targetElement);
      return () => resizeObserver.unobserve(targetElement);
    });

    // ➡️ setTimeout subscription
    subs.setTimeout(() => {
      console.log('Timeout fired!');
    }, 2000);

    // ➡️ setInterval subscription
    subs.setInterval(() => {
      console.log('Interval fired!');
    }, 1000);

    // You can access all unsubscribe functions directly via `subs.list`
    console.log(`There are ${subs.list.length} subscriptions!`);

    // Return a cleanup function that unsubscribes all listeners and timers
    return subs.createCleanup();
  }, []);

  // ...

  return <div>My Component!</div>;
};
```

If you need to perform other cleanup in your effect's return function, you can unsubscribe all listeners manually by calling `subs.unsubAll()`, like so:

```jsx
// Effect cleanup function
return () => {
  subs.unsubAll();
  // ... Custom cleanup
};
```

## Static Functions

If you'd like to call the functions used by `Subs` manually, you can use the static functions available in the `Subscribe` class:

```js
import { Subscribe } from 'react-sub-unsub';
```

Call any of the following:

- `Subscribe.subscribe` - Call provided function to subscribe to an event and return an unsubscribe function.
- `Subscribe.subscribeEvent` - Subscribe to an emitter event and return an unsubscribe function.
- `Subscribe.subscribeDOMEvent` - Subscribe to a DOM event and return an unsubscribe function.
- `Subscribe.setTimeout` - Create a subscription using `setTimeout`, return an unsubscribe function.
- `Subscribe.setInterval` - Create a subscription using `setInterval`, return an unsubscribe function.
- `Subscribe.unsubAll` - Call all provided unsubscribe functions (array or single unsubscribe).
- `Subscribe.createCleanup` - Create and return a cleanup function that, when called, calls all unsubscribe functions provided.

See the JS docs for each for more details.

[lock:typescript]::🚫---------------------------------------

## TypeScript

Type definitions have been included for [TypeScript](https://www.typescriptlang.org/) support.

[/lock:typescript]::---------------------------------------🚫

[lock:icon]::🚫---------------------------------------

## Icon Attribution

Favicon by [Twemoji](https://github.com/twitter/twemoji).

[/lock:icon]::---------------------------------------🚫

[lock:contributing]::🚫---------------------------------------

## Contributing

Open source software is awesome and so are you. 😎

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

[/lock:contributing]::---------------------------------------🚫

## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/react-sub-unsub/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/react-sub-unsub/stargazers): [👉⭐](https://github.com/justinmahar/react-sub-unsub/stargazers)

## License

See [LICENSE.md](https://justinmahar.github.io/react-sub-unsub/?path=/story/license--page).