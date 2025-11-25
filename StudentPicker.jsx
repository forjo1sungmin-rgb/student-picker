import React, { useState, useEffect } from 'react';
import { Settings, Users, Shuffle, User, HelpCircle, Pin, Moon, Sun } from 'lucide-react';

const APP_VERSION = 'v1.2.0';

export default function StudentPicker() {
  const [activeTab, setActiveTab] = useState('seat');
  const [students, setStudents] = useState([]);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [seatArrangement, setSeatArrangement] = useState([]);
  const [pinnedSeats, setPinnedSeats] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [pickCount, setPickCount] = useState(1);
  const [studentInput, setStudentInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // 초기 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem('students');
    const savedPins = localStorage.getItem('pinnedSeats');
    if (saved) {
      setStudents(JSON.parse(saved));
    }
    if (savedPins) {
      setPinnedSeats(JSON.parse(savedPins));
    }
  }, []);

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('pinnedSeats', JSON.stringify(pinnedSeats));
  }, [pinnedSeats]);

  // 학생 추가 (ID 부여 로직 추가됨)
  const handleAddStudents = () => {
    const lines = studentInput.trim().split('\n').filter(line => line.trim());
    const newStudents = lines.map((line, index) => {
      const parts = line.trim().split(/\s+/);
      // 동명이인 구분을 위한 고유 ID 생성 (현재시간 + 인덱스)
      const uniqueId = Date.now() + index;
      
      if (parts.length >= 2) {
        return { id: uniqueId, number: parts[0], name: parts.slice(1).join(' ') };
      }
      return { id: uniqueId, number: '', name: line.trim() };
    });
    setStudents([...students, ...newStudents]);
    setStudentInput('');
  };

  const handleDeleteStudent = (index) => {
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
    if (newStudents.length === 0) {
      localStorage.removeItem('students');
    }
  };

  const handleClearAll = () => {
    const confirmed = window.confirm('모든 학생 정보를 삭제하시겠습니까?');
    if (confirmed) {
      setStudents([]);
      setPinnedSeats({}); // 학생 삭제 시 고정석도 초기화
      localStorage.removeItem('students');
      localStorage.removeItem('pinnedSeats');
    }
  };

  // 자리 섞기 (ID 기준 필터링 적용)
  const shuffleSeats = () => {
    if (students.length === 0) {
      alert('학생을 먼저 등록해주세요!');
      return;
    }

    setIsAnimating(true);
    
    // 고정된 학생들의 ID 추출
    const pinnedStudents = Object.values(pinnedSeats);
    const pinnedStudentIds = pinnedStudents.map(s => s.id);
    
    // ID를 기준으로 고정되지 않은 학생들만 필터링 (동명이인 문제 해결)
    const unpinnedStudents = students.filter(s => !pinnedStudentIds.includes(s.id));
    const shuffled = [...unpinnedStudents].sort(() => Math.random() - 0.5);
    
    const arrangement = [];
    let shuffledIndex = 0;
    
    for (let i = 0; i < rows; i++) {
      arrangement[i] = [];
      for (let j = 0; j < cols; j++) {
        const seatKey = `${i}-${j}`;
        
        // 고정된 자리가 있으면 그대로 사용
        if (pinnedSeats[seatKey]) {
          arrangement[i][j] = pinnedSeats[seatKey];
        } else {
          // 고정되지 않은 학생 배치
          arrangement[i][j] = shuffledIndex < shuffled.length ? shuffled[shuffledIndex++] : null;
        }
      }
    }
    
    setTimeout(() => {
      setSeatArrangement(arrangement);
      setIsAnimating(false);
    }, 500);
  };

  const togglePinSeat = (rowIndex, colIndex) => {
    const seatKey = `${rowIndex}-${colIndex}`;
    const student = seatArrangement[rowIndex][colIndex];
    
    if (!student) return;
    
    const newPinnedSeats = { ...pinnedSeats };
    
    if (pinnedSeats[seatKey]) {
      // 고정 해제
      delete newPinnedSeats[seatKey];
    } else {
      // 고정
      newPinnedSeats[seatKey] = student;
    }
    
    setPinnedSeats(newPinnedSeats);
  };

  const clearAllPins = () => {
    const confirmed = window.confirm('모든 자리 고정을 해제하시겠습니까?');
    if (confirmed) {
      setPinnedSeats({});
    }
  };

  const pickRandomStudents = () => {
    if (students.length === 0) {
      alert('학생을 먼저 등록해주세요!');
      return;
    }

    const count = Math.min(pickCount, students.length);
    setIsAnimating(true);
    setSelectedStudents([]);
    
    setTimeout(() => {
      const shuffled = [...students].sort(() => Math.random() - 0.5);
      setSelectedStudents(shuffled.slice(0, count));
      setIsAnimating(false);
    }, 500);
  };

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
    setActiveTab('settings');
  };

  const nextTutorialStep = () => {
    if (tutorialStep === 0) {
      setTutorialStep(1);
    } else if (tutorialStep === 1) {
      setTutorialStep(2);
      setActiveTab('seat');
    } else if (tutorialStep === 2) {
      setTutorialStep(3);
      setActiveTab('random');
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
      setActiveTab('help');
    }
  };

  const tutorialContent = [
    {
      title: '1단계: 학생 등록하기',
      content: '설정 탭에서 학생 정보를 입력하세요. "번호 이름" 형식으로 한 줄에 한 명씩 입력한 후 "학생 추가" 버튼을 클릭하세요.',
      tab: 'settings'
    },
    {
      title: '2단계: 학생 확인하기',
      content: '등록된 학생 목록을 확인하세요. 잘못 입력된 학생은 "삭제" 버튼으로 제거할 수 있습니다.',
      tab: 'settings'
    },
    {
      title: '3단계: 자리 뽑기',
      content: '자리 뽑기 탭으로 이동했습니다. 행/열을 설정하고 "자리 섞기" 버튼을 클릭하면 학생들이 무작위로 배치됩니다. 📌 핀 버튼으로 특정 자리를 고정할 수 있어요!',
      tab: 'seat'
    },
    {
      title: '4단계: 랜덤 지목하기',
      content: '랜덤 지목 탭에서 지목할 인원수를 입력하고 "뽑기" 버튼을 클릭하세요. 완료!',
      tab: 'random'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* 튜토리얼 오버레이 */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-indigo-900">
                  {tutorialContent[tutorialStep].title}
                </h3>
                <span className="text-sm text-gray-500">
                  {tutorialStep + 1} / {tutorialContent.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((tutorialStep + 1) / tutorialContent.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">
              {tutorialContent[tutorialStep].content}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTutorial(false);
                  setTutorialStep(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                건너뛰기
              </button>
              <button
                onClick={nextTutorialStep}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {tutorialStep === tutorialContent.length - 1 ? '완료' : '다음'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
              JS
            </div>
            <h1 className="text-4xl font-bold text-indigo-900">
              학급 관리 시스템
            </h1>
          </div>
          <p className="text-sm text-gray-600">{APP_VERSION}</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-md overflow-x-auto">
          <button
            onClick={() => setActiveTab('seat')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'seat'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users size={20} />
            자리 뽑기
          </button>
          <button
            onClick={() => setActiveTab('random')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'random'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User size={20} />
            랜덤 지목
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings size={20} />
            설정
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'help'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HelpCircle size={20} />
            도움말
          </button>
        </div>

        {/* 자리 뽑기 탭 */}
        {activeTab === 'seat' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">행</label>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border rounded-md"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">열</label>
                <input
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border rounded-md"
                  min="1"
                />
              </div>
              <button
                onClick={shuffleSeats}
                disabled={isAnimating}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Shuffle size={20} />
                자리 섞기
              </button>
              {Object.keys(pinnedSeats).length > 0 && (
                <button
                  onClick={clearAllPins}
                  className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-all text-sm"
                >
                  고정 전체 해제
                </button>
              )}
            </div>

            {Object.keys(pinnedSeats).length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  📌 {Object.keys(pinnedSeats).length}개의 자리가 고정되어 있습니다. 
                  고정된 학생은 자리 섞기에서 제외됩니다.
                </p>
              </div>
            )}

            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
              {seatArrangement.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[600px]">
                    <tbody>
                      {seatArrangement.map((row, i) => (
                        <tr key={i}>
                          {row.map((student, j) => {
                            const seatKey = `${i}-${j}`;
                            const isPinned = !!pinnedSeats[seatKey];
                            
                            return (
                              <td key={j} className="border border-gray-300 p-2 w-32 h-24">
                                {student ? (
                                  <div className="relative h-full">
                                    <div className={`h-full p-2 rounded text-center transition-colors flex flex-col justify-center items-center ${
                                      isPinned 
                                        ? 'bg-amber-100 border-2 border-amber-400' 
                                        : 'bg-indigo-50 hover:bg-indigo-100'
                                    }`}>
                                      <div className="text-xs text-gray-600 mb-1">{student.number}</div>
                                      <div className="font-semibold text-indigo-900 break-keep">{student.name}</div>
                                    </div>
                                    <button
                                      onClick={() => togglePinSeat(i, j)}
                                      className={`absolute top-1 right-1 p-1 rounded-full transition-all ${
                                        isPinned
                                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                      }`}
                                      title={isPinned ? '고정 해제' : '자리 고정'}
                                    >
                                      <Pin size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="h-full bg-gray-50 rounded"></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                  자리 섞기 버튼을 눌러주세요
                </div>
              )}
            </div>
          </div>
        )}

        {/* 랜덤 지목 탭 */}
        {activeTab === 'random' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6 flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium mb-1">지목 인원</label>
                <input
                  type="number"
                  value={pickCount}
                  onChange={(e) => setPickCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 px-3 py-2 border rounded-md"
                  min="1"
                />
              </div>
              <button
                onClick={pickRandomStudents}
                disabled={isAnimating}
                className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle size={20} />
                뽑기
              </button>
            </div>

            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
              {selectedStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedStudents.map((student, i) => (
                    <div
                      key={student.id || i}
                      className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform"
                    >
                      <div className="text-sm opacity-80">{student.number}</div>
                      <div className="text-2xl font-bold mt-2">{student.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                  뽑기 버튼을 눌러주세요
                </div>
              )}
            </div>
          </div>
        )}

        {/* 설정 탭 */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">학생 관리</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                학생 추가 (한 줄에 한 명씩, 형식: 번호 이름)
              </label>
              <textarea
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder="예시:&#10;1 김철수&#10;2 이영희&#10;3 박민수"
                className="w-full h-32 px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                onClick={handleAddStudents}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                학생 추가
              </button>
            </div>

            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                등록된 학생 ({students.length}명)
              </h3>
              <button
                onClick={handleClearAll}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                전체 삭제
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {students.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left w-20">번호</th>
                      <th className="px-4 py-2 text-left">이름</th>
                      <th className="px-4 py-2 text-center w-20">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id || index} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{student.number}</td>
                        <td className="px-4 py-2">{student.name}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteStudent(index)}
                            className="text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded hover:bg-red-50"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  등록된 학생이 없습니다
                </div>
              )}
            </div>
          </div>
        )}

        {/* 도움말 탭 */}
        {activeTab === 'help' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">도움말</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">🪑 자리 뽑기</h3>
                <p className="text-gray-700 mb-2">교실의 행과 열을 설정하고 학생들을 무작위로 배치합니다.</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>행/열 개수를 입력하세요</li>
                  <li>"자리 섞기" 버튼을 클릭하면 랜덤으로 배치됩니다</li>
                  <li>학생 수보다 좌석이 많으면 빈 자리가 표시됩니다</li>
                  <li>📌 핀 버튼을 클릭하면 특정 자리를 고정할 수 있습니다</li>
                  <li>고정된 학생은 자리 섞기에서 제외됩니다</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">🎯 랜덤 지목</h3>
                <p className="text-gray-700 mb-2">원하는 인원수만큼 학생을 무작위로 선택합니다.</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>지목할 인원수를 입력하세요</li>
                  <li>"뽑기" 버튼을 클릭하면 선택됩니다</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">⚙️ 설정</h3>
                <p className="text-gray-700 mb-2">학생 정보를 등록하고 관리합니다.</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>한 줄에 한 명씩 입력하세요 (형식: 번호 이름)</li>
                  <li>데이터는 자동으로 브라우저에 저장됩니다</li>
                </ul>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-indigo-900 mb-2">📱 앱 정보</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>버전: {APP_VERSION}</p>
                  <p>개발자: 조성민</p>
                  <p className="text-xs text-gray-500 mt-3">COPYRIGHT © JS DEV STUDIO.CO</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={startTutorial}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  📚 TUTORIAL 다시보기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>COPYRIGHT © JS DEV STUDIO.CO</p>
          <p className="text-xs mt-1">All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}