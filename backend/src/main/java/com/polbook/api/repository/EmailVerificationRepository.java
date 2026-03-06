package com.polbook.api.repository;

import com.polbook.api.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    /**
     * 학번으로 가장 최근에 생성된 미인증 인증 레코드를 조회합니다.
     */
    Optional<EmailVerification> findTopByStudentIdAndVerifiedFalseOrderByCreatedAtDesc(String studentId);

    /**
     * 특정 학번에 대해 이미 인증 완료된 레코드가 있는지 확인합니다.
     */
    boolean existsByStudentIdAndVerifiedTrue(String studentId);
}
