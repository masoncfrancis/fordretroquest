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
package com.ford.labs.retroquest.email;

import com.ford.labs.retroquest.team.RequestPasswordResetRequest;
import com.ford.labs.retroquest.team.password.PasswordResetToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class EmailService {

	@Value("${retroquest.app-base-url}")
	private String appBaseUrl;

	@Value("${retroquest.email.from-address}")
	private String fromEmailAddress;

	@Value("${retroquest.email.is-enabled}")
	private boolean emailEnabled;

	private final JavaMailSender javaMailSender;

	@Autowired
	public EmailService(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}

	public void sendUnencryptedEmail(String subject, String message, String... toAddresses) {
		if (emailEnabled) {
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setTo(toAddresses);
			mailMessage.setSubject(subject);
			mailMessage.setText(message);
			mailMessage.setFrom(fromEmailAddress);
			mailMessage.setSentDate(new Date());
			try {
				javaMailSender.send(mailMessage);
			} catch (Exception e) {
				System.out.println("Error in sending email message: " + e.getMessage());
			}
		}
	}

	public String getPasswordResetMessage(
			PasswordResetToken passwordResetToken,
			RequestPasswordResetRequest requestPasswordResetRequest
	) {
		return (
			"Hey there! \n" +
			"You recently requested to reset your password for your RetroQuest account " +
			requestPasswordResetRequest.getTeamName() +
			" associated with your email account " +
			requestPasswordResetRequest.getEmail() +
			". No changes have been made to the account yet. \r\n" +
			"Use the link below to reset your password. This link is only valid for the next 10 minutes. \r\n" +
			appBaseUrl +
			"/password/reset?token=" +
			passwordResetToken.getResetToken() +
			"\r\n" +
			"Thanks, \r\n The RetroQuest Team \r\n"
		);
	}
}
