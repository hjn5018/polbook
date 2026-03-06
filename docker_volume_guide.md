# Docker Volume 가이드

Docker 컨테이너에서 데이터를 영속적으로 저장하기 위한 볼륨 개념을 정리한 문서입니다.

## 저장 공간의 구분

Docker 환경에서는 세 가지 저장 공간이 존재합니다.

| 저장 공간 | 설명 |
|---|---|
| **내 컴퓨터 (호스트)** | 사용자가 직접 관리하는 로컬 파일 시스템 |
| **Docker 관리 영역** | Docker가 자체적으로 관리하는 내부 저장소 |
| **컨테이너 내부** | 컨테이너의 쓰기 가능 레이어 (Writable Layer) |

## 볼륨 방식 비교

### 1. 볼륨 없음

```yaml
services:
  db:
    image: mysql:8.0
    # volumes 설정 없음
```

- 데이터가 **컨테이너 내부**에만 저장됨
- 컨테이너를 삭제(`docker compose down`)하면 **데이터도 함께 삭제**됨
- DB처럼 보존이 필요한 데이터에는 적합하지 않음

### 2. Named Volume (이름 지정 볼륨)

```yaml
services:
  db:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql  # "이름"으로 참조

volumes:
  mysql_data:  # Docker에게 "mysql_data"라는 이름의 저장소 생성 요청
```

- 데이터가 **Docker 관리 영역**에 저장되고, 컨테이너는 이를 **연결해서 사용**
- 컨테이너를 삭제해도 **데이터는 유지**됨
- `docker compose down -v`를 사용하면 볼륨까지 삭제되므로 주의
- Windows/Mac에서 Bind Mount보다 **성능이 좋음**
- 작업 폴더에는 아무 파일도 생기지 않음

### 3. Bind Mount (바인드 마운트)

```yaml
services:
  db:
    image: mysql:8.0
    volumes:
      - ./mysql_data:/var/lib/mysql  # "./"로 시작하는 "경로"로 참조

# 최상위 volumes 섹션 불필요
```

- 데이터가 **내 컴퓨터(호스트) 폴더**에 저장되고, 컨테이너는 이를 **연결해서 사용**
- 컨테이너를 삭제해도 **데이터는 유지**됨
- 작업 폴더에 `mysql_data/` 디렉토리가 생기고, 직접 파일을 확인할 수 있음
- Windows/Mac에서는 성능이 다소 느릴 수 있음

## 핵심 정리

> 볼륨은 데이터를 여러 곳에 **복사**하는 것이 아니라, 하나의 저장소를 컨테이너가 **연결해서 사용**하는 것입니다. 데이터는 항상 **한 곳에만** 존재합니다.

| 방식 | 문법 | 데이터 실제 위치 | 컨테이너 삭제 시 |
|---|---|---|---|
| 볼륨 없음 | 설정 없음 | 컨테이너 내부 | ❌ 데이터 소멸 |
| Named Volume | `이름:/경로` | Docker 관리 영역 | ✅ 데이터 유지 |
| Bind Mount | `./경로:/경로` | 내 컴퓨터 폴더 | ✅ 데이터 유지 |

## 볼륨 관련 유용한 명령어

```bash
# Named Volume 목록 확인
docker volume ls

# 특정 볼륨의 상세 정보 (저장 경로 등) 확인
docker volume inspect <볼륨이름>

# 사용하지 않는 볼륨 정리
docker volume prune

# 컨테이너만 삭제 (볼륨 유지)
docker compose down

# 컨테이너 + 볼륨 모두 삭제 (주의!)
docker compose down -v
```
