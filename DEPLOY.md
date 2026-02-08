# Cloudflare Pages 배포 가이드

## 1. Cloudflare 계정 준비

1. [Cloudflare](https://cloudflare.com) 계정 생성 (무료)
2. Dashboard에 로그인

## 2. GitHub 연동 배포 (권장)

### 2-1. Cloudflare Pages 프로젝트 생성
1. Cloudflare Dashboard → **Pages** 이동
2. **Create a project** 클릭
3. **Connect to Git** 선택
4. GitHub 계정 연동 및 `BIG3CALCULATOR` 리포지토리 선택

### 2-2. 빌드 설정
- **Framework preset**: None
- **Build command**: (비워두기)
- **Build output directory**: `/`
- **Root directory**: `/`

### 2-3. 환경 변수 설정
1. 프로젝트 생성 후 **Settings** → **Environment variables** 이동
2. 다음 변수 추가:
   - **Variable name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-...` (당신의 OpenAI API 키)
   - **Environment**: Production (및 Preview 선택)

3. **Save** 클릭

### 2-4. 배포
1. **Deployments** 탭으로 이동
2. 자동으로 배포가 시작됩니다
3. 배포 완료 후 제공된 URL로 접속 (예: `https://big3calculator.pages.dev`)

## 3. Wrangler CLI로 배포 (대안)

### 3-1. Wrangler 설치
```bash
npm install -g wrangler
```

### 3-2. Cloudflare 로그인
```bash
wrangler login
```

### 3-3. 환경 변수 설정
```bash
wrangler pages secret put OPENAI_API_KEY
# API 키 입력
```

### 3-4. 배포
```bash
wrangler pages deploy . --project-name=big3calculator
```

## 4. 확인사항

배포 후 확인:
- ✅ 정적 파일 로드 (HTML, CSS, JS)
- ✅ 음성 입력 기능 작동
- ✅ 1RM 계산 기능
- ✅ 음성 출력 기능 (TTS API)

## 5. 도메인 설정 (선택사항)

1. Cloudflare Pages 프로젝트 → **Custom domains**
2. 원하는 도메인 추가
3. DNS 설정 완료

## 문제 해결

### TTS 기능이 작동하지 않는 경우
1. Cloudflare Pages → **Settings** → **Environment variables**
2. `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
3. 변수 추가 후 **Redeploy** 필요

### 음성 입력이 작동하지 않는 경우
- HTTPS에서만 작동합니다 (Cloudflare Pages는 기본적으로 HTTPS 제공)
- 브라우저 마이크 권한 허용 확인
