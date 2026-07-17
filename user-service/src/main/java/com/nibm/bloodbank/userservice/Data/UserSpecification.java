package com.nibm.bloodbank.userservice.Data;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> findByCriteria(String city, String bloodGroup, Boolean availableToDonate) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (city != null && !city.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("city"), city));
            }
            if (bloodGroup != null && !bloodGroup.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("bloodGroup"), bloodGroup));
            }
            if (availableToDonate != null) {
                predicates.add(criteriaBuilder.equal(root.get("availableToDonate"), availableToDonate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}