package com.mqplayer.api.exceptions;

/**
 * @author akravets
 */
public class AuthenticationException extends AppException {
    public AuthenticationException() {
        super("Authentication failed");
    }
}
