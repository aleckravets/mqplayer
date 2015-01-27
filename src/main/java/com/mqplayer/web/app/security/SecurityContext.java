package com.mqplayer.web.app.security;

import com.mqplayer.web.app.domain.User;

import java.util.List;
import java.util.Map;

/**
 * @author akravets
 */
public class SecurityContext {
    /**
     * Current request tokens
     */
    private Map<String, String> tokens;

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

    public Map<String, String> getTokens() {
        return tokens;
    }

    public void setTokens(Map<String, String> tokens) {
        this.tokens = tokens;
    }
}
