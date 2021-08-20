# HTML and Templates

While the main focus of this library sets on enhancing server side rendered HTML using javascript, sometimes you want to generate HTML to build lists or make a dynamic output. 

For those cases bits provides you with two major options of generating HTML/manipulating the dom.

## $html()

::: tip Lit-Html integration

In previous releases, $html() was part of the bits library core.
To reduce the size and dependency count you can now install it as a [separate plugin](../plugins/LitHtml.md)

:::

## $tpl() 

### Static rendering

Where `$html` is your swiss army knife of generating HTML, `$tpl` is basically the little toothpick on the side. 
By default, it loads the content of a "template" tag, replaces some markers <span v-pre>```{{value}}```</span> (with html escaping) or <span v-pre>```{{{value}}}```</span> (without html escaping).
To be usable, your template MUST have a data-ref="$ref" attribute. 

The method allows you to provide a list of values that can be injected
while the template is loaded. NOTE: This is not reactive, but merely an initial state.

::: tip

If your template contains binding attributes like data-bind or data-model, you have to execute
the $domChanged() method once, after the node was attached to the dom tree! This will tell the library that 
those new elements must be bound to their respective instances

:::

::: warning LEGACY

While the old syntax using the ```<span data-value="key"></span>``` markers still works, it's highly recommended to use
the brace syntax instead. 
 
:::

For an example, start with a HTML like this:
```html
<b-mount type="templates" class="card bg-light mt-3">
    <template data-ref="tpl">
        <li class="list-group-item">
            I am {{id}}
            <button data-ref="remove">Remove</button>
        </li>
    </template>
    
    <button data-ref="add">Add Line</button>
    
    <ul data-ref="elements" >
        <li >You can add new sections here</li>
    </ul>
</b-mount>
```

Your script could look somewhat like this:

::: tip

There are two functions from an external library you can ignore:

closest() is a legacy wrapper for HTMLElement.closest() which is not supported in IE11.
getGuid() returns a unique id with the given prefix. 

:::

```typescript
import {AbstractBit, Listener} from '@labor-digital/bits';
import {closest, getGuid} from '@labor-digital/helferlein';

export class Templates extends AbstractBit
{
    @Listener('click', '@remove')
    onRemoveClick(e: MouseEvent)
    {
        const el = closest('li', e.target as HTMLElement);
        el?.parentElement!.removeChild(el);
    }
    
    @Listener('click', '@add')
    onAddChild()
    {
        this.$find('@elements')!.appendChild(
            this.$tpl('tpl', {
                id: getGuid('entry ')
            })
        );
        
        this.$domChanged();
    }
}
```

<Example href="/demo/examples/advanced-templates.html" :height="250"/>

::: tip $domChanged()

Now, because we changed the dom in a way that can not be tracked by the system,
we manually have to tell it, that it should rebind all static event listeners (@Listener annotation) and all
one- and two-way data bindings for us. This can be done easily, by executing the $domChanged() method.
NOTE: Please don't overuse this feature, or you might see performance drops!

**Pro tip:** Under the hood a "domChange" event will bubble up the dom tree and will also
update all other bit mounts it meets along the way. This means that all your parent
nodes will also rebind their data.

**Super-Pro tip:** You can listen for a "domChange" either using a event listener with this.$on('domChange'),
or by using the domChanged() lifecycle hook

:::

### Reactive re-rendering

Alternatively, you can use ```$tpl``` to automatically rerender your templates when the used data changed.
The HTML for our example looks like this.

```html
<b-mount type="advanced/templates/reactive" class="card bg-light mt-3">
    <div class="card-body">
        <template data-ref="tpl">
            The current number is: {{number}}<br>
            <button class="btn btn-primary btn-sm" data-ref="button">Shuffle</button>
        </template>
        
        <div data-ref="target"></div>
    </div>
</b-mount>
```

As you see, we again have a template which defines the part we want to render, and an empty div we will
use as a target. The rendered template will automatically be injected into it.

The main difference is, that we now use the "mounted" lifecycle hook to register our template through the `$tpl`
method and also tell it the element on which we want it to be rendered:

