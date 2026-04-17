# 로컬라이징(i18n) 운영 방침

## 목표

- 화면 문자열은 코드에 하드코딩하지 않고 **메시지 사전**으로 모은다.
- 도메인 데이터(메뉴·손님·스토리 노드)는 **textId**로 연결해, 번역 파일만 추가해도 언어를 늘릴 수 있게 한다.
- 지금은 **한국어(ko)만** 제공하며, `en` / `ja` / `zh` 사전은 후속 스프린트에서 같은 키(`MessageId`)로 추가한다.

## 레이아웃

| 구역 | 역할 |
| --- | --- |
| `locale/messages/ko.ts` | ko 기본 문자열 사전. 키는 안정적인 점으로 구분한 문자열 id (예: `lobby.sheet.roast.title`). |
| `src/locale/i18n.ts` | `t(id, vars)` — 현재 로케일 메시지 조회·`{{var}}` 치환. |
| `src/data/drinkMenuTextIds.ts` | 음료 메뉴 id별 `nameTextId` / `descriptionTextId`. |
| `src/data/customers/initialCustomers.ts` | 손님 `nameTextId`, 선택 `introTextId`, 스토리 `titleTextId`. |

## 규칙

1. **새 UI 문구**: 먼저 `ko.ts`에 키를 추가한 뒤 `t("...")`로 참조한다.
2. **메뉴/손님 데이터**: 표시용 이름·설명은 데이터에 직접 쓰지 않고 textId만 둔다.
3. **이미지 안 텍스트**: 원칙적으로 피한다. **로고 등 불가피한 경우** 언어별 에셋 경로를 분기할 수 있도록 주석·이슈에 남긴다 (예: `/images/brand/…`).
4. **퍼즐 엔진·경제 수치**: 사전과 분리한다. 라벨만 사전, 숫자·공식은 기존 모듈 유지.

## 다음 단계(미구현)

- `NEXT_PUBLIC_LOCALE` 또는 설정 스토어와 연동한 로케일 선택.
- `locale/messages/en.ts` 등 동일 키 구조 추가.
- 동적 복수·은어별 조사는 필요 시만 `t` 확장 또는 ICU 도입 검토.
