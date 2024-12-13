package com.example.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "tutor_profiles")
public class TutorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String subjects;
    private String description;
    private Double hourlyRate;

    public TutorProfile() {
    }

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }

    public String getSubjects() {
        return this.subjects;
    }

    public String getDescription() {
        return this.description;
    }

    public Double getHourlyRate() {
        return this.hourlyRate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSubjects(String subjects) {
        this.subjects = subjects;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setHourlyRate(Double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof TutorProfile)) return false;
        final TutorProfile other = (TutorProfile) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$user = this.getUser();
        final Object other$user = other.getUser();
        if (this$user == null ? other$user != null : !this$user.equals(other$user)) return false;
        final Object this$subjects = this.getSubjects();
        final Object other$subjects = other.getSubjects();
        if (this$subjects == null ? other$subjects != null : !this$subjects.equals(other$subjects)) return false;
        final Object this$description = this.getDescription();
        final Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description))
            return false;
        final Object this$hourlyRate = this.getHourlyRate();
        final Object other$hourlyRate = other.getHourlyRate();
        if (this$hourlyRate == null ? other$hourlyRate != null : !this$hourlyRate.equals(other$hourlyRate))
            return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof TutorProfile;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $user = this.getUser();
        result = result * PRIME + ($user == null ? 43 : $user.hashCode());
        final Object $subjects = this.getSubjects();
        result = result * PRIME + ($subjects == null ? 43 : $subjects.hashCode());
        final Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        final Object $hourlyRate = this.getHourlyRate();
        result = result * PRIME + ($hourlyRate == null ? 43 : $hourlyRate.hashCode());
        return result;
    }

    public String toString() {
        return "TutorProfile(id=" + this.getId() + ", user=" + this.getUser() + ", subjects=" + this.getSubjects() + ", description=" + this.getDescription() + ", hourlyRate=" + this.getHourlyRate() + ")";
    }
}