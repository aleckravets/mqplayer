package com.mqplayer.web.app.security;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author akravets
 */
public class SecurityHelper {
    private static final String UNAUTHORIZED_JSON = "{\"error\":\"Unauthorized.\"}";
    private static final String FORBIDDEN_JSON = "{\"error\":\"Forbidden.\"}";

    public static void unauthorized(HttpServletResponse response) throws IOException {
        writeResponse(response, HttpServletResponse.SC_UNAUTHORIZED, UNAUTHORIZED_JSON);
    }

    public static void forbidden(HttpServletResponse response) throws IOException {
        writeResponse(response, HttpServletResponse.SC_FORBIDDEN, FORBIDDEN_JSON);
    }

    private static void writeResponse(HttpServletResponse response, int status, String text) throws IOException {
        response.setContentType("application/json");
        response.setStatus(status);
        PrintWriter out = response.getWriter();
        out.print(text);
        out.flush();
        out.close();
    }
}
