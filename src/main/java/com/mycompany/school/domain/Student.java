package com.mycompany.school.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Student.
 */
@Entity
@Table(name = "student")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    @Column(name = "graduation_date")
    private LocalDate graduationDate;

    @Lob
    @Column(name = "photo", nullable = false)
    private byte[] photo;

    @NotNull
    @Column(name = "photo_content_type", nullable = false)
    private String photoContentType;

    @NotNull
    @Column(name = "home_address", nullable = false)
    private String homeAddress;

    @NotNull
    @Column(name = "emergency_contact", nullable = false)
    private String emergencyContact;

    @OneToMany(mappedBy = "student")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "student" }, allowSetters = true)
    private Set<Course> courses = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "students" }, allowSetters = true)
    private Parent parent;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Student id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Student name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getEnrollmentDate() {
        return this.enrollmentDate;
    }

    public Student enrollmentDate(LocalDate enrollmentDate) {
        this.setEnrollmentDate(enrollmentDate);
        return this;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public LocalDate getGraduationDate() {
        return this.graduationDate;
    }

    public Student graduationDate(LocalDate graduationDate) {
        this.setGraduationDate(graduationDate);
        return this;
    }

    public void setGraduationDate(LocalDate graduationDate) {
        this.graduationDate = graduationDate;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Student photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Student photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public String getHomeAddress() {
        return this.homeAddress;
    }

    public Student homeAddress(String homeAddress) {
        this.setHomeAddress(homeAddress);
        return this;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public String getEmergencyContact() {
        return this.emergencyContact;
    }

    public Student emergencyContact(String emergencyContact) {
        this.setEmergencyContact(emergencyContact);
        return this;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public Set<Course> getCourses() {
        return this.courses;
    }

    public void setCourses(Set<Course> courses) {
        if (this.courses != null) {
            this.courses.forEach(i -> i.setStudent(null));
        }
        if (courses != null) {
            courses.forEach(i -> i.setStudent(this));
        }
        this.courses = courses;
    }

    public Student courses(Set<Course> courses) {
        this.setCourses(courses);
        return this;
    }

    public Student addCourses(Course course) {
        this.courses.add(course);
        course.setStudent(this);
        return this;
    }

    public Student removeCourses(Course course) {
        this.courses.remove(course);
        course.setStudent(null);
        return this;
    }

    public Parent getParent() {
        return this.parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }

    public Student parent(Parent parent) {
        this.setParent(parent);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Student)) {
            return false;
        }
        return id != null && id.equals(((Student) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Student{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", enrollmentDate='" + getEnrollmentDate() + "'" +
            ", graduationDate='" + getGraduationDate() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            ", homeAddress='" + getHomeAddress() + "'" +
            ", emergencyContact='" + getEmergencyContact() + "'" +
            "}";
    }
}
