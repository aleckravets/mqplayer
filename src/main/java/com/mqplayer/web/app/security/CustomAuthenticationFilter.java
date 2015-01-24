package com.mqplayer.web.app.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author akravets
 */
public class CustomAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    public CustomAuthenticationFilter() {
        // request filter determines whether this request should be processed by this filter
        super(new RequestMatcher() {
            @Override
            public boolean matches(HttpServletRequest request) {
                // process all request
                return true;
            }
        });

        // no redirect on successful login
        setAuthenticationSuccessHandler(new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                // do nothing
            }
        });

        // output JSON on failure (triggered by exception thrown within attemptAuthentication method)
        // see doFilter method of the base class
        setAuthenticationFailureHandler(new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
                SecurityHelper.unauthorized(response);
            }
        });
    }

    // constructs the Authentication object using data from request and passes it to authentication manager who is responsible
    // to check it and return the Authentication object filled with appropriate roles
    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws AuthenticationException, IOException, ServletException {
        Authentication checkMe = new UsernamePasswordAuthenticationToken("test", "test");
        return getAuthenticationManager().authenticate(checkMe);
    }

    // set successful Authentication object to security context and proceed with the chain
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);

        chain.doFilter(request, response);
    }
}
