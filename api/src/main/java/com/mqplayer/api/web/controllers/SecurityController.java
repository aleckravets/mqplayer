package com.mqplayer.api.web.controllers;

import com.mqplayer.api.domain.dto.AccountDto;
import com.mqplayer.api.domain.entities.Account;
import com.mqplayer.api.security.Token;
import com.mqplayer.api.utils.ObjectMapper;
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

    @Autowired
    private ObjectMapper objectMapper;

    @RequestMapping(value = "/token", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public void registerToken(@RequestParam String service, @RequestParam String token) throws IOException {
        securityManager.registerToken(service, token);
    }

    @RequestMapping(value = "/token", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public AccountDto registerToken(@RequestBody Token token) throws IOException {
        Account account = securityManager.registerToken(token.getService(), token.getToken());
        return objectMapper.map(account, AccountDto.class);
    }
}
