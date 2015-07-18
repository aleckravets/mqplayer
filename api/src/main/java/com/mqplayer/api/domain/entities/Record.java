package com.mqplayer.api.domain.entities;

import com.mqplayer.api.db.annotations.Ignore;

/**
 * @author akravets
 */
public class Record {
    private String id;
    private String name;
    private String url;
    private Long accountId;
    private long playlistId;

    @Ignore
    private Account account;

    public Record() {
    }

    public Record(Long accountId, String id, String name, String url, long playlistId) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.accountId = accountId;
        this.playlistId = playlistId;
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

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public long getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(long playlistId) {
        this.playlistId = playlistId;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

}
