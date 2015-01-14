package com.mqplayer.web.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author akravets
 */
@RestController
@RequestMapping("/playlists")
public class PlaylistController {

    @RequestMapping
    public String get() {
        return "index";
    }
}
