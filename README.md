# 도쿄 한 정거장 · Tokyo Eki

도쿄메트로 역 이름을 순서대로 입력하며 동네의 명소와 먹거리를 발견하는 타이핑 게임입니다.

- 도쿄메트로 9개 노선, 한국어·영어·일본어 입력
- 여행 / 암기 / 120초 타임어택
- 노선 역순 진행, 마루노우치선 본선·호난초 지선 분리
- 노선 선택 → 운행 구간 설정 → 3초/5초 카운트다운 → 전체 화면 운행
- 입력에 따라 움직이는 열차와 부드러운 지도 추적, 이전·현재·다음 역 안내
- 다크·화이트 모드, 지도 확대·축소·드래그, 열차 따라가기
- 톱니바퀴 설정: 일반 / 사운드 / 지도, 클래식·다이내믹 이동, 직접·자동 출발, 한글 자모·글자 삭제
- 직접 제작한 명소·음식 삽화, 도쿄 산책·노선 아틀라스 지도 스킨
- 진행도·정확도·입력 속도·연속 정답, 나가기 확인과 설정창 일시정지
- 브라우저에 저장하는 여행 수첩, 완주 기록, JSON 내보내기
- 긴자선 19개 역 전체와 다른 노선의 주요 관광역에 동네 정보 제공. 나머지 역에는 정보 준비 중 안내와 공식 관광 링크 표시

## 실행

Node.js 24 이상에서 **이 README가 있는 `tokyo-eki` 폴더**를 터미널로 열고 실행하세요.

```powershell
node scripts/serve.mjs
```

브라우저에서 http://127.0.0.1:4180 을 엽니다. 종료는 터미널에서 `Ctrl+C`입니다. 별도 패키지 설치나 API 키는 필요하지 않습니다. npm이 있다면 `npm run dev`도 같습니다. ES 모듈을 사용하므로 `index.html`을 파일 탐색기에서 더블클릭하는 대신 서버로 열어주세요.

```powershell
node --test tests/*.test.mjs
```

## GitHub에 올리고 웹사이트 배포하기

GitHub 저장소는 소스 코드를 보관하고, GitHub Pages는 플레이 가능한 웹 주소를 제공합니다. `.github/workflows/deploy-pages.yml`에 자동 배포 설정을 준비해 두었습니다. 워크플로는 `scripts/build-pages.mjs`로 공개할 브라우저 파일만 `.pages-output/`에 모아 배포합니다. 별도의 빌드 패키지 설치는 필요하지 않습니다.

공개 전에는 [SECURITY.md](./SECURITY.md)의 계정 보호·저장소 권한·HTTPS·응답 헤더 항목을 확인하세요. 게임은 외부 스크립트와 자산 없이 실행되며, GitHub Actions는 커밋 SHA 고정 및 최소 권한 설정을 사용합니다. GitHub Pages에서는 `_headers` 설정이 자동 적용되지 않는 한계도 문서에 적었습니다.

### 1. 저장소 준비

GitHub에서 **New repository**로 새 저장소(예: `tokyo-eki`)를 만드세요. GitHub Free에서 Pages를 사용하려면 **Public** 저장소를 사용하세요. 처음에는 README나 `.gitignore` 자동 생성을 선택하지 않는 편이 간단합니다.

### 2. 소스 업로드

GitHub Desktop에서 **File → Add local repository**로 이 `tokyo-eki` 폴더를 추가하고 **Publish repository**로 새 저장소에 게시할 수 있습니다. 프로젝트가 이미 Sites 원격 저장소와 연결되어 있다면, 별도 복사본에 `.git`, `.openai` 폴더를 제외하고 소스를 복사한 뒤 GitHub Desktop에서 새 저장소를 만드는 방법이 가장 단순합니다.

터미널을 사용하려면 아래 `YOUR_ID`를 본인 GitHub 아이디로 바꾸세요. 이 프로젝트에 Git 저장소가 이미 있는 경우 `git init`은 생략합니다. `github`이라는 원격 이름을 사용하므로 기존 Sites용 원격을 덮어쓰지 않습니다.

```powershell
git init -b main
git add .
git commit -m "Create Tokyo Eki typing game"
git remote add github https://github.com/YOUR_ID/tokyo-eki.git
git push -u github HEAD:main
```

