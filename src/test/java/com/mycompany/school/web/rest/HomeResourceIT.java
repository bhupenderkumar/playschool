package com.mycompany.school.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.school.IntegrationTest;
import com.mycompany.school.domain.Home;
import com.mycompany.school.repository.HomeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link HomeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HomeResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_SLIDERS = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SLIDERS = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SLIDERS_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SLIDERS_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/homes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HomeRepository homeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHomeMockMvc;

    private Home home;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Home createEntity(EntityManager em) {
        Home home = new Home().description(DEFAULT_DESCRIPTION).sliders(DEFAULT_SLIDERS).slidersContentType(DEFAULT_SLIDERS_CONTENT_TYPE);
        return home;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Home createUpdatedEntity(EntityManager em) {
        Home home = new Home().description(UPDATED_DESCRIPTION).sliders(UPDATED_SLIDERS).slidersContentType(UPDATED_SLIDERS_CONTENT_TYPE);
        return home;
    }

    @BeforeEach
    public void initTest() {
        home = createEntity(em);
    }

    @Test
    @Transactional
    void createHome() throws Exception {
        int databaseSizeBeforeCreate = homeRepository.findAll().size();
        // Create the Home
        restHomeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(home)))
            .andExpect(status().isCreated());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeCreate + 1);
        Home testHome = homeList.get(homeList.size() - 1);
        assertThat(testHome.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testHome.getSliders()).isEqualTo(DEFAULT_SLIDERS);
        assertThat(testHome.getSlidersContentType()).isEqualTo(DEFAULT_SLIDERS_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createHomeWithExistingId() throws Exception {
        // Create the Home with an existing ID
        home.setId(1L);

        int databaseSizeBeforeCreate = homeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHomeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(home)))
            .andExpect(status().isBadRequest());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeRepository.findAll().size();
        // set the field null
        home.setDescription(null);

        // Create the Home, which fails.

        restHomeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(home)))
            .andExpect(status().isBadRequest());

        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHomes() throws Exception {
        // Initialize the database
        homeRepository.saveAndFlush(home);

        // Get all the homeList
        restHomeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(home.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].slidersContentType").value(hasItem(DEFAULT_SLIDERS_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].sliders").value(hasItem(Base64Utils.encodeToString(DEFAULT_SLIDERS))));
    }

    @Test
    @Transactional
    void getHome() throws Exception {
        // Initialize the database
        homeRepository.saveAndFlush(home);

        // Get the home
        restHomeMockMvc
            .perform(get(ENTITY_API_URL_ID, home.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(home.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.slidersContentType").value(DEFAULT_SLIDERS_CONTENT_TYPE))
            .andExpect(jsonPath("$.sliders").value(Base64Utils.encodeToString(DEFAULT_SLIDERS)));
    }

    @Test
    @Transactional
    void getNonExistingHome() throws Exception {
        // Get the home
        restHomeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHome() throws Exception {
        // Initialize the database
        homeRepository.saveAndFlush(home);

        int databaseSizeBeforeUpdate = homeRepository.findAll().size();

        // Update the home
        Home updatedHome = homeRepository.findById(home.getId()).get();
        // Disconnect from session so that the updates on updatedHome are not directly saved in db
        em.detach(updatedHome);
        updatedHome.description(UPDATED_DESCRIPTION).sliders(UPDATED_SLIDERS).slidersContentType(UPDATED_SLIDERS_CONTENT_TYPE);

        restHomeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHome.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHome))
            )
            .andExpect(status().isOk());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
        Home testHome = homeList.get(homeList.size() - 1);
        assertThat(testHome.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testHome.getSliders()).isEqualTo(UPDATED_SLIDERS);
        assertThat(testHome.getSlidersContentType()).isEqualTo(UPDATED_SLIDERS_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingHome() throws Exception {
        int databaseSizeBeforeUpdate = homeRepository.findAll().size();
        home.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHomeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, home.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(home))
            )
            .andExpect(status().isBadRequest());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHome() throws Exception {
        int databaseSizeBeforeUpdate = homeRepository.findAll().size();
        home.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHomeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(home))
            )
            .andExpect(status().isBadRequest());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHome() throws Exception {
        int databaseSizeBeforeUpdate = homeRepository.findAll().size();
        home.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHomeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(home)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHomeWithPatch() throws Exception {
        // Initialize the database
        homeRepository.saveAndFlush(home);

        int databaseSizeBeforeUpdate = homeRepository.findAll().size();

        // Update the home using partial update
        Home partialUpdatedHome = new Home();
        partialUpdatedHome.setId(home.getId());

        partialUpdatedHome.sliders(UPDATED_SLIDERS).slidersContentType(UPDATED_SLIDERS_CONTENT_TYPE);

        restHomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHome.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHome))
            )
            .andExpect(status().isOk());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
        Home testHome = homeList.get(homeList.size() - 1);
        assertThat(testHome.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testHome.getSliders()).isEqualTo(UPDATED_SLIDERS);
        assertThat(testHome.getSlidersContentType()).isEqualTo(UPDATED_SLIDERS_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateHomeWithPatch() throws Exception {
        // Initialize the database
        homeRepository.saveAndFlush(home);

        int databaseSizeBeforeUpdate = homeRepository.findAll().size();

        // Update the home using partial update
        Home partialUpdatedHome = new Home();
        partialUpdatedHome.setId(home.getId());

        partialUpdatedHome.description(UPDATED_DESCRIPTION).sliders(UPDATED_SLIDERS).slidersContentType(UPDATED_SLIDERS_CONTENT_TYPE);

        restHomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHome.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHome))
            )
            .andExpect(status().isOk());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
        Home testHome = homeList.get(homeList.size() - 1);
        assertThat(testHome.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testHome.getSliders()).isEqualTo(UPDATED_SLIDERS);
        assertThat(testHome.getSlidersContentType()).isEqualTo(UPDATED_SLIDERS_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingHome() throws Exception {
        int databaseSizeBeforeUpdate = homeRepository.findAll().size();
        home.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, home.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(home))
            )
            .andExpect(status().isBadRequest());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHome() throws Exception {
        int databaseSizeBeforeUpdate = homeRepository.findAll().size();
        home.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHomeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(home))
            )
            .andExpect(status().isBadRequest());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHome() throws Exception {
        int databaseSizeBeforeUpdate = homeRepository.findAll().size();
        home.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHomeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(home)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Home in the database
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHome() throws Exception {
        // Initialize the database
        homeRepository.saveAndFlush(home);

        int databaseSizeBeforeDelete = homeRepository.findAll().size();

        // Delete the home
        restHomeMockMvc
            .perform(delete(ENTITY_API_URL_ID, home.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Home> homeList = homeRepository.findAll();
        assertThat(homeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
