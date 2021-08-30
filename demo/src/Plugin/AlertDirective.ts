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
 * Last modified: 2021.08.30 at 12:09
 */

import {AbstractDirective} from '@labor-digital/bits';

export class AlertDirective extends AbstractDirective
{
    requireValue = true;
    
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