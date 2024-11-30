
package org.chatapp.backend.service.impl;

import org.chatapp.backend.dto.GradeDto;
import org.chatapp.backend.dto.StudentDto;
import org.chatapp.backend.model.Grade;
import org.chatapp.backend.model.Student;
import org.chatapp.backend.repository.GradeRepository;
import org.chatapp.backend.repository.StudentRepository;
import org.chatapp.backend.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public StudentServiceImpl(StudentRepository studentRepository, GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
    }

    @Override
    @Transactional
    public Student createStudent(StudentDto studentDto) {
        Student student = new Student();
        student.setName(studentDto.getName());
        return studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentWithGrades(Long id) {
        return studentRepository.findByIdWithGrades(id);
    }

    @Override
    @Transactional
    public Grade addGrade(Long studentId, GradeDto gradeDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));

        Grade grade = new Grade();
        grade.setStudent(student);
        grade.setCourseName(gradeDto.getCourseName());
        grade.setValue(gradeDto.getValue());

        return gradeRepository.save(grade);
    }
}