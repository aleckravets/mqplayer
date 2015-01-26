package com.mqplayer.web.app.security;

/**
 * @author akravets
 */
public class Token {
    private String service;
    private String token;

    public Token(String service, String token) {
        this.service = service;
        this.token = token;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
