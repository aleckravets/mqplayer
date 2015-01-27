package com.mqplayer.web.app.security;

import com.mqplayer.web.app.db.Db;
import com.mqplayer.web.app.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

/**
 * @author akravets
 */
@Service
public class SecurityManager {
    private final String UNAUTHORIZED_JSON = "{\"error\":\"Unauthorized\"}";
    private final String CONTENT_TYPE = "application/json";
    private final String CONTEXT_ATTRIBUTE_NAME = "securityContext";

    @Autowired
    private Db db;

    /**
     * Authorize the request by tokens
     * @param tokens
     * @return
     */
    public boolean tryAuthorize(SecurityContext securityContext, Map<String, String> tokens) {
        securityContext.setTokens(tokens);

        for (Map.Entry<String, String> entry : tokens.entrySet()) {
            User user = db.getUserByToken(entry.getKey(), entry.getValue());

            if (user != null) {
                securityContext.setUser(user);
                break;
            }
        }

        return securityContext.getUser() != null;
    }

    public void setSecurityContext(HttpServletRequest request, SecurityContext context) {
        request.setAttribute(CONTEXT_ATTRIBUTE_NAME, context);
    }

    public SecurityContext getSecurityContext(HttpServletRequest request) {
        return (SecurityContext)request.getAttribute(CONTEXT_ATTRIBUTE_NAME);
    }

    public void unauthorized(HttpServletResponse response) throws IOException {
        writeResponse(response, HttpServletResponse.SC_UNAUTHORIZED, UNAUTHORIZED_JSON);
    }

    private void writeResponse(HttpServletResponse response, int status, String text) throws IOException {
        response.setContentType(CONTENT_TYPE);
        response.setStatus(status);
        PrintWriter out = response.getWriter();
        out.print(text);
        out.flush();
        out.close();
    }
}
