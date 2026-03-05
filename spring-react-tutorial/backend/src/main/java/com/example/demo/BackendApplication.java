package com.example.demo;

// Spring Boot 앱을 시작하기 위해 필요한 클래스들을 불러옵니다.
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 🚀 Spring Boot 애플리케이션의 시작점(Entry Point)입니다.
 *
 * @SpringBootApplication 어노테이션 하나가 아래 3가지를 한번에 처리합니다:
 *                        1. @Configuration : 이 클래스를 Spring 설정 파일로 등록
 *                        2. @EnableAutoConfiguration : application.properties
 *                        설정을 자동으로 읽어 환경 구성
 *                        3. @ComponentScan : 이 패키지 하위의
 *                        모든 @Component, @Service, @Repository 등을 자동 탐색/등록
 */
@SpringBootApplication
public class BackendApplication {

	/**
	 * Java 프로그램의 진입점인 main 메서드입니다.
	 * SpringApplication.run()을 호출하면 내장 Tomcat 웹 서버가 켜지고
	 * application.properties 에 설정된 포트(기본 8080)로 HTTP 요청을 받기 시작합니다.
	 */
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
