package com.mqplayer.api.web.models;

import com.mqplayer.api.domain.entities.Record;

/**
 * @author akravets
 */
public class RecordModel {
    private String service;
    private String id;
    private String name;
    private String url;

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
