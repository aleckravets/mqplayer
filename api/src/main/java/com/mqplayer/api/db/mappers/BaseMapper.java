package com.mqplayer.api.db.mappers;

import java.beans.PropertyDescriptor;
import java.util.HashMap;
import java.util.Map;

public class BaseMapper<T> extends BeanPropertyRowMapper2<T> {

    public BaseMapper(Class<T> mappedClass) {
        super(mappedClass);
    }

    public BaseMapper(Class<T> mappedClass, String prefix) {
        super(mappedClass);
        init(prefix);
    }

    private void init(String prefix) {
        if (prefix != null) {
            Map<String, PropertyDescriptor> mappedFields = this.mappedFields;

            this.mappedFields = new HashMap<String, PropertyDescriptor>();

            for (Map.Entry<String, PropertyDescriptor> entry : mappedFields.entrySet()) {
                this.mappedFields.put(prefix + "_" + entry.getKey(), entry.getValue());
            }
        }
    }

}
