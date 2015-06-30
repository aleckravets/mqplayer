package com.mqplayer.api.exceptions;

/**
 * @author akravets
 */
public class NotFoundException extends AppException {
    public NotFoundException() {
        super("Not found");
    }
}
