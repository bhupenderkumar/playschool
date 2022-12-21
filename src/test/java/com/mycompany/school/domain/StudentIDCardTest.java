package com.mycompany.school.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.school.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StudentIDCardTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudentIDCard.class);
        StudentIDCard studentIDCard1 = new StudentIDCard();
        studentIDCard1.setId(1L);
        StudentIDCard studentIDCard2 = new StudentIDCard();
        studentIDCard2.setId(studentIDCard1.getId());
        assertThat(studentIDCard1).isEqualTo(studentIDCard2);
        studentIDCard2.setId(2L);
        assertThat(studentIDCard1).isNotEqualTo(studentIDCard2);
        studentIDCard1.setId(null);
        assertThat(studentIDCard1).isNotEqualTo(studentIDCard2);
    }
}
