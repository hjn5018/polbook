package com.polbook.api.config;

import com.polbook.api.entity.*;
import com.polbook.api.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initUsersAndBooks(
            UserRepository userRepository,
            LocationRepository locationRepository,
            BookRepository bookRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. 위치 정보 생성 (이미 있으면 건너뜀)
            if (locationRepository.count() == 0) {
                List<String> locationNames = Arrays.asList(
                        "본관 입구", "1기술관", "2기술관", "3기술관", "백두관",
                        "5기술관", "6기술관", "7기술관", "하이테크관",
                        "한라관", "학생회관", "산학협력관");
                locationNames.forEach(name -> locationRepository.save(Location.builder().name(name).build()));
            }

            // 2. 더미 회원 생성 (이미 있으면 건너뜀)
            if (userRepository.count() == 0) {
                for (int i = 1; i <= 3; i++) {
                    String studentId = String.format("2026100%d", i);
                    String email = String.format("test%d@office.kopo.ac.kr", i);
                    String nickname = String.format("테스터%d", i);

                    userRepository.save(com.polbook.api.entity.User.builder()
                            .studentId(studentId)
                            .email(email)
                            .password(passwordEncoder.encode("123456"))
                            .nickname(nickname)
                            .build());
                }
            }

            // 3. 더미 도서 생성 (이미 있으면 건너뜀)
            if (bookRepository.count() == 0) {
                com.polbook.api.entity.User seller1 = userRepository.findByStudentId("20261001").orElseThrow();
                com.polbook.api.entity.User seller2 = userRepository.findByStudentId("20261002").orElseThrow();
                com.polbook.api.entity.Location location = locationRepository.findAll().get(0);

                List<Book> dummyBooks = Arrays.asList(
                        Book.builder()
                                .title("스프링 부트 완벽 가이드")
                                .category(Category.MAJOR)
                                .price(15000)
                                .condition(BookCondition.A)
                                .description("스프링 부트를 깊게 배울 수 있는 가이드북입니다. 깨끗합니다.")
                                .seller(seller1)
                                .location(location)
                                .courseName("웹 프로그래밍")
                                .professor("김교수")
                                .build(),
                        Book.builder()
                                .title("토익 기출 문제집 1000제")
                                .category(Category.CERT)
                                .price(12000)
                                .condition(BookCondition.S)
                                .description("미개봉 새상품입니다.")
                                .seller(seller2)
                                .location(location)
                                .build(),
                        Book.builder()
                                .title("심리학 개론")
                                .category(Category.LIBERAL)
                                .price(8000)
                                .condition(BookCondition.B)
                                .description("필기가 조금 있습니다.")
                                .seller(seller1)
                                .location(location)
                                .courseName("심리학의 이해")
                                .build());

                bookRepository.saveAll(dummyBooks);
            }
        };
    }
}
