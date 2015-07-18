package com.mqplayer.api.domain.entities;

import com.mqplayer.api.db.annotations.Ignore;

public class Account {
    private Long id;
    private String service;
    private String email;
    private String token;
    private Long userId;

    @Ignore
    private User user;

    public Account() {
    }

    public Account(String service, String email, String token, Long userId) {
        this.service = service;
        this.email = email;
        this.token = token;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
