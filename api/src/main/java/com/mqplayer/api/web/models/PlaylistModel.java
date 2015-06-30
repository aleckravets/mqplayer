package com.mqplayer.api.web.models;

import com.mqplayer.api.domain.entities.Playlist;

/**
 * @author akravets
 */
public class PlaylistModel {
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

    public static PlaylistModel map(Playlist playlist) {
        PlaylistModel model = new PlaylistModel();
        model.setId(playlist.getId());
        model.setName(playlist.getName());
        return model;
    }
}
