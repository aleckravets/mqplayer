package com.mqplayer.api.web;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import com.mqplayer.api.exceptions.*;
/**
 * @author akravets
 */
@ControllerAdvice
public class ExceptionHandlers extends ResponseEntityExceptionHandler {

    /**
     * Handle standard Spring MVC exceptions, see base method for details
     */
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return getResponse(ex, headers, status);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity authenticationExceptionHandler(Exception exception) {
        return getResponse(exception, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity authorizationExceptionHandler(Exception exception) {
        return getResponse(exception, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity notFoundExceptionHandler(NotFoundException exception) {
        return getResponse(exception, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity appExceptionHandler(AppException exception) {
        return getResponse(exception, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity defaultExceptionHandler(Exception exception) {
        exception.printStackTrace();
        return new ResponseEntity(new ErrorInfo("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity getResponse(Exception exception, HttpStatus httpStatus) {
        return getResponse(exception, null, httpStatus);
    }

    private ResponseEntity getResponse(Exception exception, HttpHeaders headers, HttpStatus httpStatus) {
        return new ResponseEntity(new ErrorInfo(exception, httpStatus), headers, httpStatus);
    }

    public class ErrorInfo {
        private int status;
        private String error;

        public ErrorInfo(String error, HttpStatus httpStatus) {
            this.status = httpStatus.value();
            this.error = error;
        }

        public ErrorInfo(Exception exception, HttpStatus httpStatus) {
            this(exception.getLocalizedMessage(), httpStatus);
        }

        public int getStatus() {
            return status;
        }

        public String getError() {
            return error;
        }
    }
}
