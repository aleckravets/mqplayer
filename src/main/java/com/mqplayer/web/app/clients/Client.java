package com.mqplayer.web.app.clients;

/**
 * @author akravets
 */
public interface Client {
    String getEmailByToken(String token);
}
