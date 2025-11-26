package com.dam17.inventrium.exception;

public class CompanyNotFoundException extends RuntimeException {
    public CompanyNotFoundException(String cui) {
        super("The company with the CUI: " + cui + " does not exist in our records!");
    }
}
