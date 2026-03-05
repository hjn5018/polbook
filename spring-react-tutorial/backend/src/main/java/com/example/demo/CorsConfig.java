package com.example.demo;

// Spring 설정 관련 import
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 🔒 CorsConfig - CORS(교차 출처 리소스 공유) 허용 설정 클래스
 *
 * ❓ CORS란 무엇인가요?
 * 웹 브라우저는 보안을 위해 "같은 출처(Origin)"가 아닌 곳으로의 요청을 기본적으로 차단합니다.
 * "출처"란 프로토콜 + 도메인 + 포트 의 조합입니다.
 *
 * 예) React 서버: http://localhost:5173 (출처 A)
 * Spring 서버: http://localhost:8080 (출처 B)
 *
 * → 포트가 다르므로 "다른 출처"로 판단 → 브라우저가 요청을 차단!
 * → 이 파일에서 "5173번 출처에서 오는 요청은 안전하니 허용해줘"라고 Spring에게 알려줍니다.
 *
 * 💡 Django에서는 django-cors-headers 패키지를 설치하고 settings.py에
 * CORS_ALLOWED_ORIGINS = ["http://localhost:3000"] 을 추가하던 것과 동일합니다.
 *
 * @Configuration : 이 클래스를 Spring의 '설정 파일'로 등록합니다.
 *                서버 시작 시 자동으로 읽혀져 적용됩니다.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * addCorsMappings: CORS 허용 규칙을 등록하는 메서드
     *
     * Spring 서버가 시작될 때 이 메서드가 자동으로 호출되어 아래 규칙들이 적용됩니다.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/api/**") // "/api"로 시작하는 모든 경로에 대해
                .allowedOrigins("http://localhost:5173") // React Vite 개발서버(5173)에서 오는 요청만 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메서드 종류
                .allowedHeaders("*"); // 모든 종류의 HTTP 헤더 허용
    }
}
