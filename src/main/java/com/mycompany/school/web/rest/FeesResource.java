package com.mycompany.school.web.rest;

import com.mycompany.school.domain.Fees;
import com.mycompany.school.repository.FeesRepository;
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
 * REST controller for managing {@link com.mycompany.school.domain.Fees}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FeesResource {

    private final Logger log = LoggerFactory.getLogger(FeesResource.class);

    private static final String ENTITY_NAME = "fees";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FeesRepository feesRepository;

    public FeesResource(FeesRepository feesRepository) {
        this.feesRepository = feesRepository;
    }

    /**
     * {@code POST  /fees} : Create a new fees.
     *
     * @param fees the fees to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fees, or with status {@code 400 (Bad Request)} if the fees has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fees")
    public ResponseEntity<Fees> createFees(@Valid @RequestBody Fees fees) throws URISyntaxException {
        log.debug("REST request to save Fees : {}", fees);
        if (fees.getId() != null) {
            throw new BadRequestAlertException("A new fees cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fees result = feesRepository.save(fees);
        return ResponseEntity
            .created(new URI("/api/fees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fees/:id} : Updates an existing fees.
     *
     * @param id the id of the fees to save.
     * @param fees the fees to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fees,
     * or with status {@code 400 (Bad Request)} if the fees is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fees couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fees/{id}")
    public ResponseEntity<Fees> updateFees(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Fees fees)
        throws URISyntaxException {
        log.debug("REST request to update Fees : {}, {}", id, fees);
        if (fees.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fees.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fees result = feesRepository.save(fees);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fees.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fees/:id} : Partial updates given fields of an existing fees, field will ignore if it is null
     *
     * @param id the id of the fees to save.
     * @param fees the fees to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fees,
     * or with status {@code 400 (Bad Request)} if the fees is not valid,
     * or with status {@code 404 (Not Found)} if the fees is not found,
     * or with status {@code 500 (Internal Server Error)} if the fees couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fees/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Fees> partialUpdateFees(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Fees fees
    ) throws URISyntaxException {
        log.debug("REST request to partial update Fees partially : {}, {}", id, fees);
        if (fees.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fees.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fees> result = feesRepository
            .findById(fees.getId())
            .map(existingFees -> {
                if (fees.getAmount() != null) {
                    existingFees.setAmount(fees.getAmount());
                }
                if (fees.getDueDate() != null) {
                    existingFees.setDueDate(fees.getDueDate());
                }
                if (fees.getPaid() != null) {
                    existingFees.setPaid(fees.getPaid());
                }

                return existingFees;
            })
            .map(feesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fees.getId().toString())
        );
    }

    /**
     * {@code GET  /fees} : get all the fees.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fees in body.
     */
    @GetMapping("/fees")
    public List<Fees> getAllFees() {
        log.debug("REST request to get all Fees");
        return feesRepository.findAll();
    }

    /**
     * {@code GET  /fees/:id} : get the "id" fees.
     *
     * @param id the id of the fees to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fees, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fees/{id}")
    public ResponseEntity<Fees> getFees(@PathVariable Long id) {
        log.debug("REST request to get Fees : {}", id);
        Optional<Fees> fees = feesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fees);
    }

    /**
     * {@code DELETE  /fees/:id} : delete the "id" fees.
     *
     * @param id the id of the fees to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fees/{id}")
    public ResponseEntity<Void> deleteFees(@PathVariable Long id) {
        log.debug("REST request to delete Fees : {}", id);
        feesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