`git commit`에서 변경 사항이 없다고 나오면 기존 커밋을 그대로 사용하고 다음 명령으로 진행하세요. `github` 원격이 이미 있으면 `git remote -v`로 주소를 확인하고 추가 명령은 생략하세요.

**중요:** GitHub 저장소의 맨 위에 `package.json`, `dist`, `tests`, `.github`가 있어야 합니다. 상위 폴더를 통째로 올려 `tokyo-eki/dist` 구조가 되면 제공한 워크플로 경로와 맞지 않습니다.

### 3. Pages 활성화

1. GitHub 저장소 → **Settings → Pages**로 이동합니다.
2. **Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. **Actions → Deploy Tokyo Eki to GitHub Pages → Run workflow → main**으로 최초 배포합니다. 첫 push가 Pages 활성화 전에 실패했다면 이 단계로 다시 실행하면 됩니다.
4. 작업이 초록색으로 완료되면 **Settings → Pages**의 **Visit site**를 누릅니다. 기본 주소는 `https://YOUR_ID.github.io/tokyo-eki/` 형태입니다.

공식 안내: [GitHub Pages 게시 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub Pages 사용자 지정 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### 4. 수정할 때마다 자동 갱신

```powershell
git add .
git commit -m "Update Tokyo Eki"
git push github HEAD:main
```

`main`에 올라간 수정은 자동 검증 후 배포됩니다. GitHub Desktop에서는 **Commit → Push origin**으로 같은 작업을 할 수 있습니다. 사이트의 모든 자산 경로가 상대 경로라 저장소 이름을 바꿔도 정상 실행됩니다.

### 문제 해결

- **404**: Actions 배포가 완료됐는지, Pages Source가 GitHub Actions인지 확인합니다.
- **npm test 파일을 못 찾음**: 저장소 최상위에 `package.json`과 `tests`가 있는지 확인합니다.
- **원격 저장소에 기존 커밋이 있어 push 거절**: 새 빈 저장소를 사용하거나 GitHub Desktop에서 기존 저장소를 clone해 그 안에 소스를 복사하세요. 강제 push는 필요하지 않습니다.
- **기록이 사라짐**: 기록은 브라우저·사이트 주소별 localStorage에 저장됩니다. 다른 기기·다른 주소·시크릿 모드 사이에 동기화되지 않습니다. 수첩 내보내기로 JSON 백업이 가능합니다. 가져오기 기능은 없습니다.

## 구조와 확장

`dist/index.html`, `style.css`: 화면과 반응형 스타일. `app.js`: 게임 진행과 수첩. `engine.js`: 시간·진행·한글 삭제·설정 검증. `game.js`: 입력 판정과 노선 순서. `stations.js`: 공식 역 데이터. `places.js`: 명소와 먹거리 설명. `map.js`, `geo.js`: 학습용 지도·카메라·열차 이동. `art.js`: 직접 제작한 명소·음식·열차 삽화. `storage.js`: 저장 데이터 검증·출력 이스케이프·외부 링크 검증. `_headers`: 지원하는 호스팅용 보안 응답 헤더.

Sites에는 `node scripts/build-worker.mjs`로 같은 게임 파일과 보안 헤더를 포함하는 `dist/server/index.js`를 생성해 배포합니다. 이 파일은 자동 생성되므로 직접 편집하지 않습니다. `worker/handler.mjs`는 허용된 정적 파일만 응답하고 HTTP 보안 헤더를 붙이며 사용자 기록을 수집하거나 저장하지 않습니다. GitHub Pages는 Worker 없이 같은 브라우저 게임을 실행합니다.

동네 정보는 `dist/places.js`에 역 ID를 키로 추가합니다. 음식이 없는 지역을 억지로 특산품으로 지정하지 않고, 대표적인 지역 음식이나 음식 문화를 구분해 안내했습니다. 지도는 학습용 개략도이며 길찾기 서비스가 아닙니다. 현재 싱글 플레이이며 실시간 멀티플레이와 서버 랭킹은 포함하지 않습니다.

공식 역 데이터 갱신은 `npm run refresh:stations`로 합니다. 인터넷 연결이 필요하며, 갱신 뒤 `npm test`를 실행해 언어별 누락과 노선 순서를 확인하세요. 자료 출처는 [SOURCES.md](./SOURCES.md)에 정리했습니다.
