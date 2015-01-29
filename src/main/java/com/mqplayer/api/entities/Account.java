package com.mqplayer.api.entities;

/**
 * @author akravets
 */
public class Account {
    private long id;
    private String service;
    private String email;
    private String token;
    private User user;

    public Account() {
    }

    public Account(String service, String email, String token, User user) {
        this.service = service;
        this.email = email;
        this.token = token;
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
