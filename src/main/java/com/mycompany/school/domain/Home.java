package com.mycompany.school.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Home.
 */
@Entity
@Table(name = "home")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Home implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Lob
    @Column(name = "sliders")
    private byte[] sliders;

    @Column(name = "sliders_content_type")
    private String slidersContentType;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Home id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Home description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getSliders() {
        return this.sliders;
    }

    public Home sliders(byte[] sliders) {
        this.setSliders(sliders);
        return this;
    }

    public void setSliders(byte[] sliders) {
        this.sliders = sliders;
    }

    public String getSlidersContentType() {
        return this.slidersContentType;
    }

    public Home slidersContentType(String slidersContentType) {
        this.slidersContentType = slidersContentType;
        return this;
    }

    public void setSlidersContentType(String slidersContentType) {
        this.slidersContentType = slidersContentType;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Home)) {
            return false;
        }
        return id != null && id.equals(((Home) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Home{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", sliders='" + getSliders() + "'" +
            ", slidersContentType='" + getSlidersContentType() + "'" +
            "}";
    }
}
