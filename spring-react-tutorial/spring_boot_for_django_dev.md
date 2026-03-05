# Django 개발자를 위한 Spring Boot 안내서

Django로 웹 개발 경험이 있고 기본적인 Java 문법을 아시는 상태라면, Spring Boot는 **개념을 어떻게 대입하느냐**가 가장 중요합니다.

Django(파이썬)와 Spring Boot(자바)는 사용하는 언어만 다를 뿐, 웹 애플리케이션을 구동하기 위한 "역할 분담(아키텍처)"은 아주 비슷하게 구성되어 있습니다.

---

## 1. 아키텍처 비교 (MVT vs MVC)
Django는 MVT(Model-View-Template) 패턴을 사용하지만, Spring Boot는 보통 **MVC(Model-View-Controller)** 패턴을 사용합니다. Polbook처럼 API 서버만 구축할 경우 화면(Template)을 렌더링하지 않으므로 **REST API 아키텍처**로 동작합니다.

| 역할 (무슨 일을 하나요?) | Django (MVT) | Spring Boot (MVC / API) |
| :--- | :--- | :--- |
| **URL 매핑 및 요청 수신** | `urls.py` | `@RestController`가 붙은 **Controller** 클래스 |
| **핵심 비즈니스 로직 처리** | `views.py` | `@Service`가 붙은 **Service** 클래스 |
| **DB 테이블 설계 및 조작** | `models.py` | `@Entity` (자바 객체) + **Repository** 인터페이스 |
| **데이터 직렬화 (JSON 변환)** | `serializers.py` (DRF) | **DTO (Data Transfer Object)** 클래스 |

> 💡 **핵심 차이점:** Django는 `views.py` 하나에서 비즈니스 로직과 DB 조회를 모두 처리하는 경우가 많지만, Spring Boot는 이 역할을 명확하게 쪼개어 놓습니다.
> - **Controller:** 클라이언트의 요청(url)을 받고 응답(json)만 내려줍니다.
> - **Service:** 실제 돈을 계산하거나 게시글 요건을 검사하는 진짜 "로직"을 수행합니다.
> - **Repository:** DB에 쿼리를 날려서 데이터를 가져오는 역할만 합니다.

## 2. ORM (DB 조작) 비교
Django의 가장 큰 장점인 Django ORM과 마찬가지로, Spring 진영에는 **Spring Data JPA(Hibernate)**라는 강력한 ORM이 있습니다. SQL을 직접 짜지 않고 자바 코드로 DB를 다룹니다.

*   **Django:** `Book.objects.filter(author=user)`
*   **Spring Boot:** `bookRepository.findByAuthor(user)` 
    *   *(JPA는 놀랍게도 메서드 이름만 규칙에 맞게 지어주면 알아서 SELECT 쿼리를 만들어줍니다!)*

## 3. 어노테이션(Annotation)의 마법
Django에서 `@login_required` 같은 데코레이터를 써보셨을 겁니다. Spring Boot에서는 `@(어노테이션)`이 모든 설정의 핵심입니다.

Java 문법을 아시니 클래스나 메서드 위에 이런 것들이 붙는 것을 자주 보시게 될 것입니다:
*   `@RestController`: "이 클래스는 JSON 응답을 내려주는 API 컨트롤러입니다."
*   `@GetMapping("/api/books")`: "Django의 `urls.py`에 경로를 적는 것과 같습니다."
*   `@Entity`: "이 자바 클래스는 MySQL의 테이블과 똑같이 생겼습니다."

## 4. 의존성 주입 (DI - Dependency Injection)
Spring Boot를 관통하는 가장 어려운 철학이지만, 실전에서는 아주 간단합니다.
내가 만든 A 클래스가 B 클래스의 기능을 쓰고 싶을 때, 파이썬처럼 파일 상단에 `from b import B` 한 뒤 함수 안에서 `b = B()` 객체를 직접 만들지 않습니다.

대신 Spring이 미리 만들어놓은 B 객체를 **"저한테 좀 주사(주입)해주세요!"** 라고 요청만 합니다.
(보통 생성자 주입이나 `@Autowired`를 씁니다.) 

---

### 🔥 결론 요약
1. Django의 `urls.py` + `views.py` 로직은 Spring Boot의 **Controller** 와 **Service** 로 나뉩니다.
2. Django의 `models.py` 파일 하나에 몰려있던 DB 관련 세팅은 **Entity**(테이블 모양)와 **Repository**(쿼리 도구) 로 세분화됩니다.
3. 데이터 검증과 JSON 변환에 썼던 `serializers.py`는 **DTO (Data Transfer Object)** 라는 자바 클래스를 따로 만들어 사용합니다.

Java 문법이 익숙하시니, Django에서 썼던 로직들을 이 "3박자(Controller-Service-Repository)" 구조에 맞추어 넣기만 하시면 금방 적응하실 수 있습니다!
