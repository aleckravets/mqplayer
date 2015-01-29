package com.mqplayer.api.security;

import com.mqplayer.api.domain.User;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Request-scoped security context.
 *
 * @author akravets
 * @see <a href="http://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html#beans-factory-scopes">Bean scopes</a>
 */
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
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
