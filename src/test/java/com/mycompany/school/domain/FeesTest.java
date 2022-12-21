package com.mycompany.school.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.school.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FeesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fees.class);
        Fees fees1 = new Fees();
        fees1.setId(1L);
        Fees fees2 = new Fees();
        fees2.setId(fees1.getId());
        assertThat(fees1).isEqualTo(fees2);
        fees2.setId(2L);
        assertThat(fees1).isNotEqualTo(fees2);
        fees1.setId(null);
        assertThat(fees1).isNotEqualTo(fees2);
    }
}
