# 자바스크립트 초보자를 위한 React 핵심 안내서

React는 자바스크립트로 만들어진 'UI를 그리는 라이브러리(도구)'입니다. Django 템플릿 엔진을 다뤄보셨다면, HTML 화면을 서버가 통째로 만들어서 던져주는 방식에 익숙하실 겁니다.

하지만 React를 배우실 때 가장 먼저 깨야 할 고정관념은 **"HTML을 따로 빼두지 않는다"**는 점입니다.

---

## 1. 컴포넌트 (Component) - 화면을 조립하는 레고 블록
Django의 HTML 템플릿(예: `base.html`을 `{% extends %}`)처럼 화면을 재사용하지만, 그 방식이 완전히 다릅니다.
React에서는 버튼 한 개, 검색창 한 개, 네비게이션 바 한 개를 각각의 **독립적인 자바스크립트 함수(컴포넌트)**로 만듭니다.

```javascript
// 아주 단순한 내 첫 번째 React 컴포넌트(함수)
function CustomButton() {
  return (
    <button>나를 클릭해주세요!</button>
  );
}
```

이렇게 만든 `<CustomButton />`이라는 레고 블록 수십 개를 조립해서 하나의 앱(App) 덩어리를 만들어냅니다.

## 2. JSX - 자바스크립트 안에 HTML 넣기
위의 코드에서 이상한 점을 발견하셨나요? 자바스크립트 함수가 어떻게 HTML 태그(`<button>`)를 그대로 `return`하고 있을까요?
이를 **JSX 문법**이라고 부릅니다. 자바스크립트 파일(`*.jsx`나 `*.js`) 안에서 HTML을 편하게 쓰기 위해 만든 문법입니다.

*   **Django 템플릿 변수:** `{{ book_title }}`
*   **React (JSX) 변수:** `{bookTitle}`
    *   *HTML 태그 안에서 중괄호 `{}`만 열면 그 안에서 자바스크립트 변수나 계산식을 마음껏 쓸 수 있습니다.*

## 3. State (상태) - 화면이 살아 움직이게 하는 마법
React의 존재 이유이자 가장 중요한 개념입니다. 초보자분들이 제일 헷갈려 하는 부분입니다.
일반적인 자바스크립트(Vanilla JS)는 변수를 바꾸고(`let count = 1; count = 2;`), 바뀐 숫자를 화면에 띄우기 위해 `document.getElementById('text').innerText = count;` 처럼 일일이 명령해야 합니다.

**React는 데이터(State)만 바뀌면 화면을 알아서(반응성 있게) 다시 그려줍니다.**

```javascript
import { useState } from 'react';

function Counter() {
  // count: 현재 숫자 값 (초기값 0)
  // setCount: 이 숫자를 바꿔줄 수 있는 리모컨 버튼 역할
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* 화면에는 0이 나옵니다. */}
      <h1>현재 숫자: {count}</h1> 
      {/* 클릭할 때 리모컨을 통해 기존 숫자에 1을 더합니다. */}
      <button onClick={() => setCount(count + 1)}>
        올리기
      </button>
    </div>
  );
}
```
내가 `setCount` 함수로 데이터를 변경하는 순간, React가 "엇! 데이터가 바뀌었네?" 하고 자동으로 저 `<h1>` 태그 부분을 감지해서 화면의 0을 1로 부드럽게 바꿔 끼워줍니다.

## 4. Props (프롭스) - 컴포넌트 간 정보 전달
함수에 인자(파라미터)를 넘겨주듯, 부모 레고 블록이 자식 레고 블록에게 내려주는 데이터입니다.

```javascript
// 👦 부모 화면 (메인 홈)
function Home() {
  return (
    <div>
      <BookCard title="해리포터와 마법사의 돌" price="15,000" />
      <BookCard title="생활코딩! 리액트 프로그래밍" price="20,000" />
    </div>
  );
}

// 👦 자식 컴포넌트 (책 카드 하나) - 전달받은 속성(props)을 사용함
function BookCard(props) {
  return (
    <div className="card">
      <h2>책 제목: {props.title}</h2>
      <p>가격: {props.price}원</p>
    </div>
  );
}
```
**이 컴포넌트 쪼개기(조립)와 상태(State), 프롭스(Props) 3가지만 이해하시면 React의 절반 이상을 깨우치신 것과 다름없습니다.**

---

### 🔥 초보자 맞춤 결론 요약
1. 자바스크립트 문법 자체가 부족해도 괜찮습니다. (변수 선언 `const`, 함수, 배열 맵핑 `array.map()`, 화살표 함수 `() => {}` 정도만 미리 봐두셔도 충분합니다.)
2. Django로 서버에서 HTML을 그리는 것이 아니라, React는 텅 빈 HTML을 받고 오직 자바스크립트로 화면을 팍팍 조립해 나갑니다.
3. 데이터(`State`)를 변경하면 화면은 **"알아서 리렌더링"** 된다는 마법 하나만 믿고 가시면 됩니다!
