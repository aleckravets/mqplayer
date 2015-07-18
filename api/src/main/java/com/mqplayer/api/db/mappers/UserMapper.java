package com.mqplayer.api.db.mappers;

import com.mqplayer.api.domain.entities.User;

public class UserMapper extends BaseMapper<User> {

    public UserMapper() {
        super(User.class, "user");
    }

}
