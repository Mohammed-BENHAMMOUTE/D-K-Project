package org.chatapp.backend.dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentDto {
    private Long id; // Remove @NotBlank - not needed for id
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private LocalDateTime creationDate; // Remove @NotBlank - not needed for date
}