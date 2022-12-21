package com.mycompany.school.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.school.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HomeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Home.class);
        Home home1 = new Home();
        home1.setId(1L);
        Home home2 = new Home();
        home2.setId(home1.getId());
        assertThat(home1).isEqualTo(home2);
        home2.setId(2L);
        assertThat(home1).isNotEqualTo(home2);
        home1.setId(null);
        assertThat(home1).isNotEqualTo(home2);
    }
}
