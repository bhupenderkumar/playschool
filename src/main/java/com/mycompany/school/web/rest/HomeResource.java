package com.mycompany.school.web.rest;

import com.mycompany.school.domain.Home;
import com.mycompany.school.repository.HomeRepository;
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
 * REST controller for managing {@link com.mycompany.school.domain.Home}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HomeResource {

    private final Logger log = LoggerFactory.getLogger(HomeResource.class);

    private static final String ENTITY_NAME = "home";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HomeRepository homeRepository;

    public HomeResource(HomeRepository homeRepository) {
        this.homeRepository = homeRepository;
    }

    /**
     * {@code POST  /homes} : Create a new home.
     *
     * @param home the home to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new home, or with status {@code 400 (Bad Request)} if the home has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/homes")
    public ResponseEntity<Home> createHome(@Valid @RequestBody Home home) throws URISyntaxException {
        log.debug("REST request to save Home : {}", home);
        if (home.getId() != null) {
            throw new BadRequestAlertException("A new home cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Home result = homeRepository.save(home);
        return ResponseEntity
            .created(new URI("/api/homes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /homes/:id} : Updates an existing home.
     *
     * @param id the id of the home to save.
     * @param home the home to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated home,
     * or with status {@code 400 (Bad Request)} if the home is not valid,
     * or with status {@code 500 (Internal Server Error)} if the home couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/homes/{id}")
    public ResponseEntity<Home> updateHome(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Home home)
        throws URISyntaxException {
        log.debug("REST request to update Home : {}, {}", id, home);
        if (home.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, home.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!homeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Home result = homeRepository.save(home);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, home.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /homes/:id} : Partial updates given fields of an existing home, field will ignore if it is null
     *
     * @param id the id of the home to save.
     * @param home the home to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated home,
     * or with status {@code 400 (Bad Request)} if the home is not valid,
     * or with status {@code 404 (Not Found)} if the home is not found,
     * or with status {@code 500 (Internal Server Error)} if the home couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/homes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Home> partialUpdateHome(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Home home
    ) throws URISyntaxException {
        log.debug("REST request to partial update Home partially : {}, {}", id, home);
        if (home.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, home.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!homeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Home> result = homeRepository
            .findById(home.getId())
            .map(existingHome -> {
                if (home.getDescription() != null) {
                    existingHome.setDescription(home.getDescription());
                }
                if (home.getSliders() != null) {
                    existingHome.setSliders(home.getSliders());
                }
                if (home.getSlidersContentType() != null) {
                    existingHome.setSlidersContentType(home.getSlidersContentType());
                }

                return existingHome;
            })
            .map(homeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, home.getId().toString())
        );
    }

    /**
     * {@code GET  /homes} : get all the homes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of homes in body.
     */
    @GetMapping("/homes")
    public List<Home> getAllHomes() {
        log.debug("REST request to get all Homes");
        return homeRepository.findAll();
    }

    /**
     * {@code GET  /homes/:id} : get the "id" home.
     *
     * @param id the id of the home to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the home, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/homes/{id}")
    public ResponseEntity<Home> getHome(@PathVariable Long id) {
        log.debug("REST request to get Home : {}", id);
        Optional<Home> home = homeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(home);
    }

    /**
     * {@code DELETE  /homes/:id} : delete the "id" home.
     *
     * @param id the id of the home to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/homes/{id}")
    public ResponseEntity<Void> deleteHome(@PathVariable Long id) {
        log.debug("REST request to delete Home : {}", id);
        homeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
