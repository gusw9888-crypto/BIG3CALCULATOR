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
