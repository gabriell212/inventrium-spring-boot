package com.dam17.inventrium;

import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.enums.RoleType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class UserValidationTest {

    private Validator validator;

    @BeforeEach
    public void setup() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    // Check if a valid user passes the validation test
    @Test
    public void testValidUserPassesValidation() {
        User user = new User("Gabriel", "Rotariu", "gabriell212", "rotariu576@gmail.com", "securepass", RoleType.PENDING);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.isEmpty(), "Expected no validation errors");
    }

    // Check if a blank user doesn't pass the validation test
    @Test
    public void testBlankFieldsFailValidation() {
        User user = new User();
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty(), "Expected validation errors for blank fields");

        violations.forEach(v -> System.out.println(v.getPropertyPath() + ": " + v.getMessage()));
    }

    // Check if a user with all valid fields except the password (which is blank) doesn't pass the validation test
    @Test
    public void testMissingPasswordFailsValidation() {
        User user = new User("Gabriel", "Rotariu", "gabriell212", "rotariu576@gmail.com", " ", RoleType.PENDING);
        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty());
    }
}