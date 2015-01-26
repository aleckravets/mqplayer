package com.mqplayer.web.app.security;

import com.mqplayer.web.app.domain.User;

import java.util.List;

/**
 * @author akravets
 */
public class SecurityContext {
    /**
     * Current request tokens
     */
    private List<Token> tokens;

    /**
     * Authorized user of the current request
     */
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Token> getTokens() {
        return tokens;
    }

    public void setTokens(List<Token> tokens) {
        this.tokens = tokens;
    }
}
