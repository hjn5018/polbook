# 📁 튜토리얼 프로젝트 구조 완전 해설

이 문서는 `spring-react-tutorial` 프로젝트의 **백엔드(Spring Boot)**와 **프론트엔드(React/Vite)** 폴더 내 모든 파일들의 역할을 설명합니다.

---

## 🖥️ Backend (Spring Boot) 구조

```
backend/
├── gradle/wrapper/
│   ├── gradle-wrapper.jar
│   └── gradle-wrapper.properties
├── src/main/
│   ├── java/com/example/demo/
│   │   ├── BackendApplication.java
│   │   ├── Book.java
│   │   ├── BookRepository.java
│   │   ├── BookService.java
│   │   ├── BookController.java
│   │   └── CorsConfig.java
│   └── resources/
│       └── application.properties
├── build.gradle
├── gradlew
└── gradlew.bat
```

---

### ⚙️ Gradle 빌드 관련 파일

#### `gradlew` / `gradlew.bat`
프로젝트에 내장된 **Gradle 실행 스크립트**입니다.
- `gradlew` : Linux/Mac 환경에서 실행하는 스크립트
- `gradlew.bat` : **Windows 환경(현재 우리 프로젝트)** 에서 실행하는 스크립트

개발자가 PC에 Gradle을 별도로 설치하지 않아도, 이 파일을 통해 동일한 버전의 Gradle로 프로젝트를 빌드할 수 있습니다.
```bash
# 서버 실행 시 사용한 명령
./gradlew.bat bootRun
```

#### `gradle/wrapper/gradle-wrapper.jar`
`gradlew` 실행 시 내부적으로 사용하는 **Gradle 다운로더의 실행 코드** 파일입니다. 직접 건드릴 일이 거의 없습니다.

#### `gradle/wrapper/gradle-wrapper.properties`
어떤 버전의 Gradle을 사용할지 명시한 **설정 파일**입니다.
```properties
# 이 프로젝트에서 Gradle 9.3.1 버전을 사용하도록 정의
distributionUrl=https\://services.gradle.org/distributions/gradle-9.3.1-bin.zip
```

---

### 📋 `build.gradle` 항목별 상세 설명

`build.gradle`은 프로젝트의 **설계도(메뉴판)** 역할을 합니다. Django의 `requirements.txt`와 비슷하지만 훨씬 다양한 역할을 합니다.

```groovy
plugins {
    id 'java'  // 이 프로젝트는 자바 언어를 사용합니다.
    id 'org.springframework.boot' version '4.0.3'  // Spring Boot 플러그인 (버전 4.0.3)
    id 'io.spring.dependency-management' version '1.1.7'  // 의존성(라이브러리) 버전을 자동으로 맞춰주는 도우미
}
```

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)  // JDK 17 버전을 사용합니다.
    }
}
```

```groovy
dependencies {
    // [1] spring-boot-starter-web
    //   - 웹 API 서버를 만들기 위한 핵심 패키지
    //   - @RestController, @GetMapping, @PostMapping 등의 어노테이션을 사용할 수 있게 해줌
    //   - 내부에 Tomcat(웹 서버) 포함 → 별도 설치 없이 java로 실행만 해도 웹서버가 켜짐
    implementation 'org.springframework.boot:spring-boot-starter-web'

    // [2] spring-boot-starter-data-jpa
    //   - Java 코드로 SQL 없이 데이터베이스를 다루게 해주는 ORM 도구 (Hibernate)
    //   - @Entity, @Id, JpaRepository 등을 사용 가능하게 해줌
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'

    // [3] h2
    //   - 별도 설치 없이 메모리 위에서 작동하는 초경량 내장 DB
    //   - 개발/테스트용으로 매우 편리 (서버 재시작 시 데이터 초기화됨)
    runtimeOnly 'com.h2database:h2'

    // [4] mysql-connector-j
    //   - Spring Boot가 실제 MySQL 데이터베이스에 연결하기 위한 드라이버
    //   - 지금은 H2를 쓰지만, 나중에 실제 MySQL로 전환할 때 application.properties만 바꾸면 됨
    runtimeOnly 'com.mysql:mysql-connector-j'

    // [5] lombok
    //   - Java 코드의 불필요한 반복을 줄여주는 마법 도구
    //   - @Getter, @Setter, @NoArgsConstructor 를 클래스에 붙이면 자동으로 Getter/Setter/생성자를 만들어줌
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // [6] spring-boot-starter-test
    //   - 단위 테스트(JUnit 등)를 작성하기 위한 도구
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

---

### 📝 `application.properties`
Spring Boot의 **모든 설정을 담당하는 중앙 설정 파일**입니다. Django의 `settings.py`와 동일한 역할입니다.

```properties
# 어떤 DB에 연결할지 (현재는 메모리 기반 H2 DB 사용)
spring.datasource.url=jdbc:h2:mem:polbook_tutorial

# H2 관리 콘솔 웹 활성화 (localhost:8080/h2-console 로 DB를 직접 조회 가능)
spring.h2.console.enabled=true

# Hibernate가 @Entity를 보고 DB 테이블을 자동 생성/갱신
spring.jpa.hibernate.ddl-auto=update

# 실행되는 SQL 쿼리를 콘솔에 출력 (학습 및 디버깅에 매우 유용)
spring.jpa.show-sql=true
```

---

### ☕ Java 소스코드 파일들

#### `BackendApplication.java`
Spring Boot 앱의 **시작점(Entry Point)** 입니다. Django의 `manage.py`와 비슷한 역할.
```java
@SpringBootApplication  // "여기서부터 Spring을 시작해!"
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);  // 서버 가동!
    }
}
```

#### `CorsConfig.java`
**CORS(교차 출처 리소스 공유) 설정**을 담당합니다.
- 브라우저 보안 정책 상, 다른 포트(예: `5173`)에서 `8080`으로 API 요청을 보내면 **기본적으로 차단**됩니다.
- 이 파일에서 "React 서버(`localhost:5173`)에서 오는 요청은 허용해줘!"라고 명시적으로 허용해주는 것입니다.
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173");  // React 개발서버 허용
    }
}
```

---

## 🎨 Frontend (React/Vite) 구조

```
frontend/
├── public/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

