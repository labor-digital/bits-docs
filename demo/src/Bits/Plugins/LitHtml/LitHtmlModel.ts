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
 * Last modified: 2021.03.19 at 13:23
 */

import {AbstractBit, Data} from '@labor-digital/bits';
import {dataModel, html} from '@labor-digital/bits-lit-html';

export class LitHtmlModel extends AbstractBit
{
    @Data()
    protected value: string = '';
    
    public mounted()
    {
        this.$html(() => html`
            <div>
                <input type="text" class="form-control" @keyup="${dataModel('value')}" placeholder="Type something"/>
                <ul class="list-group mt-3">
                    <li class="list-group-item">&nbsp;<strong>${this.value}</strong></li>
                </ul>
            </div>`
        );
    }
}