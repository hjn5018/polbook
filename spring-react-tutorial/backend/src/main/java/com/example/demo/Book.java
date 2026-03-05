package com.example.demo;

// JPA(Java Persistence API) 관련 어노테이션을 사용하기 위한 import
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Lombok 라이브러리 어노테이션 import
// Lombok: 반복적인 Getter/Setter/생성자 코드를 어노테이션 한 줄로 자동 생성해주는 도구
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 📖 Book 엔티티(Entity) 클래스
 *
 * 이 클래스 하나가 MySQL(또는 H2) 데이터베이스의 `book` 테이블과 1:1로 매핑됩니다.
 * - Django의 `models.py` 에서 모델(Model) 클래스를 정의하는 것과 동일한 역할입니다.
 * - Hibernate(JPA 구현체)가 이 클래스를 읽고 자동으로 CREATE TABLE 쿼리를 실행합니다.
 */
@Entity // "이 클래스는 DB 테이블과 연결되는 엔티티(도메인 객체)입니다"
@Getter // [Lombok] 모든 필드의 getter 메서드(getId(), getTitle(), getPrice())를 자동 생성
@Setter // [Lombok] 모든 필드의 setter 메서드(setId(), setTitle(), setPrice())를 자동 생성
@NoArgsConstructor // [Lombok] 매개변수 없는 기본 생성자(new Book()) 를 자동 생성. JPA가 내부적으로 필요로 함
public class Book {

    /**
     * 게시글(책)의 고유 식별자(Primary Key)입니다.
     * 
     * @Id : 이 필드가 DB 테이블의 Primary Key(기본키)임을 알립니다.
     * @GeneratedValue(strategy = GenerationType.IDENTITY) :
     *                          - 값을 직접 넣지 않고 INSERT 할 때마다 DB가 자동으로 1, 2, 3, ... 순서로
     *                          증가시켜 넣어줍니다.
     *                          - MySQL의 AUTO_INCREMENT, Django 모델의 기본 id 필드와 동일한
     *                          동작입니다.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 책의 제목입니다. (DB 컬럼명: title, 타입: VARCHAR)
     * 어노테이션이 없으면 JPA는 필드 이름을 그대로 컬럼 이름으로 사용합니다.
     */
    private String title;

    /**
     * 책의 가격입니다. (DB 컬럼명: price, 타입: INT)
     */
    private int price;
}
