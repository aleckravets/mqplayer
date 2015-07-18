package com.mqplayer.api.db.mappers;

import com.mqplayer.api.domain.entities.Record;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RecordMapper extends BaseMapper<Record> {

    public RecordMapper() {
        super(Record.class, "record");
    }

    @Override
    public Record mapRow(ResultSet rs, int rowNum) throws SQLException {
        Record entity = super.mapRow(rs, rowNum);

        AccountMapper accountMapper = new AccountMapper();
        entity.setAccount(accountMapper.mapRow(rs, rowNum));

        return entity;
    }
}
