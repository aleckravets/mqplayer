package com.mqplayer.api;

import com.mqplayer.api.db.Db;
import com.mqplayer.api.domain.Playlist;
import com.mqplayer.api.domain.User;
import com.mqplayer.api.security.SecurityContext;
import com.mqplayer.api.security.SecurityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

import com.mqplayer.api.exceptions.*;

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
    @ResponseStatus(HttpStatus.OK)
    public void registerToken(@RequestParam String service, @RequestParam String token) throws IOException {
        securityManager.registerToken(getSecurityContext(), service, token);
    }
}
