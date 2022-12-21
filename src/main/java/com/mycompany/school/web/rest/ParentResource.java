package com.mycompany.school.web.rest;

import com.mycompany.school.domain.Parent;
import com.mycompany.school.repository.ParentRepository;
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
 * REST controller for managing {@link com.mycompany.school.domain.Parent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParentResource {

    private final Logger log = LoggerFactory.getLogger(ParentResource.class);

    private static final String ENTITY_NAME = "parent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParentRepository parentRepository;

    public ParentResource(ParentRepository parentRepository) {
        this.parentRepository = parentRepository;
    }

    /**
     * {@code POST  /parents} : Create a new parent.
     *
     * @param parent the parent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parent, or with status {@code 400 (Bad Request)} if the parent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parents")
    public ResponseEntity<Parent> createParent(@Valid @RequestBody Parent parent) throws URISyntaxException {
        log.debug("REST request to save Parent : {}", parent);
        if (parent.getId() != null) {
            throw new BadRequestAlertException("A new parent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Parent result = parentRepository.save(parent);
        return ResponseEntity
            .created(new URI("/api/parents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parents/:id} : Updates an existing parent.
     *
     * @param id the id of the parent to save.
     * @param parent the parent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parent,
     * or with status {@code 400 (Bad Request)} if the parent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parents/{id}")
    public ResponseEntity<Parent> updateParent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Parent parent
    ) throws URISyntaxException {
        log.debug("REST request to update Parent : {}, {}", id, parent);
        if (parent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Parent result = parentRepository.save(parent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parents/:id} : Partial updates given fields of an existing parent, field will ignore if it is null
     *
     * @param id the id of the parent to save.
     * @param parent the parent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parent,
     * or with status {@code 400 (Bad Request)} if the parent is not valid,
     * or with status {@code 404 (Not Found)} if the parent is not found,
     * or with status {@code 500 (Internal Server Error)} if the parent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Parent> partialUpdateParent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Parent parent
    ) throws URISyntaxException {
        log.debug("REST request to partial update Parent partially : {}, {}", id, parent);
        if (parent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Parent> result = parentRepository
            .findById(parent.getId())
            .map(existingParent -> {
                if (parent.getName() != null) {
                    existingParent.setName(parent.getName());
                }
                if (parent.getEmail() != null) {
                    existingParent.setEmail(parent.getEmail());
                }
                if (parent.getPhone() != null) {
                    existingParent.setPhone(parent.getPhone());
                }

                return existingParent;
            })
            .map(parentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parent.getId().toString())
        );
    }

    /**
     * {@code GET  /parents} : get all the parents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parents in body.
     */
    @GetMapping("/parents")
    public List<Parent> getAllParents() {
        log.debug("REST request to get all Parents");
        return parentRepository.findAll();
    }

    /**
     * {@code GET  /parents/:id} : get the "id" parent.
     *
     * @param id the id of the parent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parents/{id}")
    public ResponseEntity<Parent> getParent(@PathVariable Long id) {
        log.debug("REST request to get Parent : {}", id);
        Optional<Parent> parent = parentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parent);
    }

    /**
     * {@code DELETE  /parents/:id} : delete the "id" parent.
     *
     * @param id the id of the parent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parents/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        log.debug("REST request to delete Parent : {}", id);
        parentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
