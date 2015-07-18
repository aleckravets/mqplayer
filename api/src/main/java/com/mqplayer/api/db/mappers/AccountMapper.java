package com.mqplayer.api.db.mappers;

import com.mqplayer.api.domain.entities.Account;
import com.mqplayer.api.domain.entities.User;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AccountMapper extends BaseMapper<Account> {

    public AccountMapper() {
        super(Account.class, "account");
    }

    @Override
    public Account mapRow(ResultSet rs, int rowNum) throws SQLException {
        Account account = super.mapRow(rs, rowNum);
        UserMapper userMapper = new UserMapper();
        account.setUser(userMapper.mapRow(rs, rowNum));
        return account;
    }
}
