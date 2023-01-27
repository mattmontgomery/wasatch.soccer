/// <reference types="node" />
import EventEmitter from 'events';
/** Call this function to unsubscribe the listener. */
export type Unsubscribe = () => void;
/**
 * Static functions for subscribing and unsubscribing to and from events.
 */
export declare class Subscribe {
    /**
     * Call a function that adds a listener and returns a function that will unsubscribe the listener.
     *
     * The function passed in will be called immediately to add the listener,
     * and its Unsubscribe function will be returned.
     *
     * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
     * @returns The Unsubscribe function for this subscription.
     */
    static subscribe(subscribe: () => Unsubscribe): Unsubscribe;
    /**
     * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
     *
     * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @returns The Unsubscribe function for this subscription.
     */
    static subscribeEvent(eventEmitter: EventEmitter, eventName: string, listener: (...args: any[]) => void): Unsubscribe;
    /**
     * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback
     * that will be invoked when the event is dispatched.
     *
     * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the
     * method behaves exactly as if the value was specified as options's capture.
     *
     * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute
     * value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute
     * value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
     *
     * Returns a function that will unsubscribe the listener.
     *
     * @param domObj The DOM object to subscribe to for events.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @param options Listener-specific options. See function description.
     * @returns The Unsubscribe function for this subscription.
     */
    static subscribeDOMEvent(domObj: Window | Node, eventName: string, listener: (...args: any[]) => void, options?: boolean | AddEventListenerOptions | undefined): Unsubscribe;
    /**
     * Sets a timer which executes a function once the timer expires using `setTimeout`.
     * Returns an unsubscribe function that clears the timeout using `clearTimeout`.
     *
     * @param handler A function to be executed after the timer expires.
     * @param delay The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
     * @param args Additional arguments which are passed through to the handler specified.
     * @returns The Unsubscribe function for this subscription.
     */
    static setTimeout<TArgs extends any[]>(handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler, delay?: number, ...args: TArgs): Unsubscribe;
    /**
     * Repeatedly calls a function with a fixed time delay between each call using `setInterval`.
     * Returns an unsubscribe function that clears the interval using `clearInterval`.
     *
     * @param handler A function to be executed after the timer expires.
     * @param delay The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function or code. Defaults to 0 if not specified.
     * @param args Additional arguments which are passed through to the handler once the timer expires.
     * @returns The Unsubscribe function for this subscription.
     */
    static setInterval<TArgs extends any[]>(handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler, delay?: number, ...args: TArgs): Unsubscribe;
    /**
     * Call all unsubscribe functions passed in. Can pass either an array of unsubscribe functions,
     * or a single unsubscribe function.
     *
     * @param unsubs An array of unsubscribe functions, or a single unsubscribe function.
     */
    static unsubAll(unsubs: Unsubscribe | Unsubscribe[]): void;
    /**
     * Creates and returns a cleanup function that, when called, calls all unsubscribe functions provided.
     *
     * @param unsubs All subscriptions to be unsubscribed when the returned cleanup function is called.
     * @returns A cleanup function that unsubscribes all subscriptions provided.
     */
    static createCleanup(unsubs: Unsubscribe | Unsubscribe[]): () => void;
}
/**
 * A Subs object can be used to subscribe and unsubscribe to events,
 * and to collect subscriptions in an array to be unsubscribed all at once.
 *
 * Calling any of the subscribe functions will add the unsubscribe function to
 * an internal array. You can then call `unsubAll()` to unsubscribe all
 * at once and clear the list.
 */
export declare class Subs {
    /** A list of unsubscribe functions for all subscribe calls that have been made. */
    list: Unsubscribe[];
    /**
     * Construct a new Subs object.
     *
     * A Subs object can be used to subscribe and unsubscribe to events,
     * and to collect subscriptions in an array to be unsubscribed all at once.
     *
     * Calling any of the subscribe functions will add the unsubscribe function to
     * an internal array. You can then call `unsubAll()` to unsubscribe all
     * at once and clear the list.
     *
     * You can optionally pass in an array of unsubscribe functions to start with.
     *
     * @param list Optional array of unsubscribe functions. Defaults to an empty list.
     */
    constructor(
    /** A list of unsubscribe functions for all subscribe calls that have been made. */
    list?: Unsubscribe[]);
    /**
     * Call a function that adds a listener and returns a function that will unsubscribe the listener.
     *
     * The function passed in will be called immediately to add the listener,
     * and its Unsubscribe function will be returned.
     *
     * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
     *
     * @param subscribe The subscribe function, which returns an Unsubscribe. Will be called immediately.
     * @returns The Unsubscribe function for this subscription.
     */
    subscribe(subscribe: () => Unsubscribe): Unsubscribe;
    /**
     * Subscribe to an emitter event. Returns a function that will unsubscribe the listener.
     *
     * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
     *
     * @param eventEmitter The [EventEmitter](https://nodejs.org/api/events.html#class-eventemitter) to subscribe to.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @returns The Unsubscribe function for this subscription.
     */
    subscribeEvent(eventEmitter: EventEmitter, eventName: string, listener: (...args: any[]) => void): Unsubscribe;
    /**
     * Subscribe to an event on a DOM object (Window or Node). Returns a function that will unsubscribe the listener.
     *
     * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
     *
     * @param domObj The DOM object to subscribe to for events.
     * @param eventName The name of the event to listen for.
     * @param listener The listener callback that is called when the event occurs.
     * @returns The Unsubscribe function for this subscription.
     */
    subscribeDOMEvent(domObj: Window | Node, eventName: string, listener: (...args: any[]) => void): Unsubscribe;
    /**
     * Sets a timer which executes a function once the timer expires using `setTimeout`.
     * Returns an unsubscribe function that clears the timeout using `clearTimeout`.
     *
     * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
     *
     * @param handler A function to be executed after the timer expires.
     * @param delay The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
     * @param args Additional arguments which are passed through to the handler specified.
     * @returns The Unsubscribe function for this subscription.
     */
    setTimeout<TArgs extends any[]>(handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler, delay?: number, ...args: TArgs): Unsubscribe;
    /**
     * Repeatedly calls a function with a fixed time delay between each call using `setInterval`.
     * Returns an unsubscribe function that clears the interval using `clearInterval`.
     *
     * The Unsubscribe function will be added to the internal list of unsubs. You can unsubscribe all by calling `unsubAll()`.
     *
     * @param handler A function to be executed after the timer expires.
     * @param delay The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function or code. Defaults to 0 if not specified.
     * @param args Additional arguments which are passed through to the handler once the timer expires.
     * @returns The Unsubscribe function for this subscription.
     */
    setInterval<TArgs extends any[]>(handler: (args: void) => void | ((...args: TArgs) => void) | TimerHandler, delay?: number, ...args: TArgs): Unsubscribe;
    /**
     * Pushes an unsubscribe function onto the subscription list.
     *
     * You can unsubscribe all by calling `unsubAll()`.
     *
     * @param unsub The unsubscribe function to push to the subscription list.
     */
    push(unsub: Unsubscribe): void;
    /**
     * Call all unsubscribe functions and clear the unsubscribe list.
     */
    unsubAll(): void;
    /**
     * Creates and returns a cleanup function that, when called, calls all unsubscribe functions and clears the unsubscribe list.
     *
     * @returns A cleanup function that unsubscribes all subscriptions and clears the unsubscribe list.
     */
    createCleanup(): () => void;
}
