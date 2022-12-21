package com.mycompany.school.web.rest;

import com.mycompany.school.domain.StudentIDCard;
import com.mycompany.school.repository.StudentIDCardRepository;
import com.mycompany.school.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.school.domain.StudentIDCard}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StudentIDCardResource {

    private final Logger log = LoggerFactory.getLogger(StudentIDCardResource.class);

    private static final String ENTITY_NAME = "studentIDCard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentIDCardRepository studentIDCardRepository;

    public StudentIDCardResource(StudentIDCardRepository studentIDCardRepository) {
        this.studentIDCardRepository = studentIDCardRepository;
    }

    /**
     * {@code POST  /student-id-cards} : Create a new studentIDCard.
     *
     * @param studentIDCard the studentIDCard to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studentIDCard, or with status {@code 400 (Bad Request)} if the studentIDCard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/student-id-cards")
    public ResponseEntity<StudentIDCard> createStudentIDCard(@Valid @RequestBody StudentIDCard studentIDCard) throws URISyntaxException {
        log.debug("REST request to save StudentIDCard : {}", studentIDCard);
        if (studentIDCard.getId() != null) {
            throw new BadRequestAlertException("A new studentIDCard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StudentIDCard result = studentIDCardRepository.save(studentIDCard);
        return ResponseEntity
            .created(new URI("/api/student-id-cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /student-id-cards/:id} : Updates an existing studentIDCard.
     *
     * @param id the id of the studentIDCard to save.
     * @param studentIDCard the studentIDCard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentIDCard,
     * or with status {@code 400 (Bad Request)} if the studentIDCard is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studentIDCard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/student-id-cards/{id}")
    public ResponseEntity<StudentIDCard> updateStudentIDCard(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StudentIDCard studentIDCard
    ) throws URISyntaxException {
        log.debug("REST request to update StudentIDCard : {}, {}", id, studentIDCard);
        if (studentIDCard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentIDCard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentIDCardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StudentIDCard result = studentIDCardRepository.save(studentIDCard);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentIDCard.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /student-id-cards/:id} : Partial updates given fields of an existing studentIDCard, field will ignore if it is null
     *
     * @param id the id of the studentIDCard to save.
     * @param studentIDCard the studentIDCard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentIDCard,
     * or with status {@code 400 (Bad Request)} if the studentIDCard is not valid,
     * or with status {@code 404 (Not Found)} if the studentIDCard is not found,
     * or with status {@code 500 (Internal Server Error)} if the studentIDCard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/student-id-cards/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StudentIDCard> partialUpdateStudentIDCard(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StudentIDCard studentIDCard
    ) throws URISyntaxException {
        log.debug("REST request to partial update StudentIDCard partially : {}, {}", id, studentIDCard);
        if (studentIDCard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentIDCard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentIDCardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StudentIDCard> result = studentIDCardRepository
            .findById(studentIDCard.getId())
            .map(existingStudentIDCard -> {
                if (studentIDCard.getCardNumber() != null) {
                    existingStudentIDCard.setCardNumber(studentIDCard.getCardNumber());
                }
                if (studentIDCard.getIssueDate() != null) {
                    existingStudentIDCard.setIssueDate(studentIDCard.getIssueDate());
                }
                if (studentIDCard.getExpiryDate() != null) {
                    existingStudentIDCard.setExpiryDate(studentIDCard.getExpiryDate());
                }

                return existingStudentIDCard;
            })
            .map(studentIDCardRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentIDCard.getId().toString())
        );
    }

    /**
     * {@code GET  /student-id-cards} : get all the studentIDCards.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studentIDCards in body.
     */
    @GetMapping("/student-id-cards")
    public List<StudentIDCard> getAllStudentIDCards() {
        log.debug("REST request to get all StudentIDCards");
        return studentIDCardRepository.findAll();
    }

    /**
     * {@code GET  /student-id-cards/:id} : get the "id" studentIDCard.
     *
     * @param id the id of the studentIDCard to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studentIDCard, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/student-id-cards/{id}")
    public ResponseEntity<StudentIDCard> getStudentIDCard(@PathVariable Long id) {
        log.debug("REST request to get StudentIDCard : {}", id);
        Optional<StudentIDCard> studentIDCard = studentIDCardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(studentIDCard);
    }

    /**
     * {@code DELETE  /student-id-cards/:id} : delete the "id" studentIDCard.
     *
     * @param id the id of the studentIDCard to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/student-id-cards/{id}")
    public ResponseEntity<Void> deleteStudentIDCard(@PathVariable Long id) {
        log.debug("REST request to delete StudentIDCard : {}", id);
        studentIDCardRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
