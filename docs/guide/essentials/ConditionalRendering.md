# Conditional Rendering

To toggle the `display` CSS-property of DOM elements, you can either use the `$style` method in your bit,
or you can use the `data-if` directive on the element you want to define. The value of the attribute
sets the name of the property in your bit; if it is truthy the element will be shown `display:block`,
if it is falsy it will be hidden `display:none`.

Let's take a look at it in action. Imagine a simple bit like this:
Every time the element with the "button" reference gets clicked, the `state` property gets toggled.

```typescript
import {AbstractBit, Data, Hot, Listener} from '@labor-digital/bits';

@Hot(module)
export class Conditional extends AbstractBit
{
    @Data()
    protected state: boolean = false;
    
    @Listener('click', '@button')
    protected onClick(e: MouseEvent): void
    {
        e.preventDefault();
        this.state = !this.state;
    }
}
```

Using `data-if`in your markup you can toggle the "Hello!" element on and off 

```html
<b-mount type="essentials/conditional">
    <button data-ref="button">Click to toggle</button>
    <div data-if="state">Hello!</div>
</b-mount>
```

<Example href="/demo/examples/essentials-condition.html" :height="130"/>

::: tip Change the display mode

By default `display:block` is set to the element if the property is truthy.
You can use `data-if-display="flex"` to define the display mode you want to be used instead. 

:::

## data-else alternatives

If the **next sibling** of an element containing `data-if` has the `data-else` attribute, 
you can easily toggle between two elements.

```html
<b-mount type="essentials/conditional">
    <button data-ref="button">Click to toggle</button>
    <div data-if="state">Goodbye!</div>
    <div data-else>Hello!</div>
</b-mount>
```

<Example href="/demo/examples/essentials-condition-else.html" :height="130"/>

## data-transition fancyness

To let your toggle look nice, you can use the `data-transition` attribute on the element to toggle. 
I ~~shamelessly took~~ *cough* borrowed most of the logic behind transitions from vue.js's [Enter/Leave transitions](https://v3.vuejs.org/guide/transitions-enterleave.html#transitioning-single-elements-components),
so if you ever used vue, you will probably feel right at home. 

1. After you added `data-transiton` bits will add transition classes to the element. 
2. If an `data-else` element exists, it will also get the transition classes applyed to it.
3. The duration of the transition will be parsed from the css `transition` or `animation` properties of the elements.
 
### Transition classes

There are seven different transition classes, three for showing, three for hiding the element. 

1. `b-enter-from`: Added before the `display` attribute is changed, removed one frame after attribute has been changed. The starting state of the animation. (e.g. opacity: 0)
2. `b-enter-active`: Added together with `b-enter-from` before `display`is changed. Applied to the element as long as the transition is running. This class can be used to define the transition/animation css properties. (e.g. transition: opacity 0.3s)
3. `b-enter-to`: Added after `b-enter-from` was removed. Defines the state you want to transition to. (e.g. opacity: 1)
4. `b-leave-from`': Added before the transition begins, removed one frame later. The starting state of the animation. (e.g. opacity: 1)
5. `b-leave-active`: Added together with `b-leave-from` before the transition begins. Applied to the element as long as the transition is running. Similar to `b-enter-active`, this class can be used to define the transition/animation css properties. (e.g. transition: opacity 0.3s)
6. `b-leave-to`: Added after `b-leave-from` was removed. Defines the state you want to transition to. (e.g. opacity: 0)
7. `b-active`: Added while `b-enter-active` or `b-leave-active` are applied to the element, used as generic alternative to both.

::: tip Class scoping

By default the classes are prefixed with "b-", but it is also possible to define a custom prefix through the
`data-transition` attribute. `data-transition="myPrefix"` will cause all classes to look like this: `myPrefix-enter-from`.

:::

### Single Element Transition

For the examples we only adjust the HTML, so we reuse the bit class defined above.

```html
<b-mount type="essentials/conditional">
    <button data-ref="button">Click to toggle</button>
    <div data-if="state" data-transition>Hello!</div>
</b-mount>
```

Activated using `data-transition` you only need to add some css, to add a fancy animation
```css
.b-active {
	transition: all 0.5s;
}

.b-leave-to,
.b-enter-from {
	opacity: 0;
}
```

<Example href="/demo/examples/essentials-condition-transition.html" :height="130"/>

::: details Smoothing it out

While technically working, let's smooth the transition out, by animating the hight of the element as well.
To do this we simply adjust our css slightly. Much smoother ;)

```css
b-mount > div {
    overflow: hidden;
    max-height: 60px;
}

.b-active {
    transition: all 1s;
}

.b-leave-to,
.b-enter-from {
    max-height: 0;
    opacity: 0;
}
```

<Example href="/demo/examples/essentials-condition-transition-smooth.html" :height="130"/>

:::

### If/Else Transition

When working with `data-else` transitions will first transition the "else" element out before 
transitioning the "if" element in, and vice versa. The transition information, like the class prefix and durations
will be inherited from the "if" element. 

Knowing this, you add `data-transition` to our else example, together with a bit of css, and it just works.

```html
<b-mount type="essentials/conditional">
    <button data-ref="button">Click to toggle</button>
    <div data-if="state" data-transition>Goodbye!</div>
    <div data-else>Hello!</div>
</b-mount>
```

```css
b-mount > div {
    overflow: hidden;
    max-height: 60px;
}

.b-active {
    transition: all 1s;
}

.b-leave-to,
.b-enter-from {
    max-height: 0;
    opacity: 0;
}
```

<Example href="/demo/examples/essentials-condition-transition-else.html" :height="130"/>

## Advanced example (sidebar)

With everything you have learned you can create fancy looking UI transition in minutes.
Here is an advanced example, where the entering animation is different to the leave transition.

<Example href="/demo/examples/essentials-condition-transition-sidebar.html" :height="250"/>

::: details Animation css

```css
.sidebar {
    display: none;
    position: fixed;
    padding-top: 40px;
    left: 0;
    top: 0;
    bottom: 0;
    width: 350px
}

.sidebar-enter-active {
    transition: left 0.3s;
}

.sidebar-enter-from {
    left: -350px;
}

/** You can also use specific animations for the leave animation*/
.sidebar-leave-active {
    transition: top 0.4s, bottom 0.2s;
}

.sidebar-leave-to {
    top: -300px;
    bottom: 100vh;
}
```
:::