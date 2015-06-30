package com.mqplayer.api.security;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mqplayer.api.exceptions.AppException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (StringUtils.isNotBlank(authHeader)) {
            securityManager.authenticate(parseTokens(authHeader));
        }

        return true;
    }

    private List<Token> parseTokens(String authorizationString) throws IOException {
        try {
            Map<String, String> tokensMap = jsonMapper.readValue(authorizationString, Map.class);
            List<Token> tokens = new ArrayList<>();
            for (Map.Entry<String, String> entry : tokensMap.entrySet()) {
                tokens.add(new Token(entry.getKey(), entry.getValue()));
            }
            return tokens;
        }
        catch (JsonMappingException exception) {
            throw new AppException(PARSE_ERROR);
        }
        catch (JsonParseException exception) {
            throw new AppException(PARSE_ERROR);
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