### 📄 루트 파일들

#### `index.html`
React 앱의 **유일한 HTML 파일**입니다. Django 템플릿과 달리 내용이 거의 비어있습니다.
브라우저가 이 파일을 먼저 읽고, 내부의 `<div id="root">`라는 틀 안에 React가 JavaScript로 모든 화면을 동적으로 조립(렌더링)합니다.
```html
<body>
    <div id="root"></div>  <!-- React가 여기에 화면을 통째로 그려 넣습니다 -->
    <script type="module" src="/src/main.jsx"></script>
</body>
```

#### `package.json`
Node.js(프론트엔드) 프로젝트의 **설계도(메뉴판)** 입니다. Spring Boot의 `build.gradle`과 동일한 역할입니다.
```json
{
  "name": "frontend",
  "scripts": {
    "dev": "vite",    // npm run dev 시 Vite 개발 서버 실행
    "build": "vite build"  // 배포용 최적화 파일 생성
  },
  "dependencies": {
    "react": "^18.x",       // React 라이브러리 본체
    "react-dom": "^18.x"    // React를 브라우저 HTML에 붙여주는 역할
  },
  "devDependencies": {
    "vite": "^5.x"          // 개발 서버 및 빌드 도구
  }
}
```

#### `package-lock.json`
`npm install` 실행 시 자동으로 생성되는 파일로, 라이브러리들의 **정확한 버전 목록**을 잠금(lock)합니다.
팀원들이 `npm install`을 실행해도 항상 **완전히 동일한 버전의 라이브러리**가 설치되도록 보장하는 역할입니다. 직접 수정하지 않습니다.

#### `vite.config.js`
**Vite 개발 서버 세부 설정 파일**입니다. 개발 서버 포트 변경, 프록시 설정(백엔드 API 경로 우회 등) 등을 설정합니다.

---

### 📁 `src/` 폴더 (핵심 소스코드)

#### `main.jsx`
React 앱의 **시작점(Entry Point)** 입니다. Spring Boot의 `BackendApplication.java`와 동일한 역할.
`App.jsx` 최상위 컴포넌트를 `index.html`의 `<div id="root">` 안에 마운트(삽입)합니다.
```jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)  // App을 root에 꽂아 넣기!
```

#### `App.jsx`
현재 튜토리얼의 **메인 화면 컴포넌트**입니다. 실제 화면 UI와 백엔드 API 통신 로직이 담겨있습니다.

#### `index.css`
`main.jsx`에서 불러오는 **전역(Global) CSS**입니다. body, *, 기본 HTML 요소 등 앱 전체에 적용되는 가장 기본적인 스타일을 정의합니다.

#### `App.css`
`App.jsx`에서 불러오는 **App 컴포넌트 전용 CSS**입니다. 현재 튜토리얼에서는 인라인 스타일을 주로 사용하므로 비어있거나 기본 값만 남아있습니다.
