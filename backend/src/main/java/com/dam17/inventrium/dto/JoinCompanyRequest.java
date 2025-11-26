package com.dam17.inventrium.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class JoinCompanyRequest {
    @NotBlank(message = "CUI is required")
    private String cui;

    @NotBlank(message = "Company authentication password is required")
    private String authPassword;
}
