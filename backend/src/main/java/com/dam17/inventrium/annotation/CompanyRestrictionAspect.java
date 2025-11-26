package com.dam17.inventrium.annotation;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.HandlerMapping;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dam17.inventrium.security.SecurityConstants;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.file.AccessDeniedException;
import java.util.Map;

@Aspect
@Component
public class CompanyRestrictionAspect {
    private final String secretKey;

    public CompanyRestrictionAspect(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = secretKey;
    }

    @Around("@annotation(companyRestricted)")
    public Object checkCompanyAccess(ProceedingJoinPoint joinPoint, CompanyRestricted companyRestricted) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");
        DecodedJWT jwt = JWT.require(Algorithm.HMAC512(secretKey)).build().verify(token);
        Long userCompanyId = jwt.getClaim("companyId").asLong();

        // Get path variables directly from the request
        @SuppressWarnings("unchecked")
        Map<String, String> pathVariables =
            (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);

        String companyIdStr = pathVariables.get(companyRestricted.companyIdParam());
        Long targetCompanyId = companyIdStr != null ? Long.valueOf(companyIdStr) : null;

        if (userCompanyId == null || !userCompanyId.equals(targetCompanyId)) {
            throw new AccessDeniedException(
                "Access denied: cross-company access is forbidden. JWT companyId=" + userCompanyId +
                ", Path companyId=" + targetCompanyId
            );
        }

        return joinPoint.proceed();
    }
}