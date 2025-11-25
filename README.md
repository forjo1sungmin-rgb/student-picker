# Student Picker 🎲

React 기반으로 제작된 **학급 자리 뽑기 & 랜덤 학생 선택 웹 애플리케이션**입니다.  
복잡한 설치 없이 웹 브라우저에서 바로 좌석 배치, 랜덤 호출, 학생 관리를 손쉽게 처리할 수 있습니다.

## ✨ 주요 기능

- **🎯 랜덤 학생 지목**: 발표자나 당번을 뽑을 때 유용합니다.
- **🪑 좌석 배치도 자동 생성**: 행/열만 입력하면 원클릭으로 자리를 섞어줍니다.
- **📌 자리 고정 (Pinning)**: 시력이 나쁜 학생이나 특정 학생의 자리를 고정해두고 나머지만 섞을 수 있습니다.
- **💾 데이터 자동 저장**: 입력한 학생 명단과 자리 배치는 브라우저에 자동 저장됩니다.
- **📱 반응형 디자인**: PC, 태블릿, 모바일 어디서든 최적화된 화면을 제공합니다.

## 🛠 기술 스택

- **Core**: React, JavaScript (ES6+)
- **Build Tool**: Vite (또는 CRA)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🚀 시작하기 (Getting Started)

이 프로젝트를 로컬 컴퓨터에서 실행하려면 다음 명령어를 순서대로 입력하세요.

### 설치 및 실행

1. 저장소를 클론(Clone)합니다.
   ```bash
   git clone [https://github.com/YOUR_USERNAME/student-picker.git](https://github.com/YOUR_USERNAME/student-picker.git)
   cd student-picker
패키지를 설치합니다.

Bash

npm install
개발 서버를 실행합니다.

Bash

npm run dev
📝 사용 방법 (Tutorial)
설정 탭: 학생 명단을 입력합니다. (예: 1번 김철수 형식으로 줄바꿈하여 입력)

자리 뽑기 탭: 원하는 행/열 개수를 설정하고 '자리 섞기'를 누릅니다.

고정 하기: 자리에 배정된 학생 이름 옆의 📌 버튼을 누르면 다음 섞기 때 자리가 변경되지 않습니다.

👤 만든 사람 (Author)
조성민 (Seongmin Jo)

GitHub: @forjo1sungmin-rgb

📄 라이선스 (License)
This project is licensed under the MIT License.