```typescript
import {AbstractBit, Data, Listener} from '@labor-digital/bits';

export class TemplatesReactive extends AbstractBit
{
    @Data()
    protected number: number = 0;
    
    @Listener('click', '@button')
    onRemoveClick(e: MouseEvent)
    {
        this.number = Math.random();
    }
    
    public mounted()
    {
        // To reactively rerender the template when your data changes you can
        // define a node which is used as target. The rendered html will automatically be injected into it
        // and updated if required.
        
        // Please note that the second parameter is not handled as reference automatically,
        // so you have to prefix it with @ if you want to select a ref.
        
        // Also keep in mind to wrap your data into a function when you use dynamic re rendering!
        this.$tpl('tpl', '@target', () => ({number: this.number}));
    }
}
```

::: tip

The click listener is automatically registered, you don't need to fiddle around with this.$domChanged() when you
use a mounted, auto-re-rendering template like this.

:::

<Example href="/demo/examples/advanced-templates-reactive.html" :height="150"/>

### Alternative template engines

By default `$tpl` comes with a barebone implementation of a marker replacer. If you want/need an extended feature list
you can use adapters to use different rendering engines. Bits is shipped using a built in adapter for the [handlebars](https://handlebarsjs.com/)
renderer for [mustache](https://mustache.github.io/mustache.5.html) templates.

To enable handlebars you need to first install it through npm in your project:

```
npm install handlebars
```

After that you can use the handlebars adapter in your app configuration:

```typescript
import {BitApp, tplAdapterHandlebars} from '@labor-digital/bits';

new BitApp({
    bits: { /* ... */},
    tpl: {
        // You can provide additional options for the handlebar compiler as options for the adapter function.
        adapter: tplAdapterHandlebars()
    }
});
```

That's all, you now can render templates using the full mustache template engine.

<Example href="/demo/examples/advanced-templates-handlebars.html" :height="250"/>

::: details Example Source 

```html
<b-mount type="advanced/templates/handlebars" class="card bg-light mt-3">
    <template data-ref="tpl">
        {{#elements}}
        <li>
            I am {{id}} with index {{@index}}
            <button data-ref="remove" data-index="{{@index}}">
                Remove
            </button>
        </li>
        {{/elements}}
        {{^elements}}
        <li >
            Please add a new line
        </li>
        {{/elements}}
    </template>
    
    <button class="btn btn-primary mb-3" data-ref="add">Add Line</button>
    
    <ul data-ref="elements" class="list-group"></ul>
</b-mount>
```

```typescript
import {AbstractBit, Data, Listener} from '@labor-digital/bits';
import {getGuid} from '@labor-digital/helferlein';

export class TemplatesHandlebars extends AbstractBit
{
    @Data()
    protected elements: Array<{ id: string }> = [];
    
    @Listener('click', '@remove')
    onRemoveClick(e: MouseEvent)
    {
        const index = this.$attr(e.target as HTMLElement, 'data-index')![0];
        this.elements.splice(parseInt(index), 1);
    }
    
    @Listener('click', '@add')
    onAddChild()
    {
        this.elements.push({id: getGuid('item ')});
    }
    
    public mounted()
    {
        // As you can see, the usage of handlebars does not change the syntax
        // of your $tpl call. Only the underlying template engine differs,
        // so in this case we can use list rendering that is not supported in the default implementation.
        this.$tpl('tpl', '@elements', () => ({elements: this.elements}));
    }
}
```
:::

### Alternative engine adapters

If you have your own template engine, you can write your own adapter without thinking to much about it.
The `tpl.adapter` option can be set to a function, which will receive three parameters.

* template is the source code of the template tag that was requested
* data is an object literal containing the view data that should be injected into the template
* hash is a hash that is unique for each html `template` tag that is rendered. This allows you to efficiently compile 
  templates and reuse them again later.
  
This is the example of the handlebars adapter which does exactly what you would expect. It compiles
a template only if it is not yet known, and returns the resulting string back to the bits library.

```typescript
import type {PlainObject} from '@labor-digital/helferlein';
import type {ITemplateRendererAdapter} from '@labor-digital/bits';

export function tplAdapterHandlebars(options?: IHandlebarsCompileOptions): ITemplateRendererAdapter
{
    const Handlebars = require('handlebars/dist/handlebars.js');
    const compiled: Map<string, Function> = new Map();
    
    return function (template: string, data: PlainObject, hash: string): string {
        if (!compiled.has(hash)) {
            compiled.set(hash, Handlebars.compile(template, options ?? {}));
        }
        
        return compiled.get(hash)!(data);
    };
}
```

::: danger

The resulting HTML MUST be sanitized and ready to be injected into the DOM!

:::