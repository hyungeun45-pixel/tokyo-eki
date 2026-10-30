# 자료 출처

확인일: 2026-10-30.

- [Metro Typing](https://metrotyping.kr/): 실제 노선의 역명을 순서대로 입력하는 기본 게임 방식 참고. 사이트 소스·디자인·자산을 복제하지 않았습니다.
- [Tokyo Metro 한국어 노선도](https://www.tokyometro.jp/kr/subwaymap/index.html): 범위, 노선 색상, 역 번호 기준.
- 역 목록: `https://www.tokyometro.jp/lang_kr/station/line_ginza/index.html` 등 9개 노선의 한국어·영어·일본어 공식 페이지. `scripts/fetch-stations.mjs`에 사용 URL을 구성하는 코드가 있습니다. 치요다선 C07은 같은 역인 마루노우치선 M14의 공식 역명으로 보완합니다.
- [GO TOKYO 공식 관광 안내](https://www.gotokyo.org/kr/): 지역의 명소와 문화 참고. 각 동네 카드에 지역별 공식 URL을 연결했습니다.
- [JNTO 아사쿠사](https://www.japan.travel/en/destinations/kanto/tokyo/asakusa-and-around/): 센소지, 전통 거리와 먹거리 참고.
- [GO TOKYO 우에노 산책](https://www.gotokyo.org/en/story/walks-and-tours/ueno/index.html): 공원·시장 문화 참고.
- [GitHub Pages 공식 워크플로 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): 배포 설정.

지도, 건물·명소 SVG, 엽서 삽화는 이 프로젝트용으로 직접 제작했습니다. 첨부된 Google Maps 화면은 정보 배치 방식의 참고로만 사용했으며 지도 타일이나 로고는 사용하지 않았습니다. 노선의 연결 순서는 공식 자료를 따르지만 지도 위치·거리·명소 아이콘 배치는 단순화했습니다. 이 프로젝트는 비공식 개인 학습용 게임입니다.

게임의 명소·음식·열차 삽화와 아이콘은 SVG로 직접 제작했습니다. 시스템 글꼴을 사용하며 외부 폰트·이미지·지도 API·유료 API를 호출하지 않습니다. 보안 설계 참고 자료와 호스팅별 차이는 [SECURITY.md](./SECURITY.md)에 정리했습니다.
