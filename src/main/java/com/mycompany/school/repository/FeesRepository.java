package com.mycompany.school.repository;

import com.mycompany.school.domain.Fees;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Fees entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeesRepository extends JpaRepository<Fees, Long> {}
