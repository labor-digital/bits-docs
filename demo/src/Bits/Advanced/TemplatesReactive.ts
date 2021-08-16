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