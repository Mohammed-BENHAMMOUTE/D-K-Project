
package org.chatapp.backend.service;

import java.util.List;

import org.chatapp.backend.dto.GradeDto;
import org.chatapp.backend.dto.StudentDto;
import org.chatapp.backend.model.Grade;
import org.chatapp.backend.model.Student;

public interface StudentService {
    StudentDto createStudent(StudentDto studentDto);
    List<StudentDto> getAllStudents();
    Student getStudentWithGrades(Long id);
    Grade addGrade(Long studentId, GradeDto gradeDto);
}