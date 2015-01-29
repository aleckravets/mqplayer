package com.mqplayer.api.models;

import java.util.List;

/**
 * @author akravets
 */
public class PlaylistEditModel {
    private String name;
    private List<RecordEditModel> records;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RecordEditModel> getRecords() {
        return records;
    }

    public void setRecords(List<RecordEditModel> records) {
        this.records = records;
    }
}
