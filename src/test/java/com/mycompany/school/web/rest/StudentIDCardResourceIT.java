package com.mycompany.school.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.school.IntegrationTest;
import com.mycompany.school.domain.StudentIDCard;
import com.mycompany.school.repository.StudentIDCardRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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

/**
 * Integration tests for the {@link StudentIDCardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StudentIDCardResourceIT {

    private static final String DEFAULT_CARD_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_CARD_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_ISSUE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ISSUE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_EXPIRY_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EXPIRY_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/student-id-cards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StudentIDCardRepository studentIDCardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStudentIDCardMockMvc;

    private StudentIDCard studentIDCard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentIDCard createEntity(EntityManager em) {
        StudentIDCard studentIDCard = new StudentIDCard()
            .cardNumber(DEFAULT_CARD_NUMBER)
            .issueDate(DEFAULT_ISSUE_DATE)
            .expiryDate(DEFAULT_EXPIRY_DATE);
        return studentIDCard;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StudentIDCard createUpdatedEntity(EntityManager em) {
        StudentIDCard studentIDCard = new StudentIDCard()
            .cardNumber(UPDATED_CARD_NUMBER)
            .issueDate(UPDATED_ISSUE_DATE)
            .expiryDate(UPDATED_EXPIRY_DATE);
        return studentIDCard;
    }

    @BeforeEach
    public void initTest() {
        studentIDCard = createEntity(em);
    }

    @Test
    @Transactional
    void createStudentIDCard() throws Exception {
        int databaseSizeBeforeCreate = studentIDCardRepository.findAll().size();
        // Create the StudentIDCard
        restStudentIDCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentIDCard)))
            .andExpect(status().isCreated());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeCreate + 1);
        StudentIDCard testStudentIDCard = studentIDCardList.get(studentIDCardList.size() - 1);
        assertThat(testStudentIDCard.getCardNumber()).isEqualTo(DEFAULT_CARD_NUMBER);
        assertThat(testStudentIDCard.getIssueDate()).isEqualTo(DEFAULT_ISSUE_DATE);
        assertThat(testStudentIDCard.getExpiryDate()).isEqualTo(DEFAULT_EXPIRY_DATE);
    }

    @Test
    @Transactional
    void createStudentIDCardWithExistingId() throws Exception {
        // Create the StudentIDCard with an existing ID
        studentIDCard.setId(1L);

        int databaseSizeBeforeCreate = studentIDCardRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudentIDCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentIDCard)))
            .andExpect(status().isBadRequest());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCardNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = studentIDCardRepository.findAll().size();
        // set the field null
        studentIDCard.setCardNumber(null);

        // Create the StudentIDCard, which fails.

        restStudentIDCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentIDCard)))
            .andExpect(status().isBadRequest());

        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIssueDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = studentIDCardRepository.findAll().size();
        // set the field null
        studentIDCard.setIssueDate(null);

        // Create the StudentIDCard, which fails.

        restStudentIDCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentIDCard)))
            .andExpect(status().isBadRequest());

        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkExpiryDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = studentIDCardRepository.findAll().size();
        // set the field null
        studentIDCard.setExpiryDate(null);

        // Create the StudentIDCard, which fails.

        restStudentIDCardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentIDCard)))
            .andExpect(status().isBadRequest());

        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStudentIDCards() throws Exception {
        // Initialize the database
        studentIDCardRepository.saveAndFlush(studentIDCard);

        // Get all the studentIDCardList
        restStudentIDCardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(studentIDCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].cardNumber").value(hasItem(DEFAULT_CARD_NUMBER)))
            .andExpect(jsonPath("$.[*].issueDate").value(hasItem(DEFAULT_ISSUE_DATE.toString())))
            .andExpect(jsonPath("$.[*].expiryDate").value(hasItem(DEFAULT_EXPIRY_DATE.toString())));
    }

    @Test
    @Transactional
    void getStudentIDCard() throws Exception {
        // Initialize the database
        studentIDCardRepository.saveAndFlush(studentIDCard);

        // Get the studentIDCard
        restStudentIDCardMockMvc
            .perform(get(ENTITY_API_URL_ID, studentIDCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(studentIDCard.getId().intValue()))
            .andExpect(jsonPath("$.cardNumber").value(DEFAULT_CARD_NUMBER))
            .andExpect(jsonPath("$.issueDate").value(DEFAULT_ISSUE_DATE.toString()))
            .andExpect(jsonPath("$.expiryDate").value(DEFAULT_EXPIRY_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingStudentIDCard() throws Exception {
        // Get the studentIDCard
        restStudentIDCardMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStudentIDCard() throws Exception {
        // Initialize the database
        studentIDCardRepository.saveAndFlush(studentIDCard);

        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();

        // Update the studentIDCard
        StudentIDCard updatedStudentIDCard = studentIDCardRepository.findById(studentIDCard.getId()).get();
        // Disconnect from session so that the updates on updatedStudentIDCard are not directly saved in db
        em.detach(updatedStudentIDCard);
        updatedStudentIDCard.cardNumber(UPDATED_CARD_NUMBER).issueDate(UPDATED_ISSUE_DATE).expiryDate(UPDATED_EXPIRY_DATE);

        restStudentIDCardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStudentIDCard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStudentIDCard))
            )
            .andExpect(status().isOk());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
        StudentIDCard testStudentIDCard = studentIDCardList.get(studentIDCardList.size() - 1);
        assertThat(testStudentIDCard.getCardNumber()).isEqualTo(UPDATED_CARD_NUMBER);
        assertThat(testStudentIDCard.getIssueDate()).isEqualTo(UPDATED_ISSUE_DATE);
        assertThat(testStudentIDCard.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
    }

    @Test
    @Transactional
    void putNonExistingStudentIDCard() throws Exception {
        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();
        studentIDCard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentIDCardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, studentIDCard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studentIDCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStudentIDCard() throws Exception {
        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();
        studentIDCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentIDCardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(studentIDCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStudentIDCard() throws Exception {
        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();
        studentIDCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentIDCardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(studentIDCard)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStudentIDCardWithPatch() throws Exception {
        // Initialize the database
        studentIDCardRepository.saveAndFlush(studentIDCard);

        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();

        // Update the studentIDCard using partial update
        StudentIDCard partialUpdatedStudentIDCard = new StudentIDCard();
        partialUpdatedStudentIDCard.setId(studentIDCard.getId());

        partialUpdatedStudentIDCard.cardNumber(UPDATED_CARD_NUMBER).issueDate(UPDATED_ISSUE_DATE).expiryDate(UPDATED_EXPIRY_DATE);

        restStudentIDCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentIDCard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudentIDCard))
            )
            .andExpect(status().isOk());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
        StudentIDCard testStudentIDCard = studentIDCardList.get(studentIDCardList.size() - 1);
        assertThat(testStudentIDCard.getCardNumber()).isEqualTo(UPDATED_CARD_NUMBER);
        assertThat(testStudentIDCard.getIssueDate()).isEqualTo(UPDATED_ISSUE_DATE);
        assertThat(testStudentIDCard.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
    }

    @Test
    @Transactional
    void fullUpdateStudentIDCardWithPatch() throws Exception {
        // Initialize the database
        studentIDCardRepository.saveAndFlush(studentIDCard);

        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();

        // Update the studentIDCard using partial update
        StudentIDCard partialUpdatedStudentIDCard = new StudentIDCard();
        partialUpdatedStudentIDCard.setId(studentIDCard.getId());

        partialUpdatedStudentIDCard.cardNumber(UPDATED_CARD_NUMBER).issueDate(UPDATED_ISSUE_DATE).expiryDate(UPDATED_EXPIRY_DATE);

        restStudentIDCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStudentIDCard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStudentIDCard))
            )
            .andExpect(status().isOk());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
        StudentIDCard testStudentIDCard = studentIDCardList.get(studentIDCardList.size() - 1);
        assertThat(testStudentIDCard.getCardNumber()).isEqualTo(UPDATED_CARD_NUMBER);
        assertThat(testStudentIDCard.getIssueDate()).isEqualTo(UPDATED_ISSUE_DATE);
        assertThat(testStudentIDCard.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingStudentIDCard() throws Exception {
        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();
        studentIDCard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentIDCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, studentIDCard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studentIDCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStudentIDCard() throws Exception {
        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();
        studentIDCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentIDCardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(studentIDCard))
            )
            .andExpect(status().isBadRequest());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStudentIDCard() throws Exception {
        int databaseSizeBeforeUpdate = studentIDCardRepository.findAll().size();
        studentIDCard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStudentIDCardMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(studentIDCard))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StudentIDCard in the database
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStudentIDCard() throws Exception {
        // Initialize the database
        studentIDCardRepository.saveAndFlush(studentIDCard);

        int databaseSizeBeforeDelete = studentIDCardRepository.findAll().size();

        // Delete the studentIDCard
        restStudentIDCardMockMvc
            .perform(delete(ENTITY_API_URL_ID, studentIDCard.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StudentIDCard> studentIDCardList = studentIDCardRepository.findAll();
        assertThat(studentIDCardList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
