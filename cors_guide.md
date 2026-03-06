# CORS 해결 방식 비교: Vite Proxy vs CorsConfig.java

웹 개발에서 프론트엔드와 백엔드가 서로 다른 포트(또는 도메인)에서 실행될 때 발생하는 **CORS(Cross-Origin Resource Sharing)** 문제와 그 해결 방법을 정리합니다.

---

## CORS란?

**CORS는 브라우저의 보안 정책**입니다. "프론트엔드 → 백엔드", "백엔드 → 프론트엔드" 같은 양방향 개념이 아니라, 오직 **한 가지 상황**에서만 발동됩니다:

> 브라우저가 현재 페이지의 출처(Origin)와 **다른 출처**로 HTTP 요청을 보낼 때

예를 들어, 브라우저에서 `localhost:5173`(React)으로 페이지를 열고, `localhost:8080`(Spring Boot)으로 API를 호출하면:

```
브라우저(localhost:5173) → localhost:8080 요청
  → 브라우저: "출처(포트)가 다르네? 차단!"   ← 이것이 CORS 에러
```

> ⚠️ 핵심: **서버가 요청을 거부하는 것이 아니라, 브라우저가 응답을 차단**하는 것입니다.

---

## 해결 방법 1: Vite Proxy (Polbook 현재 방식)

### 원리: 브라우저를 속여서 CORS를 발생시키지 않는다

`vite.config.ts`에 프록시 설정을 추가하면, Vite 개발 서버가 **중간 다리 역할**을 합니다:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

**요청 흐름:**
```
브라우저 → http://localhost:5173/api/auth/email/send   (같은 출처! CORS 없음)
              ↓ (Vite가 중간에서 대리 전달)
         http://localhost:8080/api/auth/email/send   (실제 백엔드)
```

브라우저 입장에서는 `localhost:5173`으로 요청하기 때문에 **같은 출처**로 인식하고, CORS가 아예 발동하지 않습니다.

### 장점
- 백엔드 코드를 전혀 건드릴 필요가 없음
- 설정이 간단 (`vite.config.ts` 몇 줄이면 끝)

### 단점
- **개발 환경 전용** (Vite 개발 서버가 켜져 있어야만 작동)
- 실제 배포 시에는 사용 불가

---

## 해결 방법 2: CorsConfig.java (spring-react-tutorial 방식)

### 원리: 백엔드가 "이 출처는 허용한다"고 브라우저에게 알려준다

Spring Boot에 CORS 설정 파일을 추가하여, 응답 헤더에 허용할 출처 정보를 포함시킵니다:

```java
// CorsConfig.java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")  // 프론트엔드 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowCredentials(true);
    }
}
```

**요청 흐름:**
```
브라우저 → http://localhost:8080/api/auth/email/send   (다른 출처! CORS 발동)
  ← 서버 응답 헤더: "Access-Control-Allow-Origin: http://localhost:5173"
  → 브라우저: "서버가 허용했으니 통과!"
```

### 장점
- 개발/운영 환경 모두 사용 가능
- 프론트엔드 설정 불필요

### 단점
- 허용할 출처, 메서드, 헤더 등을 백엔드에서 세밀하게 관리해야 함
- 환경마다(dev, staging, prod) 허용 도메인이 달라질 수 있음

---

## 비교 요약

| 항목 | Vite Proxy | CorsConfig.java |
|---|---|---|
| **작동 원리** | 같은 출처로 속여서 CORS 우회 | 서버가 허용 응답 명시 |
| **요청 흐름** | 브라우저 → Vite → 백엔드 | 브라우저 → 직접 → 백엔드 |
| **CORS 발생 여부** | 발생 안 함 | 발생하지만 서버가 허용 |
| **적용 범위** | 🟡 개발 환경 전용 | 🟢 개발 + 운영 모두 |
| **설정 위치** | 프론트엔드 (`vite.config.ts`) | 백엔드 (`CorsConfig.java`) |

---

## Polbook에서의 CORS 전략

### 현재 (개발 단계)
- **Vite Proxy**만 사용 → 간단하고 백엔드 코드 수정 불필요

### 추후 (운영 배포 시)
두 가지 선택이 가능합니다:

1. **Nginx 리버스 프록시** (추천)  
   → Vite Proxy와 같은 원리. Nginx가 프론트/백을 하나의 도메인으로 합쳐줌  
   → `CorsConfig.java` 없어도 됨

2. **CorsConfig.java 추가**  
   → 프론트(`polbook.kopo.ac.kr`)와 백(`api.polbook.kopo.ac.kr`)을 별도 도메인으로 운영할 경우 필요
