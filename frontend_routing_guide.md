# 🧭 Polbook Frontend 라우팅 세팅 가이드

현재 Polbook 프론트엔드(`frontend`)는 **React Router v6 (`react-router-dom`)**를 사용하여 화면 전환(라우팅)을 처리하고 있습니다. 이 문서는 `src/App.jsx`에 설정된 기본 라우팅 구조와 각 페이지 컴포넌트의 역할을 설명합니다.

---

## 1. ⚙️ 라우팅 구조 개요 (`App.jsx`)

현재 `App.jsx` 내부에 설정된 메인 라우팅 구조는 다음과 같습니다:

```jsx
<BrowserRouter>
  <div className="container mx-auto p-4 max-w-md bg-gray-50 min-h-screen">
    <Routes>
      {/* 1. 공통 화면 (비로그인 접근 가능) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 2. 도서 관련 화면 */}
      <Route path="/books/new" element={<BookFormPage />} />
      <Route path="/books/:id" element={<BookDetailPage />} />
      
      {/* 3. 채팅 관련 화면 */}
      <Route path="/chat" element={<ChatListPage />} />
      <Route path="/chat/:roomId" element={<ChatRoomPage />} />
      
      {/* 4. 마이페이지 */}
      <Route path="/mypage" element={<MyPage />} />
      
      {/* 5. 예외 처리 (404 Not Found) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
</BrowserRouter>
```

### 💡 주요 특징:
- **`max-w-md` 적용:** 모바일 환경에서의 사용을 염두에 두고 디자인되었기 때문에, 앱 화면 전체 너비를 모바일 사이즈(최대 ~448px)로 제한해 두었습니다.
- **예외 경로 처리:** 정의되지 않은 잘못된 URL(`*`)로 접근할 경우, `Navigate` 컴포넌트를 사용하여 즉시 홈 화면(`/`)으로 강제 리다이렉트(replace) 시킵니다.

---

## 2. 📂 페이지(Pages)별 역할 설명

`frontend/src/pages/` 디렉토리에 위치한 각 화면(페이지) 컴포넌트는 URL 경로와 1:1 매칭됩니다.

| URL 경로 (`path`) | 컴포넌트 명 | 역할 및 기능 스펙 |
| :--- | :--- | :--- |
| `/` | `HomePage` | 앱의 메인 화면. 등록된 중고 책 목록(피드)이 나타나며 카테고리 필터링이 가능합니다. |
| `/login` | `LoginPage` | 사용자 로그인 화면. 학번과 비밀번호를 입력받아 JWT 토큰을 발급받습니다. |
| `/signup` | `SignupPage` | 회원가입 화면. `office.kopo.ac.kr` 웹메일 인증 등 필수 정보를 입력받습니다. |
| `/books/new` | `BookFormPage` | 판매할 중고 책의 사진, 가격, 설명 등을 입력하여 새로 등록하는 폼 화면입니다. |
| `/books/:id` | `BookDetailPage` | 특정 책(`id`)을 클릭했을 때 나타나는 상세 정보 화면입니다. 하단에 '채팅하기'나 '찜하기' 버튼이 위치합니다. |
| `/chat` | `ChatListPage` | 본인이 참여 중인(판매 또는 구매) 채팅방들의 목록을 보여주는 화면입니다. |
| `/chat/:roomId` | `ChatRoomPage` | 특정 상대방(`roomId`)과의 1:1 실시간 대화창 화면입니다. 우측 상단에서 거래 약속(장소)을 잡고 결제를 진행합니다. |
| `/mypage` | `MyPage` | 내 정보. 내 판매 내역, 찜한 목록, 매너 온도(평점) 등을 확인할 수 있는 화면입니다. |

---

## 3. 🚀 향후 확장 계획 (보안 인증)

보안을 위해 **인증된(로그인한) 사용자만 접근해야 하는 페이지**들 (예: `/books/new`, `/chat`, `/mypage`)은 추후 로직 개발 단계에서 `react-router-dom`의 **PrivateRoute(또는 ProtectedRoute)** 개념을 도입하여 감쌀 예정입니다. 

이를 통해 로그인하지 않은 유저가 해당 주소를 직접 쳐서 들어올 경우 자동으로 `/login` 화면으로 쫓아내는(Redirect) 로직이 추가될 것입니다.
