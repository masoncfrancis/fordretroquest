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

import React, { useState } from 'react';
import EyeOpenIcon from 'Assets/EyeOpenIcon';
import EyeSlashIcon from 'Assets/EyeSlashIcon';
import Input from 'Common/Input/Input';
import { useRecoilValue } from 'recoil';
import { ThemeState } from 'State/ThemeState';
import Theme from 'Types/Theme';

import './InputPassword.scss';

type Props = {
	label?: string;
	password: string;
	onPasswordInputChange: (updatedTeamName: string) => void;
	required?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
};

function InputPassword(props: Props) {
	const {
		label = 'Password',
		password,
		onPasswordInputChange,
		required,
		invalid,
		readOnly,
	} = props;

	const theme = useRecoilValue(ThemeState);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const eyeIconColor = theme === Theme.DARK ? '#ecf0f1' : '#34495E';

	return (
		<div className="input-password">
			<Input
				id="passwordInput"
				label={label}
				type={showPassword ? 'text' : 'password'}
				value={password}
				onChange={(event) => onPasswordInputChange(event.target.value)}
				validationMessage="8 or more characters with a mix of numbers and letters"
				required={required}
				invalid={invalid}
				readOnly={readOnly}
			/>
			<button
				className="eye-icon-toggle"
				type="button"
				aria-label={`${showPassword ? 'Hide' : 'Show'} Password`}
				onClick={() => setShowPassword(!showPassword)}
			>
				{showPassword ? (
					<EyeSlashIcon color={eyeIconColor} />
				) : (
					<EyeOpenIcon color={eyeIconColor} />
				)}
			</button>
		</div>
	);
}

export default InputPassword;