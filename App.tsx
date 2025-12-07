import React, { useState } from 'react';
import { 
  Loader2, 
  Map, 
  BookOpen, 
  CheckCircle2, 
  Trophy, 
  ArrowRight, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Award,
  Layers
} from 'lucide-react';
import { AppState, RoadmapData, Module, QuizQuestion } from './types';
import { generateRoadmap } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<RoadmapData | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setState(AppState.GENERATING);
    setError(null);
    setData(null);
    setShowFinalQuiz(false);
    setExpandedModule(0);

    try {
      const result = await generateRoadmap(topic);
      setData(result);
      setState(AppState.READY);
    } catch (e: any) {
      setError(e.message || "Failed to generate roadmap");
      setState(AppState.ERROR);
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  return (
    <div className="min-h-screen transition-colors duration-500" 
         style={{ backgroundColor: data?.palette.background || '#f8fafc' }}>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg" style={{ backgroundColor: data?.palette.primary }}>
              <Map className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SkillPath AI</h1>
          </div>
          {data && (
             <div className="hidden sm:block text-sm font-medium text-gray-500">
               Pacing: 5-8 hours/week
             </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        
        {/* Input Section */}
        <section className="text-center space-y-6">
          {!data && (
            <>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                What do you want to learn?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Generate a structured, expert-level learning roadmap for any skill, hobby, or career path in seconds.
              </p>
            </>
          )}

          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. React Native, Pottery, Quantum Computing..."
              className="w-full h-14 pl-6 pr-32 rounded-full shadow-lg border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-lg transition-all"
              style={{ 
                caretColor: data?.palette.primary, 
                '--tw-ring-color': data?.palette.primary 
              } as React.CSSProperties}
            />
            <button
              onClick={handleGenerate}
              disabled={state === AppState.GENERATING || !topic.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 rounded-full font-semibold text-white transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              style={{ backgroundColor: data?.palette.primary || '#2563EB' }}
            >
              {state === AppState.GENERATING ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
            </button>
          </div>
          
          {error && (
            <div className="text-red-600 bg-red-50 py-2 px-4 rounded-lg inline-block">
              {error}
            </div>
          )}
        </section>

        {/* Roadmap Display */}
        {state === AppState.READY && data && (
          <div className="animate-fade-in-up space-y-12">
            
            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: data.palette.primary }}>
                Overview: {data.topic}
              </h2>
              <div className="prose prose-slate max-w-none text-gray-700 whitespace-pre-wrap">
                {data.summary_markdown}
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Layers className="w-5 h-5 mr-2" /> Learning Modules
              </h3>
              
              {data.modules.map((module, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300"
                  style={{ borderColor: expandedModule === idx ? data.palette.primary : '' }}
                >
                  <button 
                    onClick={() => toggleModule(idx)}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md"
                        style={{ backgroundColor: data.palette.primary }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: data.palette.accent }}>
                          {module.level}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{module.title}</h4>
                      </div>
                    </div>
                    {expandedModule === idx ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </button>

                  {expandedModule === idx && (
                    <div className="border-t border-gray-100 p-6 space-y-8 bg-gray-50/50">
                      
                      {/* Subtopics */}
                      <div className="space-y-6">
                        {module.subtopics.map((sub, sIdx) => (
                          <div key={sIdx} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                            <h5 className="font-bold text-gray-800 text-lg mb-2">{sub.concept}</h5>
                            <p className="text-gray-600 mb-4">{sub.explanation}</p>
                            
                            {/* Resources */}
                            <div className="mb-4 space-y-2">
                              <span className="text-xs font-semibold text-gray-400 uppercase">Resources</span>
                              {sub.resources.map((res, rIdx) => (
                                <a 
                                  key={rIdx} 
                                  href={res.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="flex items-center justify-between p-2 rounded hover:bg-blue-50 transition-colors group border border-gray-100 hover:border-blue-100"
                                >
                                  <div className="flex items-center space-x-2">
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                    <span className="text-sm font-medium text-blue-600 group-hover:underline">
                                      {res.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded">{res.type}</span>
                                    <span>{res.duration}</span>
                                  </div>
                                </a>
                              ))}
                            </div>

                            {/* Task */}
                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <span className="font-bold text-yellow-800 block mb-1">Hands-on Task</span>
                                  <p className="text-sm text-yellow-800 mb-2">{sub.task}</p>
                                  <div className="text-xs text-yellow-700 bg-yellow-100/50 p-2 rounded">
                                    <strong>Acceptance Criteria:</strong> {sub.acceptance_criteria}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Module Project */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Trophy className="w-5 h-5 text-indigo-600" />
                          <h5 className="font-bold text-indigo-900">Module Project: {module.project.title}</h5>
                        </div>
                        <p className="text-indigo-800 text-sm">{module.project.description}</p>
                      </div>

                      {/* Module Quiz */}
                      <QuizSection 
                        title={`Quiz: ${module.title}`} 
                        questions={module.quiz} 
                        color={data.palette.primary} 
                      />

                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Final Assessment & Career */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setShowFinalQuiz(!showFinalQuiz)}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Award className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Final Assessment</h3>
                <p className="text-sm text-gray-500 mt-1">Test your knowledge with 10+ questions</p>
              </button>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <BrainCircuit className="w-5 h-5" style={{ color: data.palette.accent }} />
                  <h3 className="font-bold text-gray-900">Next Steps</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {data.career_guidance.next_steps.map((step, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2 text-gray-400">•</span> {step}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Recommended Certifications</span>
                  <div className="flex flex-wrap gap-2">
                    {data.career_guidance.certifications.map((cert, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {showFinalQuiz && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-fade-in-up">
                <QuizSection 
                  title="Final Certification Exam" 
                  questions={data.final_assessment} 
                  color={data.palette.primary} 
                />
              </div>
            )}

            <div className="text-center pt-10 text-gray-400 text-sm">
              Generated by SkillPath AI with Gemini 2.5
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Sub-component for Quizzes
const QuizSection: React.FC<{ title: string, questions: QuizQuestion[], color: string }> = ({ title, questions, color }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h6 className="font-bold text-gray-800">{title}</h6>
        <button 
          onClick={() => setShowAnswers(!showAnswers)}
          className="text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          style={{ color: showAnswers ? color : '#6b7280' }}
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
      </div>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="font-medium text-gray-800 text-sm mb-3">{i + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => {
                const isCorrect = opt === q.correct_answer;
                return (
                  <div 
                    key={oIdx} 
                    className={`text-sm p-2 rounded border ${
                      showAnswers && isCorrect 
                        ? 'bg-green-50 border-green-200 text-green-800 font-medium' 
                        : 'bg-white border-gray-100 text-gray-600'
                    }`}
                  >
                    {opt}
                    {showAnswers && isCorrect && <CheckCircle2 className="w-3 h-3 inline ml-2 text-green-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;