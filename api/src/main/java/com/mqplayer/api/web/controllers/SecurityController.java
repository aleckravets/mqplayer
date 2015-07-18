package com.mqplayer.api.web.controllers;

import com.mqplayer.api.security.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * @author akravets
 */
@RestController
public class SecurityController {
    @Autowired
    private com.mqplayer.api.security.SecurityManager securityManager;

    @RequestMapping(value = "/token", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public void registerToken(@RequestParam String service, @RequestParam String token) throws IOException {
        securityManager.registerToken(service, token);
    }

    @RequestMapping(value = "/token", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public long registerToken(@RequestBody Token token) throws IOException {
        return securityManager.registerToken(token.getService(), token.getToken());
    }
}
