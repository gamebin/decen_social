---
title: GAMEKIKI# OPEN API
---

# GAMEKIKI# OPEN API

---

new release 0.9.9

## HOTFIX 20190423_01

- `pickMgReward API` 수정
  - 카페24 경품으로 기프티콘 선택했을 경우 오류 해결

## HOTFIX 20190322_02

- `getCafe24Token API` 추가
  - API 내부에서 사용하던 Cafe24 Token 발급 관련 로직 내부 API로 오픈

## HOTFIX 20190305_02

- `pickMgReward API` 수정
  - 카페24 API 적용 : 마일리지 지급

## HOTFIX 20190227_01

- `login API` 수정
  - logger.debug 코드 추가

## HOTFIX 20190226_03

- `login API` 수정
  - logger.debug 코드 오류 수정

## HOTFIX 20190226_03

- `login API` 수정
  - logger.debug 코드 오류 수정

## HOTFIX 20190226_02

- `login API` 수정
  - 기존 userId만 사용한 경우라도 login API 호출시 userName이 있는 경우 User 데이터 업데이트 되도록 수정

## HOTFIX 20190129_01

- userIP 값을 'validateRequest'에서 생성하도록 수정
- `login API` 수정
  - userName 옵션값으로 전달 받을 수 있도록 수정

## HOTFIX 20190125_01

- `pickrwd API` 수정
  - mg_main.mgRestrict `A`인 경우 최종 로그확인 로직 오류 수정

## HOTFIX 20181204_01

- `pickrwd API` 수정
  - mg_st 기존데이터 있는경우에도 기존당첨정보 업데이트 후 당첨정보 새로 추가되는 오류 수정

## HOTFIX 20181012_06

- `pickrwd API` 수정
  - extAPI parameter(couponLinkUrl) 추가

## HOTFIX 20181011_02

- `pickrwd API` 수정
  - 출석체크 혜택으로 기프티콘이나 쿠폰, 기타 선택된 경우 처리 가능하도록 수정
- `dclog` query 수정
  - 당첨내역 종류에 'G'/'C' 보여지도록 수정
  - 연속당첨일 경우 단회출석내용은 보여지지 않고 연속출석당첨 내용만 보여짐

## HOTFIX 20181005_03

- `DATABASE` 변경부분 반영
- `dclog` query 수정

## HOTFIX 20180927_01

- `pickMgReward API` mgExtLog rwdType, rwdValue 추가/변경

## HOTFIX 20180918_02

- `pickMgReward API` mgExtLog 추가

## HOTFIX 20180814_02

- `pickMgReward API` externalAPI 조건 수정

## HOTFIX 20180814_01

- `login API` 오류 메시지 수정

## HOTFIX 20180806_01

- `gkpoint API` deprecated
  - 외부 API 호출 테스트
- `token expired` 된 경우에 대한 updatedToken 'Y/N' 적용되도록 수정

## HOTFIX 20180723_02

- `gkpoint API` 추가
  - 외부 API 호출 테스트

## HOTFIX 20180723_01

- `pickMgReward API` 수정
  - `mg_log.rwdId` 수정

## HOTFIX 20180719_02

- `pickMgReward API` 수정
  - `m_contCnt` 초기값 1로 설정

## HOTFIX 20180718_01

- `tracklog API` 수정
  - `mgType` 추가

## HOTFIX 20180706_01

- `pickMgReward API` 수정
  - 출석체크 처리로직 추가
- `dclog API` 추가

## HOTFIX 20180704_01

- `pickMgReward API` 수정
  - API 완료시점에 mg_log count와 mgRestrict 체크로직 추가

## HOTFIX 20180703_01

- `toplist API` 수정
  - `group by` 조건 삭제

## HOTFIX 20180615_01

- `pickMgReward API` 수정(경품타입 'P'인 경우에도 당첨제한 적용)

## HOTFIX 0.9.9.9

- `toplist` API 수정

## HOTFIX 0.9.9.7

- `x-auth-token` 추가
