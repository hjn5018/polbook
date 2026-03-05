/**
 * 🚀 main.jsx - React 앱의 시작점(Entry Point)
 *
 * Spring Boot의 BackendApplication.java (main 메서드)와 동일한 역할입니다.
 * 이 파일은 index.html의 <script> 태그에 의해 브라우저에서 가장 먼저 실행됩니다.
 *
 * 하는 일:
 *   1. index.html 안의 <div id="root"> 요소를 찾습니다.
 *   2. 그 안에 <App /> (최상위 React 컴포넌트)을 통째로 렌더링(그려넣기)합니다.
 */

// React의 StrictMode: 개발 중 잠재적 문제를 감지해주는 도우미 (배포 시에는 영향 없음)
import { StrictMode } from 'react'

// createRoot: React 18에서 도입된 새로운 렌더링 방식
// index.html의 <div id="root"> 요소를 React의 "루트(최상위 컨테이너)"로 등록합니다.
import { createRoot } from 'react-dom/client'

// 전역 스타일 CSS를 불러옵니다 (body, *, html 등 기본 스타일)
import './index.css'

// 최상위 컴포넌트인 App을 불러옵니다 (실제 화면 내용이 담긴 파일)
import App from './App.jsx'

/**
 * ⬇️ 핵심 한 줄!
 * index.html에서 id가 'root'인 <div>를 찾아서 React 루트로 만들고,
 * 그 안에 <App /> 컴포넌트를 렌더링합니다.
 *
 * <StrictMode>로 감싸면 개발 중 경고 메시지를 더 자세히 보여줍니다.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
