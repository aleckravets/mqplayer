package com.mqplayer.web.app;

import com.mqplayer.web.app.clients.Client;
import com.mqplayer.web.app.clients.DriveClient;
import com.mqplayer.web.app.clients.DropboxClient;
import com.mqplayer.web.app.db.Db;
import com.mqplayer.web.app.domain.Account;
import com.mqplayer.web.app.domain.AppException;
import com.mqplayer.web.app.domain.Playlist;
import com.mqplayer.web.app.domain.User;
import com.mqplayer.web.app.security.SecurityContext;
import com.mqplayer.web.app.security.SecurityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * @author akravets
 */
@RestController
public class AppController {
    @Autowired
    private Db db;

    @Autowired
    private SecurityManager securityManager;

    @Autowired
    private HttpServletRequest httpServletRequest;

    private SecurityContext getSecurityContext() {
        return securityManager.getSecurityContext(httpServletRequest);
    }

    @RequestMapping("/playlists")
    public List<Playlist> getPlaylists() {
        User user = getSecurityContext().getUser();
        return db.getPlaylists(user.getId());
    }

    @RequestMapping("/test")
    public Object test() throws IOException {
        DropboxClient client = new DropboxClient();
        return client.getEmailByToken("mazYxVq5DKQAAAAAAAAK0qEFXjlWyx2CNyYXqx7F76W0B49eKIoPstQhSz-wVQRI");
    }

    @RequestMapping("/token")
    @ResponseStatus(HttpStatus.OK)
    public void registerToken(@RequestParam String service) {
        Client client = Client.resolve(service);

        Map<String, String> tokens = getSecurityContext().getTokens();
        User currentUser = getSecurityContext().getUser();

        if (!tokens.containsKey(service)) {
            throw new AppException(String.format("Unknown service (%s)", service));
        }

        String token = tokens.get(service);

        try {
            // get $account from db by token
            // if $account == null
                // get email from service
                // get $account from db by email
                // update token

            // if $account != null
                // get user by $account
                // if there is current user
                    // if current user <> token's user
                    // merge accounts
                // else
                    // put token's user to security context
            // else
                // if there is no current user
                    // create new user and put it to security context
                // create new $account
                // assign new $account to current user


            User tokenUser = db.getUserByToken(service, token);

            if (tokenUser == null) {

                String email = client.getEmailByToken(tokens.get(service));
                Account account = db.getAccountByEmail(service, email);

            }

            if (account != null) {
                email = account.getEmail();
            }
            else {

            }

            if (db.updateToken(email, token)) {
                // re-assign user's account (found by token) to the currently logged in user
                User tokenUser = db.getUserByToken(service, token);
                if (!tokenUser.equals(currentUser)) {
                    db.mergeUsers(currentUser, tokenUser);
                }
            } else {
                if (currentUser == null) {
                    currentUser = new User();
                    db.addUser(currentUser);
                    getSecurityContext().setUser(currentUser);
                }
                db.addAccount(new Account(service, email, token, currentUser.getId()));
            }
        }
        catch (IOException exception) {
            throw new AppException("Failed to validate token");
        }
    }
}
