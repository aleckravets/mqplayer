package com.mqplayer.api.domain.dto;

import com.mqplayer.api.domain.entities.Playlist;

/**
 * @author akravets
 */
public class PlaylistDto {
    private long id;
    private String name;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public static PlaylistDto map(Playlist playlist) {
        PlaylistDto model = new PlaylistDto();
        model.setId(playlist.getId());
        model.setName(playlist.getName());
        return model;
    }
}
