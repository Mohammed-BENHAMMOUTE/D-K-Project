
package org.chatapp.backend.repository;

import org.chatapp.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.grades WHERE s.id = ?1")
    Student findByIdWithGrades(Long id);
}