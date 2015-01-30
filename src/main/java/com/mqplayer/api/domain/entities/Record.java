package com.mqplayer.api.domain.entities;

/**
 * @author akravets
 */
public class Record {
    private long id;
    private String name;
    private String url;
    private long playlistId;

    public Record() {
    }

    public Record(String name, String url, long playlistId) {
        this.name = name;
        this.url = url;
        this.playlistId = playlistId;
    }

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
