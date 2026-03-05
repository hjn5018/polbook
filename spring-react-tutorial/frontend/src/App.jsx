/**
 * 🎨 App.jsx - 미니 중고 책 게시판의 메인 화면 컴포넌트
 *
 * 이 파일 하나에 화면(UI)과 백엔드 통신(API 호출) 로직이 모두 담겨 있습니다.
 * React에서 "컴포넌트"란 화면의 한 구역을 담당하는 독립적인 함수입니다.
 *
 * 주요 기능:
 *   1. 페이지 접속 시 백엔드(GET /api/books)에서 책 목록을 불러와 화면에 표시
 *   2. 입력 폼에 제목/가격을 적고 [등록하기] 버튼을 누르면 백엔드(POST /api/books)로 전송
 *   3. 등록 성공 후 목록을 즉시 다시 불러와서(Refetch) 화면 갱신
 */

// ⬇️ React에서 제공하는 핵심 "훅(Hook)" 2가지를 불러옵니다.
//   useState  : 화면에서 변할 수 있는 데이터(상태)를 관리하는 도구
//   useEffect : 컴포넌트가 화면에 처음 나타났을 때(마운트) 자동 실행되는 동작을 정의하는 도구
import { useState, useEffect } from 'react'

// Spring Boot 백엔드 API의 주소를 상수로 정의해둡니다.
// 나중에 서버 주소가 바뀌면 여기 한 곳만 수정하면 됩니다.
const API_URL = 'http://localhost:8080/api/books'

/**
 * App 컴포넌트 함수
 * React에서 화면 하나를 그리는 단위를 "컴포넌트"라고 부르며,
 * 컴포넌트는 결국 JSX(HTML처럼 생긴 자바스크립트)를 return하는 '함수'입니다.
 */
