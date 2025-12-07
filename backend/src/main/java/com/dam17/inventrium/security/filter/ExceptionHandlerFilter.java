package com.dam17.inventrium.security.filter;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.dam17.inventrium.exception.EntityNotFoundException;
import com.dam17.inventrium.exception.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class ExceptionHandlerFilter extends OncePerRequestFilter {

    private final ObjectMapper mapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (EntityNotFoundException e) {
            writeErrorResponse(response, HttpServletResponse.SC_NOT_FOUND, List.of("Username doesn't exist"));
        } catch (JWTVerificationException e) {
            writeErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, List.of("Invalid or expired token. Please log in again."));
        } catch (RuntimeException e) {
            e.printStackTrace();
            writeErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, List.of("Bad request"));
        }
    }

    private void writeErrorResponse(HttpServletResponse response, int status, List<String> messages) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        ErrorResponse error = new ErrorResponse(messages);
        response.getWriter().write(mapper.writeValueAsString(error));
        response.getWriter().flush();
    }
}
