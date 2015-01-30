package com.mqplayer.api.security;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mqplayer.api.exceptions.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

/**
 * @author akravets
 */
public class AuthenticationInterceptor implements HandlerInterceptor {
    private final String AUTHORIZATION_HEADER = "Authorization";
    private final String PARSE_ERROR = "Wrong authorization header format";

    @Autowired
    private ObjectMapper jsonMapper;

    @Autowired
    private SecurityManager securityManager;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Map<String, String> tokens = parseTokens(request.getHeader(AUTHORIZATION_HEADER));

        if (tokens != null)
            securityManager.authenticate(tokens);

        return true;
    }

    private Map<String, String> parseTokens(String authorizationString) throws IOException {
        Map<String, String> tokens = null;

        if (authorizationString == null) {
            return tokens;
        }

        try {
            tokens = jsonMapper.readValue(authorizationString, Map.class);
        }
        catch (JsonMappingException exception) {
            throw new AppException(PARSE_ERROR);
        }
        catch (JsonParseException exception) {
            throw new AppException(PARSE_ERROR);
        }

        return tokens;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
