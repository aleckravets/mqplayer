package com.mqplayer.api.domain.entities;

/**
 * @author akravets
 */
public class Record {
    private String service;
    private String id;
    private String name;
    private String url;
    private long playlistId;

    public Record() {
    }

    public Record(String service, String id, String name, String url, long playlistId) {
        this.service = service;
        this.id = id;
        this.name = name;
        this.url = url;
        this.playlistId = playlistId;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
