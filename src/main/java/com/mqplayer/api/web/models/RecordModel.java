package com.mqplayer.api.web.models;

import com.mqplayer.api.domain.entities.Record;

/**
 * @author akravets
 */
public class RecordModel {
    private String name;
    private String url;

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

    public static RecordModel map(Record record) {
        RecordModel model = new RecordModel();
        model.setName(record.getName());
        model.setUrl(record.getUrl());
        return model;
    }
}
