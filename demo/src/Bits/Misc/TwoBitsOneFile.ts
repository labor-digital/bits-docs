/*
 * Copyright 2022 LABOR.digital
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
 * Last modified: 2022.05.30 at 20:02
 */

import {AbstractBit, Hot} from '@labor-digital/bits';

// While not encouraged it is possible to create multiple bit classes in a single file

@Hot(module)
export class TwoBitsOneFileA extends AbstractBit
{
    mounted()
    {
        console.log('BIT A22');
    }
}

@Hot(module)
export class TwoBitsOneFileB extends AbstractBit
{
    mounted()
    {
        console.log('BIT B');
    }
}