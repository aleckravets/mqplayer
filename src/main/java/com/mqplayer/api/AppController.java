package com.mqplayer.api;

import com.mqplayer.api.db.PlaylistDao;
import com.mqplayer.api.domain.Playlist;
import com.mqplayer.api.domain.User;
import com.mqplayer.api.security.SecurityContext;
import com.mqplayer.api.security.SecurityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

/**
 * @author akravets
 */
@RestController
public class AppController {
    @Autowired
    private SecurityManager securityManager;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Autowired
    private PlaylistDao playlistDao;

    private SecurityContext getSecurityContext() {
        return securityManager.getSecurityContext(httpServletRequest);
    }

    @RequestMapping(value = "/playlists", method = RequestMethod.GET)
    public List<Playlist> getPlaylists() {
        User user = getSecurityContext().getUser();
        return playlistDao.getAll(user.getId());
    }

    @RequestMapping("/token")
    @ResponseStatus(HttpStatus.OK)
    public void registerToken(@RequestParam String service, @RequestParam String token) throws IOException {
        securityManager.registerToken(getSecurityContext(), service, token);
    }
}
