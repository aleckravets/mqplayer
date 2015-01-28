package com.mqplayer.api.exceptions;

/**
 * @author akravets
 */
public class AppException extends RuntimeException {
    public AppException(String message) {
        super(message);
    }
}
