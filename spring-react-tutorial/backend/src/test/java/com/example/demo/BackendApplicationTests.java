package com.example.demo;

// JUnit 5 테스트 프레임워크 import
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

// Spring Boot 테스트 관련 import
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 🧪 BackendApplicationTests - Spring Boot 애플리케이션 기본 테스트
 *
 * @SpringBootTest: 실제 Spring Boot 앱을 통째로 띄워서 테스트합니다 (통합 테스트).
 *                  → application.properties 설정이 적용되고, 모든
 *                  Bean(@Service, @Repository 등)이 등록됩니다.
 *                  → Django의 TestCase 클래스에서 테스트용 DB를 자동 생성하고 테스트하는 것과 비슷합니다.
 *
 *                  ❓ 테스트는 왜 하나요?
 *                  코드를 수정할 때마다 매번 브라우저를 열고 직접 확인하는 것은 번거롭습니다.
 *                  테스트 코드를 작성해두면 명령어 한 줄(./gradlew.bat test)로
 *                  "모든 기능이 정상 동작하는지"를 자동으로 검증할 수 있습니다.
 */
@SpringBootTest
class BackendApplicationTests {

	/**
	 * ✅ 기본 테스트: Spring Boot 앱이 정상적으로 시작되는지 확인
	 *
	 * 이 테스트가 실패하면 = 앱 자체가 켜지지 않는 심각한 문제가 있다는 뜻!
	 * (설정 오류, Bean 등록 실패, DB 연결 실패 등)
	 */
	@Test
	@DisplayName("Spring Boot 애플리케이션이 정상적으로 시작되는지 확인")
	void contextLoads() {
		// 이 메서드는 비어있어도 됩니다.
		// @SpringBootTest가 앱을 실행하면서 오류가 없으면 자동으로 "통과(PASS)"입니다.
	}

}
