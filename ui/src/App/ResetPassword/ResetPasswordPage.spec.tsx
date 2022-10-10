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

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import PasswordResetTokenService from 'Services/Api/PasswordResetTokenService';
import TeamService from 'Services/Api/TeamService';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import ResetPasswordPage from './ResetPasswordPage';

jest.mock('Services/Api/TeamService');
jest.mock('Services/Api/PasswordResetTokenService');

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...(jest.requireActual('react-router-dom') as any),
	useNavigate: () => mockedUsedNavigate,
}));

describe('Reset Password Page', () => {
	it('should have RetroQuest header', () => {
		renderWithToken('');
		expect(screen.getByText('RetroQuest')).toBeDefined();
	});

	it('should have a field for new password, a disabled submit button, and a return to login link', async () => {
		renderWithToken('');
		expect(screen.getByLabelText('New Password')).toBeInTheDocument();
		const submitButton = screen.getByText('Reset Password');
		expect(submitButton).toBeDisabled();
		const loginLink = screen.getByText('Return to Login');
		expect(loginLink).toHaveAttribute('href', '/login');
	});

	describe('Token Validity', () => {
		it('should check if token is valid and navigate to Expired Token page if token is invalid', async () => {
			PasswordResetTokenService.checkIfResetTokenIsValid = jest
				.fn()
				.mockResolvedValue(false);

			renderWithToken('expired-token');
			await waitFor(() =>
				expect(
					PasswordResetTokenService.checkIfResetTokenIsValid
				).toHaveBeenCalledWith('expired-token')
			);
			expect(mockedUsedNavigate).toHaveBeenCalledWith('/expired-link');
			expect(screen.queryByText('Reset Your Password')).toBeInTheDocument();
		});

		it('should check if token is valid and stay on page if it is valid', async () => {
			PasswordResetTokenService.checkIfResetTokenIsValid = jest
				.fn()
				.mockResolvedValue(true);

			renderWithToken('valid-token');
			await waitFor(() =>
				expect(
					PasswordResetTokenService.checkIfResetTokenIsValid
				).toHaveBeenCalledWith('valid-token')
			);
			expect(mockedUsedNavigate).not.toHaveBeenCalled();
			expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
		});
	});

	it('should enable submit button once user types valid password', () => {
		renderWithToken('');
		typeIntoNewPasswordField('invalidpassword');
		const submitButton = screen.getByText('Reset Password');
		expect(submitButton).toBeDisabled();
		typeIntoNewPasswordField('Validpassword1');
		expect(submitButton).toBeEnabled();
	});

	it('should send passwords to the backend on submission', async () => {
		renderWithToken('');
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.setPassword).toHaveBeenCalledWith(
				'P@ssw0rd',
				expect.anything()
			)
		);
	});

	it('should send the secret code in the body to the backend on submission', async () => {
		renderWithToken('ABC123');
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.setPassword).toHaveBeenCalledWith(
				expect.anything(),
				'ABC123'
			)
		);
	});

	it('should not send to the API if there is no password', () => {
		renderWithToken('');
		submitValidForm('');
		expect(TeamService.setPassword).toHaveBeenCalledTimes(0);
	});

	const confirmationMessage = 'All set! Your password has been changed.';
	it('should show success message and hide form if the backend returns 200 after submission', async () => {
		renderWithToken('ABC321');
		submitValidForm();

		await screen.findByText(confirmationMessage);

		const loginLink = await screen.findByText('Return to Login');
		expect(loginLink).toHaveAttribute('href', '/login');

		expect(screen.queryByTestId('resetPasswordFormDescription')).toBeNull();
		expect(screen.queryByTestId('form')).toBeNull();
	});

	it('should not show success message if the form is not submitted', async () => {
		renderWithToken('ABC321');
		expect(screen.queryByText(confirmationMessage)).not.toBeInTheDocument();
	});
});

function submitValidForm(password: string = 'P@ssw0rd') {
	typeIntoNewPasswordField(password);
	fireEvent.click(screen.getByText('Reset Password'));
}

function typeIntoNewPasswordField(password: string = 'P@ssw0rd') {
	fireEvent.change(screen.getByLabelText('New Password'), {
		target: { value: password },
	});
}

function renderWithToken(token: string) {
	const initialEntry =
		token !== '' ? '/password/reset?token=' + token : '/password/reset';
	renderWithRecoilRoot(
		<MemoryRouter initialEntries={[initialEntry]}>
			<Routes>
				<Route element={<ResetPasswordPage />} path="/password/reset" />
			</Routes>
		</MemoryRouter>
	);
}
