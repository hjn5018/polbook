# 🧪 Polbook 테스트 가이드

이 문서는 서비스의 주요 기능을 테스트하기 위한 데이터와 가이드를 포함하고 있습니다.

## 1. 테스트용 계정
서버 실행 시 자동으로 생성되는 계정입니다. (비밀번호는 모두 `123456`)

| 이메일 | 학생번호 | 닉네임 |
| :--- | :--- | :--- |
| `test1@office.kopo.ac.kr` | 20261001 | 테스터1 |
| `test2@office.kopo.ac.kr` | 20261002 | 테스터2 |

---

## 2. 도서 등록 테스트 데이터
등록 폼에서 사용할 수 있는 예시 데이터입니다.
*   **JSON 파일 위치**: `test_assets/book_request.json`

```json
{
  "title": "알고리즘 및 자료구조 실습",
  "category": "MAJOR",
  "department": "컴퓨터소프트웨어공학과",
  "grade": 2,
  "semester": 1,
  "courseName": "자료구조실습",
  "professor": "이교수",
  "price": 18000,
  "description": "수업 시간에 사용한 알고리즘 교재입니다. 앞부분에 약간의 필기가 있지만 상태는 매우 좋습니다.",
  "condition": "A",
  "hasNotes": true,
  "locationId": 1
}
```

---

## 3. 테스트용 이미지
이미지 업로드 테스트 시 사용하세요. `test_assets/` 폴더에 위치해 있습니다.

| 미리보기 | 파일명 | 
| :--- | :--- |
| ![CS Book](test_assets/book_cs.png) | `book_cs.png` |
| ![TOEIC Book](test_assets/book_toeic.png) | `book_toeic.png` |
| ![PSY Book](test_assets/book_psy.png) | `book_psy.png` |

---

## 4. 테스트 체크리스트
- [ ] 더미 계정으로 로그인 성공 여부
- [ ] 새로운 도서 게시글 등록 (이미지 포함)
- [ ] 홈 화면에서 내가 등록한 도서 확인
- [ ] 카테고리 필터링 및 제목 검색 기능
- [ ] 도서 상세 페이지 이미지 슬라이더 동작
- [ ] (작성자일 때) 게시글 수정 및 삭제 기능
