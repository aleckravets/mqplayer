package com.mqplayer.web.app.domain;

/**
 * @author akravets
 */
public class Account {
    private long id;
    private String service;
    private String email;
    private String token;
    private long userId;

    public Account() {
    }

    public Account(String service, String email, String token, long userId) {
        this.service = service;
        this.email = email;
        this.token = token;
        this.userId = userId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
