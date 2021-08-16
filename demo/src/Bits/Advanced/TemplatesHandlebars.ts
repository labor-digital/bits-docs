/*
 * Copyright 2021 LABOR.digital
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Last modified: 2021.03.07 at 20:39
 */

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
        this.elements.splice(parseInt(index + ''), 1);
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