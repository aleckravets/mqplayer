package com.mqplayer.api.exceptions;

/**
 * @author akravets
 */
public class AuthorizationException extends AppException {
    public AuthorizationException() {
        this("Unauthorized");
    }

    public AuthorizationException(String message) {
        super(message);
    }
}
