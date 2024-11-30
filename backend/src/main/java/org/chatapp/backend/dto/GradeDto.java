package org.chatapp.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GradeDto {
    @NotBlank
    private String courseName;

    @DecimalMin(value = "0.0", message = "Grade must be between 0 and 20")
    @DecimalMax(value = "20.0", message = "Grade must be between 0 and 20")
    private Double value;

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }
}