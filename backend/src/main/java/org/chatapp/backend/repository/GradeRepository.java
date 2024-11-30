
package org.chatapp.backend.repository;

import org.chatapp.backend.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade, Long> {
}