package com.mycompany.school.repository;

import com.mycompany.school.domain.Home;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Home entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HomeRepository extends JpaRepository<Home, Long> {}
