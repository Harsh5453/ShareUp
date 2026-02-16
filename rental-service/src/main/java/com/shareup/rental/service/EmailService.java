package com.shareup.rental.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private String signature() {
        return "\n\nThanks & Regards,\nShareUp Community Support Team";
    }

   public void sendEmail(String to, String subject, String body) {
    try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    } catch (Exception e) {
        System.out.println("Email send failed: " + e.getMessage());
    }
}

}

