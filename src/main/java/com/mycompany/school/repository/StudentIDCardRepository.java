package com.mycompany.school.repository;

import com.mycompany.school.domain.StudentIDCard;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StudentIDCard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudentIDCardRepository extends JpaRepository<StudentIDCard, Long> {}
