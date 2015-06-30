package com.mqplayer.api.utils;

import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;

import java.util.ArrayList;
import java.util.List;

/**
 * @author akravets
 */
public class ObjectMapper extends DozerBeanMapper {
    public <T, U> List<U> map(final List<T> source, final Class<U> destType) {

        final List<U> dest = new ArrayList<>();

        for (T element : source) {
            dest.add(map(element, destType));
        }

        return dest;
    }
}
