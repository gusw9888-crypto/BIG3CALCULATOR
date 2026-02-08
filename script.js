// 1RM 계산 공식들
const formulas = {
    // 벤치프레스 - Epley 공식
    bench: {
        name: 'Epley',
        calculate1RM: (weight, reps) => {
            if (reps === 1) return weight;
            return weight * (1 + reps / 30);
        },
        calculateWeight: (oneRM, reps) => {
            if (reps === 1) return oneRM;
            return oneRM / (1 + reps / 30);
        }
    },

    // 데드리프트 - Brzycki 공식
    deadlift: {
        name: 'Brzycki',
        calculate1RM: (weight, reps) => {
            if (reps === 1) return weight;
            return weight * (36 / (37 - reps));
        },
        calculateWeight: (oneRM, reps) => {
            if (reps === 1) return oneRM;
            return oneRM * (37 - reps) / 36;
        }
    },

    // 스쿼트 - Lander 공식
    squat: {
        name: 'Lander',
        calculate1RM: (weight, reps) => {
            if (reps === 1) return weight;
            return (100 * weight) / (101.3 - 2.67123 * reps);
        },
        calculateWeight: (oneRM, reps) => {
            if (reps === 1) return oneRM;
            return oneRM * (101.3 - 2.67123 * reps) / 100;
        }
    }
};

// DOM 요소들
const exerciseSelect = document.getElementById('exercise');
const weightInput = document.getElementById('weight');
const repsInput = document.getElementById('reps');
const calculateBtn = document.getElementById('calculate');
const resultSection = document.getElementById('result-section');
const oneRMDisplay = document.getElementById('one-rm');
const formulaUsed = document.getElementById('formula-used');
const resultBody = document.getElementById('result-body');

// 계산 버튼 클릭 이벤트
calculateBtn.addEventListener('click', calculateRM);

// Enter 키로도 계산 가능하도록
weightInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateRM();
});

repsInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateRM();
});

function calculateRM() {
    // 입력값 가져오기
    const exercise = exerciseSelect.value;
    const weight = parseFloat(weightInput.value);
    const reps = parseInt(repsInput.value);

    // 유효성 검사
    if (!weight || weight <= 0) {
        alert('무게를 올바르게 입력해주세요.');
        weightInput.focus();
        return;
    }

    if (!reps || reps <= 0 || reps > 30) {
        alert('횟수를 1~30 사이로 입력해주세요.');
        repsInput.focus();
        return;
    }

    // 선택된 운동의 공식 가져오기
    const formula = formulas[exercise];

    // 1RM 계산
    const oneRM = formula.calculate1RM(weight, reps);

    // 1RM 표시
    oneRMDisplay.textContent = `${oneRM.toFixed(1)} kg`;
    formulaUsed.textContent = `${formula.name} 공식 사용 (입력: ${weight}kg × ${reps}회)`;

    // 10~1회 예상 무게 계산 및 표시 (역순)
    resultBody.innerHTML = '';

    for (let i = 10; i >= 1; i--) {
        const estimatedWeight = formula.calculateWeight(oneRM, i);
        const percentage = (estimatedWeight / oneRM * 100).toFixed(0);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${i}회</strong></td>
            <td><strong>${estimatedWeight.toFixed(1)} kg</strong></td>
            <td class="percentage">${percentage}%</td>
        `;

        // 입력한 횟수와 같은 행 강조
        if (i === reps) {
            row.style.background = '#e8eaf6';
            row.style.fontWeight = 'bold';
        }

        resultBody.appendChild(row);
    }

    // 결과 섹션 표시 (부드럽게)
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 페이지 로드 시 첫 번째 입력 필드에 포커스
window.addEventListener('load', () => {
    weightInput.focus();
});

// 음성 입력 기능
const voiceBtn = document.getElementById('voice-input');
const voiceStatus = document.getElementById('voice-status');

// Web Speech API 지원 확인
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.add('listening');
        voiceStatus.textContent = '🎤 듣는 중... (예: "100킬로 5회")';
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        voiceStatus.textContent = `인식됨: "${transcript}"`;

        // 음성에서 숫자 추출
        const parsedData = parseVoiceInput(transcript);

        if (parsedData.weight && parsedData.reps) {
            weightInput.value = parsedData.weight;
            repsInput.value = parsedData.reps;
            voiceStatus.textContent = `✅ ${parsedData.weight}kg × ${parsedData.reps}회 입력 완료!`;

            // 2초 후 자동으로 계산
            setTimeout(() => {
                calculateRM();
            }, 1000);
        } else {
            voiceStatus.textContent = '❌ 무게와 횟수를 다시 말씀해주세요';
        }

        voiceBtn.classList.remove('listening');
    };

    recognition.onerror = (event) => {
        voiceStatus.textContent = `오류: ${event.error === 'no-speech' ? '음성이 감지되지 않았습니다' : '음성 인식 실패'}`;
        voiceBtn.classList.remove('listening');
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
    };
} else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = '🎤 음성 입력 미지원';
    voiceStatus.textContent = '이 브라우저는 음성 인식을 지원하지 않습니다';
}

// 음성 입력 파싱 함수
function parseVoiceInput(text) {
    // 한글 숫자를 아라비아 숫자로 변환
    const koreanNumbers = {
        '일': 1, '이': 2, '삼': 3, '사': 4, '오': 5,
        '육': 6, '칠': 7, '팔': 8, '구': 9, '십': 10,
        '백': 100, '천': 1000
    };

    // "100킬로 5회", "백킬로 다섯회", "100kg 5번" 등 다양한 형식 지원
    const numbers = text.match(/\d+/g) || [];

    let weight = null;
    let reps = null;

    if (numbers.length >= 2) {
        weight = parseFloat(numbers[0]);
        reps = parseInt(numbers[1]);
    } else if (numbers.length === 1) {
        // 하나의 숫자만 있는 경우, 무게로 간주
        weight = parseFloat(numbers[0]);

        // 횟수를 한글로 찾기
        const repsMatch = text.match(/(일|이|삼|사|오|육|칠|팔|구|십)회/);
        if (repsMatch) {
            reps = koreanNumbers[repsMatch[1]] || null;
        }
    }

    return { weight, reps };
}
