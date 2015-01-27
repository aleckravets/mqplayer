package com.mqplayer.web.app.domain;

/**
 * @author akravets
 */
public class AppException extends RuntimeException {
    public AppException(String message) {
        super(message);
    }
}
