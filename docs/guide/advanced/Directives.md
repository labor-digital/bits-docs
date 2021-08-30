# Directives

Directives are basically, "mini-bits" that are designed to encapsulate code executed close to the DOM.
The library ships with built-in directives like: `data-bind`, `data-model` or `data-if`, but both
plugins and your application add custom directives.

## Getting started (focused)

To create a new directive, add a new file at `src/Directives/FocusDirective.ts` and paste in the following content:

```typescript
import {AbstractDirective} from '@labor-digital/bits';

export class FocusDirective extends AbstractDirective
{
    public mounted()
    {
        this.$el.focus();
    }
}
```

::: tip this.$el

The directive instance knows on which DOM element it is currently bound.
You can use this.$el to access the reference.

:::

Now, you need to register the directive in your application by adding it to the configuration:

```typescript
import {BitApp} from '@labor-digital/bits';
import {FocusDirective} from 'src/Directives/FocusDirective.ts';

new BitApp({
    /* ... */
    directives: {
        focus: FocusDirective
    }
});
```

Finally, start using the directive in the HTML markup of your bit:

```html
<b-mount type="advanced/directives">
    <input type="text" data-focus placeholder="I'm focused">
</b-mount>
```

<Example href="/demo/examples/advanced-directives.html" :height="90"/>

::: tip

The key you provide (e.g. "focus") defines how the data attribute looks like. If you use
camelBacked values like `myDirective`, you end up with an attribute like: `data-my-directive` 

:::

## Lifecycle

As you have seen in the simple "focus" example above, a directive also has lifecycle methods, similar to a bit.
Note, however, that directives are not directly coupled to a bit lifecycle! Directives are recreated every time
the "domChange" event is triggered on the bit or its children. 

### bind(value: any): Promise<void\>
Async lifecycle hook, executed when the bindable is bound/mounted to the DOM node.
The `value` is either null, or if the value of the bound bit property. (See "Data binding" for more information).
**NOTE** This is a Low-Level hook, you MUST call `super.bind(value)`! 

### mounted(value: any): void
Lifecycle hook, executed ONCE, when the directive was mounted to the DOM. Can be used to register event listeners or perform DOM manipulation.
The `value` is either null, or if the value of the bound bit property. (See "Data binding" for more information).

### update(value: any)
Lifecycle hook, executed **every time** the linked, reactive value got updated.
**Will ONLY be executed, if a reactive value was bound in the HTML markup**

### unmount()
Lifecycle hook, executed ONCE when the directive gets removed from the DOM.
Should be used to remove all event listeners to avoid memory leaks.

## Data binding

A directive can be linked to reactive properties of bits. To bind a property, the HTML must look like: `data-my-directive="propertyName"`.
The property, called `propertyName` MUST exist in the parent bit of the directive in order to work correctly. The data will be bound
reactively, meaning every time the value of `propertyName` changes, the `update` lifecycle hook will be executed in the directive.

To make it less theoretical, imagine a simple bit:

```typescript
import {AbstractBit, Data, Hot} from '@labor-digital/bits';

@Hot(module)
export class Directives extends AbstractBit
{
    @Data()
    protected message: string = 'Hello World';
}
```

With an equally simple markup:
```html
<b-mount type="advanced/directives">
    <input type="text" data-model="message" value="Hello there!">
    <button data-alert="message">Show alert</button>
</b-mount>
```

The magic part in the HTML is `data-alert="message"` which A.) binds the "AlertDirective" and B.) defines that "message" is the reactive property to bind to.
This means that all livecycle hooks of "AlertDirective" receive "Hello World" as value (Because it is the default value in the bit).

Now, lets implement the directive:

```typescript
import {AbstractDirective} from '@labor-digital/bits';

export class AlertDirective extends AbstractDirective
{
    protected message!: string;
    
    public mounted(value: any)
    {
        this.message = value;
        this.$el.addEventListener('click', this.onClick.bind(this));
    }
    
    public update(value: any)
    {
        this.message = value;
    }
    
    public unmount()
    {
        this.$el.removeEventListener('click', this.onClick.bind(this));
    }
    
    protected onClick(e: MouseEvent)
    {
        e.preventDefault();
        
        alert(this.message);
    }
}
```

`mounted` is called first, receiving the initial value, which we store as "message". It also
registers the click event listener to the element it is bound to. `unmount` does the opposite, 
pulling down the event listener again. 

As you see in the HTML, we also bind `message` using `data-model` on the input field, 
so every time the user changes the value, the `update` method in the directive is called,
receiving the new value and storing it again as message.

When the element gets clicked an alert will pop up with the stored message.

<Example href="/demo/examples/advanced-directives-data.html" :height="180"/>

::: tip Enforcing data binding

By default directives, don't need to be bound to a property in the bit.
To enforce a property you can use the `requireValue` field in the directive class.

```typescript
import {AbstractDirective} from '@labor-digital/bits';
export class AlertDirective extends AbstractDirective
{
    // If this directive is bound without a 
    // matching data binding an error will be thrown 
    requireValue = true;
    // ...
}
```

:::

## A word on "Bindables"
When you start working with directives, you will probably soon read something about "Bindables". `AbstractBindable`
is the base class from which the `AbstractDirective` inherits. It is even more low-level than a directive and
has just a subset of lifecycle methods. `data-bind`, `data-model` or `data-bind-attr` all are bindables,
and not directives to improve the performance by dropping unused functionality.

In your daily work I would strongly suggest using directives instead of bindables unless you have a 
good reason and know what you want to achieve.