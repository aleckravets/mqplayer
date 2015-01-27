package com.mqplayer.web.app.security;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author akravets
 */
public class SecurityFilter implements Filter {
    private WebApplicationContext springContext;
    private SecurityManager securityManager;
    private ObjectMapper objectMapper;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        springContext = WebApplicationContextUtils.getWebApplicationContext(filterConfig.getServletContext());
        securityManager = springContext.getBean(SecurityManager.class);
        objectMapper = springContext.getBean(ObjectMapper.class);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;

        SecurityContext securityContext = new SecurityContext();

        securityManager.setSecurityContext(httpServletRequest, securityContext);

        Map<String, String> tokens = parseTokens(httpServletRequest.getHeader("authorization"));

        if (tokens != null)
            securityManager.tryAuthorize(securityContext, tokens);

        // no authorization for token registration
        String path = httpServletRequest.getRequestURI();
        if (!path.startsWith("/token")) {
            if (securityContext.getUser() == null) {
                securityManager.unauthorized(httpServletResponse);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private Map<String, String> parseTokens(String authorizationString) throws IOException {
        Map<String, String> tokens = null;

        if (authorizationString == null) {
            return tokens;
        }

        try {
            tokens = objectMapper.readValue(authorizationString, Map.class);
        }
        catch(JsonParseException exception) {
            // todo: log authorization header
        }

        return tokens;
    }

    @Override
    public void destroy() {
    }
}
