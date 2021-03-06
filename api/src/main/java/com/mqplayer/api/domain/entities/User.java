package com.mqplayer.api.domain.entities;

public class User {
    private long id;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean equals(User user) {
        return user != null && user.getId() == getId();
    }
}
