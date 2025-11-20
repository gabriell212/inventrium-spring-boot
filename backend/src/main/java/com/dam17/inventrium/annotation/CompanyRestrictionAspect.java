package com.dam17.inventrium.annotation;

import java.nio.file.AccessDeniedException;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dam17.inventrium.security.SecurityConstants;

import jakarta.servlet.http.HttpServletRequest;

@Aspect
@Component
public class CompanyRestrictionAspect {
    private String secretKey;

    public CompanyRestrictionAspect(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = secretKey;
    }

    @Around("@annotation(companyRestricted)")
    public Object checkCompanyAccess(ProceedingJoinPoint joinPoint, CompanyRestricted companyRestricted) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");
        DecodedJWT jwt = JWT.require(Algorithm.HMAC512(secretKey)).build().verify(token);
        Long userCompanyId = jwt.getClaim("companyId").asLong();

        // Find the method argument that matches the annotation's companyIdParam
        Object[] args = joinPoint.getArgs();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = signature.getParameterNames();

        for (int i = 0; i < paramNames.length; i++) {
            if (paramNames[i].equals(companyRestricted.companyIdParam())) {
                Long targetCompanyId = (Long) args[i];
                if (!userCompanyId.equals(targetCompanyId)) {
                    throw new AccessDeniedException("Access denied: cross-company access is forbidden.");
                }
            }
        }

        return joinPoint.proceed();
    }
}
