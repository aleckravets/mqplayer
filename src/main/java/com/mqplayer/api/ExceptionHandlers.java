package com.mqplayer.api;

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

    @ExceptionHandler(AppException.class)
    public ResponseEntity appExceptionHandler(AppException exception) {
        return getResponse(exception, HttpStatus.BAD_REQUEST);
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

        public ErrorInfo(Exception exception, HttpStatus httpStatus) {
            this.error = exception.getLocalizedMessage();
            this.status = httpStatus.value();
        }

        public int getStatus() {
            return status;
        }

        public String getError() {
            return error;
        }
    }
}
