/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { atom, selector } from 'recoil';

import Action from '../Types/Action';

export const ActionItemState = atom<Action[]>({
	key: 'ActionItemState',
	default: [],
});

export const ActiveActionItemsState = selector<Action[]>({
	key: 'ActiveActionItemsState',
	get: ({ get }) => get(ActionItemState).filter((action) => !action.completed),
});

export const CompletedActionItemsState = selector<Action[]>({
	key: 'CompletedActionItemsState',
	get: ({ get }) => get(ActionItemState).filter((action) => action.completed),
});