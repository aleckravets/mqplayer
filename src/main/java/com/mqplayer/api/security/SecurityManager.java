package com.mqplayer.api.security;

import com.mqplayer.api.clients.Client;
import com.mqplayer.api.db.Db;
import com.mqplayer.api.db.SecurityDao;
import com.mqplayer.api.domain.Account;
import com.mqplayer.api.domain.User;
import com.mqplayer.api.exceptions.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

/**
 * @author akravets
 */
@Service
public class SecurityManager {
    private final String CONTEXT_ATTRIBUTE_NAME = "securityContext";

    @Autowired
    private SecurityDao securityDao;

    /**
     * Authorize the request by tokens
     * @param tokens
     * @return
     */
    public void tryAuthorize(SecurityContext securityContext, Map<String, String> tokens) {
        securityContext.setTokens(tokens);

        for (Map.Entry<String, String> entry : tokens.entrySet()) {
            User user = securityDao.getUserByToken(entry.getKey(), entry.getValue());

            if (user != null) {
                securityContext.setUser(user);
                return;
            }
        }

        throw new AuthenticationException();
    }

    /**
     * Update existing account with new token or create a new account.
     * This is normally done upon front-end login
     * @param service
     */
    @Transactional
    public void registerToken(SecurityContext securityContext, String service, String token) throws IOException {
        Client client = Client.resolve(service);

        User currentUser = securityContext.getUser();

        // first try to find the account locally
        Account account = securityDao.getAccountByToken(service, token);

        if (account == null) {
            // account not found locally by token - get the email by token from remote service
            String email = client.getEmailByToken(token);
            account = securityDao.getAccountByEmail(service, email);
            if (account == null) {
                // no account corresponding to this email exists - create it
                if (currentUser == null) {
                    // create new user if not logged in already
                    currentUser = new User();
                    securityDao.addUser(currentUser);
                    securityContext.setUser(currentUser);
                }
                account = new Account(service, email, token, currentUser);
                securityDao.addAccount(account);
            } else {
                // update local account with current token
                securityDao.updateToken(account, token);
            }
        }

        if (currentUser != null) {
            if (!currentUser.equals(account.getUser())) {
                securityDao.mergeUsers(currentUser, account.getUser());
                account.setUser(currentUser);
            }
        } else {
            securityContext.setUser(account.getUser());
        }
    }

    public void setSecurityContext(HttpServletRequest request, SecurityContext context) {
        request.setAttribute(CONTEXT_ATTRIBUTE_NAME, context);
    }

    public SecurityContext getSecurityContext(HttpServletRequest request) {
        return (SecurityContext)request.getAttribute(CONTEXT_ATTRIBUTE_NAME);
    }
}
