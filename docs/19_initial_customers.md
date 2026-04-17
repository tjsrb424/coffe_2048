# 초기 손님 시트 (콘텐츠 기준)

`src/data/customers/initialCustomers.ts`에 정의된 손님 프로필과, 로컬라이즈 키(`locale/messages/ko.ts`의 `customer.<id>.*`)를 함께 맞춘다.

## 데이터 위치와 확장

| 항목 | 설명 |
| --- | --- |
| 프로필 배열 | `INITIAL_CUSTOMERS` (`SAMPLE_CUSTOMERS`는 동일 배열의 호환 별칭) |
| 표시 문자열 | 모든 이름·소개·스토리 제목은 `MessageId`로만 연결 |
| 태그 | `CustomerTag` enum에 맞춤 (`quiet`, `regular`, `sweet_tooth`, `espresso_lover`, `late_night`) |
| 선호 메뉴 | `DrinkMenuId` 배열 (`americano`, `latte`, `affogato`) |

손님을 추가할 때는 **한 프로필 블록 + ko 메시지 묶음**을 같이 넣는다. 인덱스/스토어는 배열 순서·`id` 목록을 자동으로 따른다.

## 캐릭터 시트

| 이름(id) | 태그 | 선호 메뉴 | 성격(한 줄) | 애정 해금 포인트(스토리 단계) |
| --- | --- | --- | --- | --- |
| 한은 `han_eun` | 조용함, 에스프레소 | 아메리카노 | 창가를 좋아하는 단골 후보 | 0 → 첫 단계, 6 → 다음 조각 |
| 효임 `hyo_im` | 달콤한 취향 | 아포가토, 카페 라떼 | 디저트 계열을 즐김 | 0, 8 |
| 서준 `seo_jun` | 늦은 밤 | 카페 라떼 | 늦은 시간에 들르는 손님 | 0, 10 |

**애정도 구간별 해금**은 각 `storySteps[].unlockAtAffection`이 기준이다. 카운터 UI의「다음 조각까지」는 **현재 애정보다 큰 임계치 중 최솟값**까지 남은 수치로 표시된다. 더 열 단계가 없으면 가게 애정과 함께 마무리 문구로 전환된다.

## 스토리 대규모 확장 시

- 단계가 많아지면 `storySteps`만 늘리고, 같은 방식으로 `customer.<id>.story.stepN` 키를 추가한다.
- UI는 짧은 조각만 전제로 하므로, 엽서·카드 레벨의 별도 화면은 `docs/08_dev_roadmap.md` 일정에 맞춰 분리하는 것을 권장한다.
