package com.mqplayer.web.app;

import com.mqplayer.web.app.db.Db;
import com.mqplayer.web.app.domain.Playlist;
import com.mqplayer.web.app.domain.User;
import com.mqplayer.web.app.security.SecurityContext;
import com.mqplayer.web.app.security.SecurityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

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

    @RequestMapping("/token")
    public void registerToken(@RequestParam String service) {
        // get email by token
        // update account's token by email
        // merge users
    }
}