function App() {
  // ──────────────────────────────────────────────
  //  📦 State(상태) 선언 영역
  //  useState의 반환값: [현재값, 값을변경하는함수]
  // ──────────────────────────────────────────────

  // books: DB에서 불러온 책 목록 배열 (초기값: 빈 배열 [])
  // setBooks: books 값을 변경할 때 사용하는 함수
  const [books, setBooks] = useState([])

  // title: 입력 폼의 "책 제목" 칸에 사용자가 타이핑한 텍스트 (초기값: 빈 문자열)
  const [title, setTitle] = useState('')

  // price: 입력 폼의 "가격" 칸에 사용자가 타이핑한 숫자 (초기값: 빈 문자열)
  const [price, setPrice] = useState('')

  // ──────────────────────────────────────────────
  //  🌐 API 통신 함수 영역
  // ──────────────────────────────────────────────

  /**
   * fetchBooks: 백엔드에서 모든 책 목록을 가져오는 함수
   *
   * 파이썬으로 치면:
   *   response = requests.get('http://localhost:8080/api/books')
   *   data = response.json()
   *
   * async/await: 비동기 처리 문법. 서버 응답이 올 때까지 기다렸다가(await) 다음 줄 실행.
   */
  const fetchBooks = async () => {
    const res = await fetch(API_URL)        // GET 요청 보내기
    const data = await res.json()           // 응답 본문을 JSON → 자바스크립트 배열로 변환
    setBooks(data)                          // 변환된 배열을 books 상태에 저장 → 화면이 자동으로 다시 그려짐!
  }

  /**
   * useEffect: 컴포넌트가 화면에 처음 나타날 때(마운트) 딱 1회 실행되는 코드를 정의합니다.
   *
   * 두 번째 인자 [] (빈 배열):
   *   "의존성이 없다" → "처음 한 번만 실행하고 그 뒤로는 다시 실행하지 마라"
   *
   * Django로 치면 views.py에서 페이지 진입 시 DB에서 데이터를 조회하는 것과 비슷합니다.
   */
  useEffect(() => {
    fetchBooks()  // 화면이 처음 뜰 때 책 목록을 서버에서 불러옵니다.
  }, [])

  /**
   * handleSubmit: [등록하기] 버튼 클릭 시 실행되는 함수
   *
   * 파이썬으로 치면:
   *   response = requests.post(url, json={"title": "...", "price": 18000})
   */
  const handleSubmit = async () => {
    // 빈 값 검증: 제목이나 가격이 비어있으면 경고창을 띄우고 중단
    if (!title || !price) {
      alert('책 제목과 가격을 모두 입력해주세요.')
      return  // 함수 종료 (아래 코드 실행하지 않음)
    }

    // POST 요청으로 백엔드에 새 책 데이터 전송
    const res = await fetch(API_URL, {
      method: 'POST',                                    // HTTP 메서드: POST (데이터 생성)
      headers: { 'Content-Type': 'application/json' },   // "보내는 데이터는 JSON 형식이에요"
      body: JSON.stringify({ title, price: Number(price) }),  // JS 객체 → JSON 문자열로 변환하여 전송
    })

    // 응답이 성공(200번대)이면
    if (res.ok) {
      setTitle('')     // 입력 폼 초기화 (제목 비우기)
      setPrice('')     // 입력 폼 초기화 (가격 비우기)
      fetchBooks()     // 📌 핵심! 등록 직후 목록을 다시 불러와서 화면을 즉시 갱신합니다 (Refetch)
    } else {
      alert('등록에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
  }

  // ──────────────────────────────────────────────
  //  🖥️ JSX 렌더링 영역 (화면에 보여줄 HTML 구조)
  //  return 안의 코드가 실제 브라우저 화면에 그려집니다.
  // ──────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* 📌 페이지 타이틀 */}
      <h1 style={styles.title}>📚 미니 중고 책 게시판</h1>

      {/* ──────── 📝 책 등록 폼 영역 ──────── */}
      <div style={styles.form}>
        <h2>새로운 책 등록하기</h2>

        {/*
          <input> 태그의 주요 속성 설명:
          - value={title}     : 이 입력칸에 표시되는 텍스트를 state(title)와 연결합니다.
          - onChange={(e) => setTitle(e.target.value)}
            : 사용자가 글자를 칠 때마다(onChange 이벤트) 해당 값(e.target.value)을
              setTitle로 state에 저장합니다.
            → 이것을 "양방향 바인딩(Two-way Binding)"이라 부릅니다.
              Django 폼에서 form.cleaned_data['title'] 로 값을 받는 것과 유사합니다.
        */}
        <input
          style={styles.input}
          type="text"
          placeholder="책 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="가격 (원)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* onClick: 버튼 클릭 시 위에서 정의한 handleSubmit 함수를 실행 */}
        <button style={styles.button} onClick={handleSubmit}>
          ✅ 등록하기
        </button>
      </div>

      {/* ──────── 📚 책 목록 표시 영역 ──────── */}
      <div style={styles.list}>
        <h2>등록된 책 목록</h2>

        {/*
          조건부 렌더링 (삼항 연산자):
            books.length === 0 이면 → "아직 등록된 책이 없습니다" 표시
            아니면(책이 있으면)     → <ul> 리스트로 각 책을 하나씩 그려줌

          books.map(): 배열의 각 요소(book)를 순회하며 JSX로 변환합니다.
            → Django 템플릿의 {% for book in books %} ... {% endfor %} 와 동일합니다.

          key={book.id}: React가 각 리스트 항목을 구분하기 위한 고유 식별자.
            → DB의 Primary Key(id)를 넣어주면 됩니다.
        */}
        {books.length === 0 ? (
          <p style={{ color: '#888' }}>아직 등록된 책이 없습니다.</p>
        ) : (
          <ul style={{ paddingLeft: '1rem' }}>
            {books.map((book) => (
              <li key={book.id} style={styles.listItem}>
                <span>📖 {book.title}</span>
                <span style={styles.price}>{book.price.toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
//  🎨 인라인 스타일 객체
//  CSS 파일 대신 자바스크립트 객체로 스타일을 정의한 방식입니다.
//  속성명이 CSS와 살짝 다릅니다: kebab-case(font-size) → camelCase(fontSize)
// ──────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: '600px',        // 최대 너비 600px로 제한
    margin: '40px auto',      // 상하 40px, 좌우는 자동(가운데 정렬)
    fontFamily: 'Segoe UI, sans-serif',
    padding: '0 16px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  form: {
    backgroundColor: '#f5f5f5',
    padding: '24px',
    borderRadius: '8px',       // 모서리 둥글게
    display: 'flex',
    flexDirection: 'column',   // 세로 방향 정렬
    gap: '12px',               // 요소 간 12px 간격
    marginBottom: '32px',
  },
  input: {
    padding: '10px 14px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px',
    fontSize: '1rem',
    backgroundColor: '#4f46e5', // 보라색 계열 배경
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',         // 마우스 올리면 손가락 모양으로 변경
  },
  list: {
    backgroundColor: '#fafafa',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between', // 제목과 가격을 양쪽 끝으로 배치
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  price: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
}

// 다른 파일(main.jsx)에서 이 컴포넌트를 import 할 수 있도록 내보냅니다.
export default App
