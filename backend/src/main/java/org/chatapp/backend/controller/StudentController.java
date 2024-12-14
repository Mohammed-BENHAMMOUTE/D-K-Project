package org.chatapp.backend.controller;
import jakarta.validation.Valid;
import org.chatapp.backend.dto.ApiResponse;
import org.chatapp.backend.dto.StudentDto;
import org.chatapp.backend.dto.GradeDto;
import org.chatapp.backend.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/students")
    public ResponseEntity<ApiResponse<?>> createStudent(@Valid @RequestBody StudentDto studentDto) {
        try {
            var savedStudentDto = studentService.createStudent(studentDto);
            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(savedStudentDto.getId())
                    .toUri();
            return ResponseEntity.created(location)
                    .body(ApiResponse.success(savedStudentDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error creating student: " + e.getMessage()));
        }
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<?>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success(studentService.getAllStudents()));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<?>> getStudentWithGrades(@PathVariable Long id) {
        var student = studentService.getStudentWithGrades(id);
        return student != null ?
                ResponseEntity.ok(ApiResponse.success(student)) :
                ResponseEntity.notFound().build();
    }

    @PostMapping("/students/{id}/grades")
    public ResponseEntity<ApiResponse<?>> addGrade(
            @PathVariable Long id,
            @Valid @RequestBody GradeDto gradeDto) {
        var savedGrade = studentService.addGrade(id, gradeDto);
        return ResponseEntity.ok(ApiResponse.success(savedGrade));
    }
}